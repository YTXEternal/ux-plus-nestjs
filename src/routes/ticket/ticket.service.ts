import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket } from '@/databases/mysql-database/model/ticket.model';
import { Arrange } from '@/databases/mysql-database/model/arrange.model';
import { Member } from '@/databases/mysql-database/model/member.model';
import { CreateTicketDto, ListTicketDto } from './dto/ticket.dto';
import { Sequelize } from 'sequelize-typescript';
import { SysDrama } from '@/databases/mysql-database/model/sys-drama.model';
import { Shop } from '@/databases/mysql-database/model/shop.model';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket)
    private readonly ticketModel: typeof Ticket,
    @InjectModel(Arrange)
    private readonly arrangeModel: typeof Arrange,
    private sequelize: Sequelize,
  ) {}

  /**
   * 购票
   */
  async create(createTicketDto: CreateTicketDto) {
    const { arrange_id, count } = createTicketDto;
    const transaction = await this.sequelize.transaction();

    try {
      // 1. 查询排场信息
      const arrange = await this.arrangeModel.findByPk(arrange_id, {
        transaction,
      });
      if (!arrange) {
        throw new BadRequestException('排场不存在');
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
          status: '0', // 未支付
          ticket_time: new Date(),
          create_time: new Date(),
          update_time: new Date(),
        } as any,
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
    const { pageNum = 1, pageSize = 10 } = query;

    const { rows, count } = await this.ticketModel.findAndCountAll({
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
  async findOne(id: number) {
    return this.ticketModel.findByPk(id, {
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
}
