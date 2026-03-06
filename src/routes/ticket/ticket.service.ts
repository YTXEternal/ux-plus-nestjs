import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket } from '@/databases/mysql-database/model/ticket.model';
import { Arrange } from '@/databases/mysql-database/model/arrange.model';
import { Member } from '@/databases/mysql-database/model/member.model';
import {
  CreateTicketDto,
  ListTicketDto,
  TicketPayDto,
  TicketPayStatusDto,
  TicketRefundDto,
} from './dto/ticket.dto';
import { Sequelize } from 'sequelize-typescript';
import { SysDrama } from '@/databases/mysql-database/model/sys-drama.model';
import { Shop } from '@/databases/mysql-database/model/shop.model';
import { ConfigService } from '@nestjs/config';
import { AlipaySdk, AlipaySdkCommonResult } from 'alipay-sdk';
import { Op, Transaction } from 'sequelize';

const TICKET_STATUS_UNPAID = '0';
const TICKET_STATUS_PAID = '1';
const TICKET_STATUS_EXPIRED = '2';
const TICKET_STATUS_REFUNDED = '3';

@Injectable()
export class TicketService {
  private readonly alipaySdk: AlipaySdk;

  constructor(
    @InjectModel(Ticket)
    private readonly ticketModel: typeof Ticket,
    @InjectModel(Arrange)
    private readonly arrangeModel: typeof Arrange,
    @InjectModel(Shop)
    private readonly shopModel: typeof Shop,
    private readonly configService: ConfigService,
    private sequelize: Sequelize,
  ) {
    this.alipaySdk = new AlipaySdk({
      appId: this.configService.get<string>('ALIPAY_SENDBOX_APPID') ?? '',
      privateKey:
        this.configService.get<string>('ALIPAY_SENDBOX_PRIVATE_KEY') ?? '',
      alipayPublicKey:
        this.configService.get<string>('ALIPAY_SENDBOX_PUBLIC_KEY') ?? '',
      gateway:
        this.configService.get<string>('ALIPAY_SENDBOX_GATEWAY_URL') ?? '',
    });
  }

  /**
   * 购票
   */
  async create(createTicketDto: CreateTicketDto) {
    const { arrange_id, count, shop_id } = createTicketDto;
    const transaction = await this.sequelize.transaction();

    try {
      await this.ensureShopExists(shop_id, transaction);

      // 1. 查询排场信息
      const arrange = await this.arrangeModel.findByPk(arrange_id, {
        transaction,
      });
      if (!arrange) {
        throw new BadRequestException('排场不存在');
      }
      if (arrange.shop_id !== shop_id) {
        throw new BadRequestException('排场与门店不匹配');
      }

      // 2. 检查库存
      if (arrange.remaining_tickets < count) {
        throw new BadRequestException('剩余票数不足');
      }

      // 3. 计算金额
      const pay_amount = arrange.price * count;

      // 4. 创建购票记录
      const ticket = await this.ticketModel.create(
        {
          ...createTicketDto,
          pay_amount,
          status: TICKET_STATUS_UNPAID,
          create_time: new Date(),
          update_time: new Date(),
        },
        { transaction },
      );

      // 5. 扣减库存
      await arrange.update(
        {
          remaining_tickets: arrange.remaining_tickets - count,
          update_time: new Date(),
        },
        { transaction },
      );

      await transaction.commit();
      return ticket;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 分页查询购票列表
   */
  async findAll(query: ListTicketDto) {
    const { pageNum = 1, pageSize = 10, shop_id } = query;
    await this.ensureShopExists(shop_id);

    const { rows, count } = await this.ticketModel.findAndCountAll({
      where: { shop_id },
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
      include: [
        {
          model: Arrange,
          include: [
            { model: SysDrama, attributes: ['name'] },
            { model: Shop, attributes: ['name'] },
          ],
        },
        { model: Member, attributes: ['name', 'phone'] },
      ],
    });

    return { rows, total: count };
  }

  /**
   * 查询购票详情
   */
  async findOne(id: number, shop_id: number) {
    await this.ensureShopExists(shop_id);
    return this.ticketModel.findOne({
      where: { ticket_id: id, shop_id },
      include: [
        {
          model: Arrange,
          include: [
            { model: SysDrama, attributes: ['name'] },
            { model: Shop, attributes: ['name'] },
          ],
        },
        { model: Member, attributes: ['name', 'phone'] },
      ],
    });
  }

  async pay(body: TicketPayDto) {
    const ticket = await this.getTicketOrThrow(body.ticket_id, body.shop_id);
    if (ticket.status !== TICKET_STATUS_UNPAID) {
      throw new BadRequestException('当前购票状态不允许支付');
    }

    const outTradeNo = this.getOutTradeNo(ticket.ticket_id);
    const result = await this.alipaySdk.exec('alipay.trade.precreate', {
      bizContent: {
        outTradeNo,
        totalAmount: Number(ticket.pay_amount).toFixed(2),
        subject: `购票订单${ticket.ticket_id}`,
      },
    });

    if (result.code !== '10000') {
      throw new BadRequestException(
        result.sub_msg || result.msg || '支付下单失败',
      );
    }

    return {
      ticket_id: ticket.ticket_id,
      shop_id: ticket.shop_id,
      out_trade_no: outTradeNo,
      qr_code: result.qr_code,
    };
  }

  async queryPayStatus(query: TicketPayStatusDto) {
    const ticket = await this.getTicketOrThrow(query.ticket_id, query.shop_id);
    if (ticket.status === TICKET_STATUS_PAID) {
      return {
        ticket_id: ticket.ticket_id,
        shop_id: ticket.shop_id,
        status: ticket.status,
        trade_status: 'TRADE_SUCCESS',
      };
    }
    if (
      ticket.status === TICKET_STATUS_EXPIRED ||
      ticket.status === TICKET_STATUS_REFUNDED
    ) {
      return {
        ticket_id: ticket.ticket_id,
        shop_id: ticket.shop_id,
        status: ticket.status,
        trade_status: 'TRADE_CLOSED',
      };
    }

    const outTradeNo = this.getOutTradeNo(ticket.ticket_id);
    const result = await this.alipaySdk.exec('alipay.trade.query', {
      bizContent: {
        outTradeNo,
      },
    });

    const tradeStatus = `${result.trade_status ?? ''}`;
    if (result.code === '10000' && tradeStatus === 'TRADE_SUCCESS') {
      await ticket.update({
        status: TICKET_STATUS_PAID,
        update_time: new Date(),
      });
      return {
        ticket_id: ticket.ticket_id,
        shop_id: ticket.shop_id,
        status: TICKET_STATUS_PAID,
        trade_status: tradeStatus,
      };
    }

    return {
      ticket_id: ticket.ticket_id,
      shop_id: ticket.shop_id,
      status: ticket.status,
      trade_status: tradeStatus || 'WAIT_BUYER_PAY',
    };
  }

  async refund(body: TicketRefundDto) {
    const ticket = await this.getTicketOrThrow(body.ticket_id, body.shop_id);
    if (ticket.status !== TICKET_STATUS_PAID) {
      throw new BadRequestException('当前购票状态不允许退款');
    }

    const outTradeNo = this.getOutTradeNo(ticket.ticket_id);
    const result = await this.alipaySdk.exec('alipay.trade.refund', {
      bizContent: {
        outTradeNo,
        refundAmount: Number(ticket.pay_amount).toFixed(2),
      },
    });

    if (result.code !== '10000') {
      throw new BadRequestException(result.sub_msg || result.msg || '退款失败');
    }

    await ticket.update({
      status: TICKET_STATUS_REFUNDED,
      update_time: new Date(),
    });

    return {
      ticket_id: ticket.ticket_id,
      shop_id: ticket.shop_id,
      status: TICKET_STATUS_REFUNDED,
      refund_fee: result.refund_fee,
    };
  }

  async expireUnpaidTickets() {
    const expiredBefore = new Date(Date.now() - 10 * 60 * 1000);
    const [affectedCount] = await this.ticketModel.update(
      {
        status: TICKET_STATUS_EXPIRED,
        update_time: new Date(),
      },
      {
        where: {
          status: TICKET_STATUS_UNPAID,
          create_time: {
            [Op.lte]: expiredBefore,
          },
        },
      },
    );
    return affectedCount;
  }

  private getOutTradeNo(ticketId: number) {
    return `ticket_${ticketId}`;
  }

  private async ensureShopExists(shop_id: number, transaction?: Transaction) {
    const shop = await this.shopModel.findOne({
      where: { shop_id, del_flag: '0' },
      transaction,
    });
    if (!shop) {
      throw new BadRequestException('门店不存在');
    }
  }

  private async getTicketOrThrow(ticket_id: number, shop_id: number) {
    await this.ensureShopExists(shop_id);
    const ticket = await this.ticketModel.findOne({
      where: { ticket_id, shop_id },
    });
    if (!ticket) {
      throw new BadRequestException('购票记录不存在');
    }
    return ticket;
  }
}
