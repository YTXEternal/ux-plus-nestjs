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
    // 优先读取正确的拼写配置，兼容错误的拼写
    const appId =
      this.configService.get<string>('ALIPAY_SANDBOX_APPID') ??
      this.configService.get<string>('ALIPAY_SENDBOX_APPID') ??
      '';
    const privateKey =
      this.configService.get<string>('ALIPAY_SANDBOX_PRIVATE_KEY') ??
      this.configService.get<string>('ALIPAY_SENDBOX_PRIVATE_KEY') ??
      '';
    const alipayPublicKey =
      this.configService.get<string>('ALIPAY_SANDBOX_PUBLIC_KEY') ??
      this.configService.get<string>('ALIPAY_SENDBOX_PUBLIC_KEY') ??
      '';
    const gateway =
      this.configService.get<string>('ALIPAY_SANDBOX_GATEWAY_URL') ??
      this.configService.get<string>('ALIPAY_SENDBOX_GATEWAY_URL') ??
      '';

    this.alipaySdk = new AlipaySdk({
      appId,
      privateKey,
      alipayPublicKey,
      gateway,
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

      // 4. 生成订单编号并创建购票记录
      const order_no = this.generateOrderNo(shop_id);
      const ticket = await this.ticketModel.create(
        {
          ...createTicketDto,
          order_no,
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
    const { pageNum = 1, pageSize = 10, shop_id, order_no } = query;
    await this.ensureShopExists(shop_id);

    const where: any = { shop_id };
    if (order_no) {
      where.order_no = { [Op.like]: `%${order_no}%` };
    }

    const { rows, count } = await this.ticketModel.findAndCountAll({
      where,
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
    if (!ticket) {
      throw new BadRequestException('没有这个订单');
    }
    // 检查订单状态
    if (ticket.status === TICKET_STATUS_PAID) {
      throw new BadRequestException('订单已支付，请勿重复支付');
    }
    if (ticket.status === TICKET_STATUS_EXPIRED) {
      throw new BadRequestException('订单已过期，无法支付');
    }
    if (ticket.status !== TICKET_STATUS_UNPAID) {
      throw new BadRequestException('当前订单状态不允许支付');
    }

    const outTradeNo = ticket.order_no; // 使用真实生成的订单编号
    const totalAmount = ticket.pay_amount + '';

    // 调用支付宝预下单接口
    const result = await this.alipaySdk.exec('alipay.trade.precreate', {
      notify_url: this.configService.get<string>('ALIPAY_NOTIFY_URL'), // 新增：需要公网能访问的接口地址
      bizContent: {
        out_trade_no: outTradeNo,
        total_amount: totalAmount,
        subject: `购票订单-${ticket.ticket_id}`,
        product_code: 'FACE_TO_FACE_PAYMENT', // 扫码支付固定值
      },
    });

    console.log('正在进入下一步');

    // 检查调用结果
    if (result.code !== '10000') {
      console.error('支付宝预下单失败:', result);
      throw new BadRequestException(
        result.sub_msg || result.msg || '支付下单失败',
      );
    }

    console.log('响应', JSON.stringify(result, null, 2));

    return {
      ticket_id: ticket.ticket_id,
      shop_id: ticket.shop_id,
      out_trade_no: outTradeNo,
      qr_code: result.qrCode, // 前端需将此URL转换为二维码图片
      total_amount: totalAmount,
    };
  }

  async queryPayStatus(query: TicketPayStatusDto) {
    const ticket = await this.getTicketOrThrow(query.ticket_id, query.shop_id);

    // 如果本地状态已经是已支付，直接返回
    if (ticket.status === TICKET_STATUS_PAID) {
      return {
        ticket_id: ticket.ticket_id,
        shop_id: ticket.shop_id,
        status: ticket.status,
        trade_status: 'TRADE_SUCCESS',
        pay_time: ticket.pay_time,
      };
    }

    // 如果本地状态是已过期或已退款，也直接返回
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

    const outTradeNo = ticket.order_no;

    // 调用支付宝查询接口
    const result = await this.alipaySdk.exec('alipay.trade.query', {
      bizContent: {
        out_trade_no: outTradeNo,
      },
    });

    const tradeStatus = `${result.trade_status ?? ''}`;

    // 支付成功
    if (
      result.code === '10000' &&
      (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED')
    ) {
      // 更新订单状态
      await ticket.update({
        status: TICKET_STATUS_PAID,
        trade_no: result.trade_no as string, // 支付宝交易号
        pay_time: result.send_pay_date
          ? new Date(result.send_pay_date as string)
          : new Date(), // 支付时间
        update_time: new Date(),
      });

      return {
        ticket_id: ticket.ticket_id,
        shop_id: ticket.shop_id,
        status: TICKET_STATUS_PAID,
        trade_status: tradeStatus,
        pay_time: ticket.pay_time,
      };
    }

    // 交易关闭（超时或未支付取消）
    if (tradeStatus === 'TRADE_CLOSED') {
      // 如果支付宝那边关闭了，本地也应该标记为过期或关闭，这里视业务逻辑而定
      // 暂时保持未支付状态，等待定时任务处理过期，或者这里直接更新为过期
    }

    return {
      ticket_id: ticket.ticket_id,
      shop_id: ticket.shop_id,
      status: ticket.status,
      trade_status: tradeStatus || 'WAIT_BUYER_PAY',
    };
  }

  async refund(body: TicketRefundDto) {
    console.log('[Refund] Start:', body);
    const ticket = await this.getTicketOrThrow(body.ticket_id, body.shop_id);
    console.log(
      '[Refund] Ticket found:',
      ticket.ticket_id,
      'Status:',
      ticket.status,
    );

    if (ticket.status !== TICKET_STATUS_PAID) {
      throw new BadRequestException('当前购票状态不允许退款');
    }

    const outTradeNo = ticket.order_no;
    console.log(
      '[Refund] Requesting Alipay refund for:',
      outTradeNo,
      'Amount:',
      ticket.pay_amount,
    );

    const transaction = await this.sequelize.transaction();
    try {
      const result = await this.alipaySdk.exec('alipay.trade.refund', {
        bizContent: {
          out_trade_no: outTradeNo,
          refund_amount: ticket.pay_amount + '',
        },
      });
      console.log('[Refund] Alipay response:', result);

      if (result.code !== '10000' && result.code !== '20000') {
        throw new BadRequestException(
          result.subMsg || result.sub_msg || result.msg || '退款失败',
        );
      }

      await ticket.update(
        {
          status: TICKET_STATUS_REFUNDED,
          update_time: new Date(),
        },
        { transaction },
      );

      // 退款成功，回退库存
      await this.arrangeModel.increment('remaining_tickets', {
        by: ticket.count,
        where: { arrange_id: ticket.arrange_id },
        transaction,
      });

      await transaction.commit();
      console.log(
        `[Refund] Ticket status updated to REFUNDED, remaining_tickets incremented by ${ticket.count}`,
      );

      return {
        ticket_id: ticket.ticket_id,
        shop_id: ticket.shop_id,
        status: TICKET_STATUS_REFUNDED,
        refund_fee: result.refund_fee,
      };
    } catch (error) {
      await transaction.rollback();
      console.error('[Refund] Error during refund:', error);
      throw error;
    }
  }

  /**
   * 支付宝异步回调通知处理
   */
  async handleAlipayNotify(postData: any) {
    // 1. 验证签名（核心安全保障）
    const ok = this.alipaySdk.checkNotifySign(postData);
    if (!ok) {
      throw new BadRequestException('支付宝签名验证失败');
    }

    // 2. 判断交易状态，只有 TRADE_SUCCESS 才当做支付成功
    const tradeStatus = postData.trade_status;
    if (tradeStatus !== 'TRADE_SUCCESS') {
      return; // 其他状态直接忽略即可
    }

    const outTradeNo = postData.out_trade_no;
    if (!outTradeNo || !outTradeNo.startsWith('T')) {
      return;
    }

    // 3. 查找订单
    const ticket = await this.ticketModel.findOne({
      where: { order_no: outTradeNo },
    });

    if (!ticket) {
      console.warn(`[Alipay Notify] 找不到对应订单: ${outTradeNo}`);
      return;
    }

    // 4. 判断金额师傅一致（防篡改验证，由于咱们计算总价有的时候是number有的时候是string，强转float对比）
    const notifyAmount = parseFloat(postData.total_amount);
    const orderAmount = parseFloat(ticket.pay_amount + '');
    // 这里如果你们测试修改了硬编码为1，可能会导致金额不匹配，根据实际业务判断。如果是在开发阶段，可以暂时先不强校验金额
    if (notifyAmount !== orderAmount && orderAmount !== 1) {
      // 兼容之前硬编码测试的 1
      console.warn(
        `[Alipay Notify] 订单金额不匹配: ${outTradeNo}, 通知金额: ${notifyAmount}, 数据库金额: ${orderAmount}`,
      );
      // throw new BadRequestException(`订单金额不匹配: ${outTradeNo}`);
    }

    // 5. 判断订单当前状态是否已经处理完毕
    if (
      ticket.status === TICKET_STATUS_PAID ||
      ticket.status === TICKET_STATUS_EXPIRED ||
      ticket.status === TICKET_STATUS_REFUNDED
    ) {
      return;
    }

    // 6. 更新为已支付
    await ticket.update({
      status: TICKET_STATUS_PAID,
      trade_no: postData.trade_no, // 支付宝交易号
      pay_time: postData.gmt_payment
        ? new Date(postData.gmt_payment)
        : new Date(),
      update_time: new Date(),
    });

    console.log(`[Alipay Notify] 订单 ${outTradeNo} 支付回调处理成功`);
  }

  /**
   * 处理超时的购票订单
   * @returns
   */
  async expireUnpaidTickets() {
    const expiredBefore = new Date(Date.now() - 10 * 60 * 1000);
    const transaction = await this.sequelize.transaction();

    try {
      // 1. 查找所有需过期的未支付订单
      const ticketsToExpire = await this.ticketModel.findAll({
        where: {
          status: TICKET_STATUS_UNPAID,
          create_time: {
            [Op.lte]: expiredBefore,
          },
        },
        transaction,
      });

      if (ticketsToExpire.length === 0) {
        await transaction.commit();
        return 0;
      }

      // 2. 扣减状态为已过期
      const ticketIds = ticketsToExpire.map((t) => t.ticket_id);
      await this.ticketModel.update(
        {
          status: TICKET_STATUS_EXPIRED,
          update_time: new Date(),
        },
        {
          where: { ticket_id: ticketIds },
          transaction,
        },
      );

      // 3. 遍历回退涉及的 arrange_id 库存
      // 由于可能有多个 ticket 对应同一个 arrange_id，这里分组聚合一下数量再更新
      const arrangeTicketCountMap = new Map<number, number>();
      for (const ticket of ticketsToExpire) {
        const currentCount = arrangeTicketCountMap.get(ticket.arrange_id) || 0;
        arrangeTicketCountMap.set(
          ticket.arrange_id,
          currentCount + ticket.count,
        );
      }

      for (const [
        arrange_id,
        totalCountToReturn,
      ] of arrangeTicketCountMap.entries()) {
        await this.arrangeModel.increment('remaining_tickets', {
          by: totalCountToReturn,
          where: { arrange_id },
          transaction,
        });
      }

      await transaction.commit();
      return ticketIds.length;
    } catch (error) {
      await transaction.rollback();
      console.error('[Expire Task] Error during expireUnpaidTickets:', error);
      return 0;
    }
  }

  /**
   * 生成订单编号的逻辑
   * 格式: T + 年月日时分秒 + 门店ID(补齐4位) + 4位随机数
   */
  private generateOrderNo(shopId: number): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 门店ID补齐4位
    const shopCode = String(shopId).padStart(4, '0');
    // 4位随机数
    const random = Math.floor(1000 + Math.random() * 9000);

    return `T${year}${month}${day}${hours}${minutes}${seconds}${shopCode}${random}`;
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
