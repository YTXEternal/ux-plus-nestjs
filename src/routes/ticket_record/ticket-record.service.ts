import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TicketRecord } from '@/databases/mysql-database/model/ticket-record.model';
import { Ticket } from '@/databases/mysql-database/model/ticket.model';
import { Arrange } from '@/databases/mysql-database/model/arrange.model';
import { Member } from '@/databases/mysql-database/model/member.model';
import { SysDrama } from '@/databases/mysql-database/model/sys-drama.model';
import { Shop } from '@/databases/mysql-database/model/shop.model';
import { ListTicketRecordDto, RefundTicketDto } from './dto/ticket-record.dto';
import { ConfigService } from '@nestjs/config';
import { AlipaySdk } from 'alipay-sdk';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TicketRecordService {
  private alipaySdk: AlipaySdk;

  constructor(
    @InjectModel(TicketRecord)
    private readonly ticketRecordModel: typeof TicketRecord,
    @InjectModel(Ticket)
    private readonly ticketModel: typeof Ticket,
    @InjectModel(Arrange)
    private readonly arrangeModel: typeof Arrange,
    private readonly configService: ConfigService,
    private sequelize: Sequelize,
  ) {
    this.initAlipay();
  }

  private initAlipay() {
    const appId = this.configService.get<string>('ALIPAY_SENDBOX_APPID');
    const privateKey = this.configService.get<string>(
      'ALIPAY_SENDBOX_PRIVATE_KEY',
    );
    const alipayPublicKey = this.configService.get<string>(
      'ALIPAY_SENDBOX_PUBLIC_KEY',
    );
    const gateway = this.configService.get<string>(
      'ALIPAY_SENDBOX_GATEWAY_URL',
    );

    if (appId && privateKey) {
      this.alipaySdk = new AlipaySdk({
        appId,
        privateKey,
        alipayPublicKey,
        gateway,
      });
    }
  }

  /**
   * 支付
   */
  async pay(ticketId: number) {
    const ticket = await this.ticketModel.findByPk(ticketId, {
      include: [
        {
          model: Arrange,
          include: [{ model: SysDrama }, { model: Shop, attributes: ['name'] }],
        },
      ],
    });
    if (!ticket) {
      throw new BadRequestException('订单不存在');
    }
    if (ticket.status !== '0') {
      throw new BadRequestException('订单状态不正确');
    }

    if (!this.alipaySdk) {
      // 如果没有配置支付宝，直接模拟成功
      return this.mockPaySuccess(ticket);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const result = await this.alipaySdk.pageExec('alipay.trade.page.pay', {
        bizContent: {
          outTradeNo: `TICKET_${ticket.ticket_id}_${Date.now()}`,
          productCode: 'FAST_INSTANT_TRADE_PAY',
          totalAmount: ticket.pay_amount.toString(),
          subject: `购买 ${ticket.arrange.drama.name} 门票`,
          body: `购买 ${ticket.count} 张`,
        },
      });
      return { payUrl: result };
    } catch (e) {
      // 记录失败记录
      await this.ticketRecordModel.create({
        ticket_id: ticket.ticket_id,
        type: '1', // 支付
        amount: ticket.pay_amount,
        status: '0', // 失败
        create_time: new Date(),
        remark: e.message,
      } as any);
      throw new BadRequestException('生成支付链接失败: ' + e.message);
    }
  }

  // 模拟支付成功逻辑 (用于没有支付宝配置或测试)
  async mockPaySuccess(ticket: Ticket) {
    const transaction = await this.sequelize.transaction();
    try {
      await ticket.update(
        { status: '1', update_time: new Date() },
        { transaction },
      );

      await this.ticketRecordModel.create(
        {
          ticket_id: ticket.ticket_id,
          type: '1', // 支付
          amount: ticket.pay_amount,
          trade_no: `MOCK_${Date.now()}`,
          status: '1', // 成功
          create_time: new Date(),
          remark: '模拟支付成功',
        } as any,
        { transaction },
      );

      await transaction.commit();
      return { message: '模拟支付成功' };
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  /**
   * 退款
   */
  async refund(refundTicketDto: RefundTicketDto) {
    const { ticket_id, reason } = refundTicketDto;
    const transaction = await this.sequelize.transaction();

    try {
      const ticket = await this.ticketModel.findByPk(ticket_id);
      if (!ticket) {
        throw new BadRequestException('订单不存在');
      }
      if (ticket.status !== '1') {
        throw new BadRequestException('订单未支付或已退款');
      }

      // 调用支付宝退款接口
      if (this.alipaySdk) {
        try {
          // 简单起见，我们假设 out_trade_no 就是 TICKET_{id} 格式
          await this.alipaySdk.exec('alipay.trade.refund', {
            bizContent: {
              out_trade_no: `TICKET_${ticket.ticket_id}`,
              refund_amount: ticket.pay_amount.toString(),
              refund_reason: reason,
            },
          });
        } catch (e) {
          // 记录退款失败
          await this.ticketRecordModel.create(
            {
              ticket_id: ticket.ticket_id,
              type: '2', // 退款
              amount: ticket.pay_amount,
              status: '0', // 失败
              create_time: new Date(),
              remark: '支付宝退款失败: ' + e.message,
            } as any,
            { transaction },
          );
          throw new BadRequestException('支付宝退款失败');
        }
      }

      // 更新订单状态
      await ticket.update(
        { status: '3', update_time: new Date() },
        { transaction },
      );

      // 记录退款流水
      await this.ticketRecordModel.create(
        {
          ticket_id: ticket.ticket_id,
          type: '2', // 退款
          amount: ticket.pay_amount,
          status: '1', // 成功
          create_time: new Date(),
          remark: reason,
        } as any,
        { transaction },
      );

      // 恢复库存
      const arrange = await this.arrangeModel.findByPk(ticket.arrange_id, {
        transaction,
      });
      if (arrange) {
        await arrange.update(
          {
            remaining_tickets: arrange.remaining_tickets + ticket.count,
            update_time: new Date(),
          },
          { transaction },
        );
      }

      await transaction.commit();
      return { message: '退款成功' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 分页查询记录列表
   */
  async findAll(query: ListTicketRecordDto) {
    const { pageNum = 1, pageSize = 10 } = query;

    const { rows, count } = await this.ticketRecordModel.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
      include: [
        {
          model: Ticket,
          include: [
            {
              model: Arrange,
              include: [{ model: SysDrama, attributes: ['name'] }],
            },
            { model: Member, attributes: ['name'] },
          ],
        },
      ],
    });

    return { rows, total: count };
  }

  /**
   * 查询详情
   */
  async findOne(id: number) {
    return this.ticketRecordModel.findByPk(id, {
      include: [
        {
          model: Ticket,
          include: [
            {
              model: Arrange,
              include: [
                { model: SysDrama, attributes: ['name'] },
                { model: Shop, attributes: ['name'] },
              ],
            },
            { model: Member, attributes: ['name'] },
          ],
        },
      ],
    });
  }
}
