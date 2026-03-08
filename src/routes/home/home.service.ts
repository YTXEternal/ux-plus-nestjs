import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { Op } from 'sequelize';
import * as dayjs from 'dayjs';
import { HomeStatistics } from '../../databases/mysql-database/model/home-statistics.model';
import { Ticket } from '../../databases/mysql-database/model/ticket.model';
import { Member } from '../../databases/mysql-database/model/member.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class HomeService implements OnModuleInit {
  private readonly logger = new Logger(HomeService.name);
  private jobName = 'home_statistics_job';

  constructor(
    @InjectModel(HomeStatistics)
    private readonly homeStatisticsModel: typeof HomeStatistics,
    @InjectModel(Ticket)
    private readonly ticketModel: typeof Ticket,
    @InjectModel(Member)
    private readonly memberModel: typeof Member,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {}

  onModuleInit() {
    this.initCronJob();
  }

  /**
   * 初始化定时任务
   */
  private initCronJob() {
    const intervalStr =
      this.configService.get<string>('HOME_STATS_INTERVAL') || '1h';
    this.logger.log(
      `Initializing home statistics job with interval: ${intervalStr}`,
    );

    let cronExpression = '';

    // 解析时间间隔为 Cron 表达式
    // 支持格式：{number}{unit}，例如：60s, 1m, 1h, 1day
    const match = intervalStr.match(/^(\d+)(s|m|h|day|d)$/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];

      if (unit === 's') {
        if (value === 60) {
          cronExpression = '0 * * * * *';
        } else if (value < 60) {
          cronExpression = `*/${value} * * * * *`;
        } else {
          // 如果秒数大于60，转换为分钟处理（简单处理）
          const minutes = Math.floor(value / 60);
          cronExpression = `0 */${minutes} * * * *`;
        }
      } else if (unit === 'm') {
        if (value === 60) {
          cronExpression = '0 0 * * * *';
        } else if (value < 60) {
          cronExpression = `0 */${value} * * * *`;
        } else {
          const hours = Math.floor(value / 60);
          cronExpression = `0 0 */${hours} * * *`;
        }
      } else if (unit === 'h') {
        if (value === 24) {
          cronExpression = '0 0 0 * * *';
        } else if (value < 24) {
          cronExpression = `0 0 */${value} * * *`;
        } else {
          const days = Math.floor(value / 24);
          cronExpression = `0 0 0 */${days} * *`;
        }
      } else if (unit === 'day' || unit === 'd') {
        cronExpression = `0 0 0 */${value} * *`;
      }
    } else {
      // 默认每小时
      this.logger.warn(
        `Unsupported interval format: ${intervalStr}, defaulting to 1h`,
      );
      cronExpression = '0 0 * * * *';
    }

    try {
      // 检查任务是否已存在，如果存在则删除（避免热重载导致的重复）
      if (this.schedulerRegistry.doesExist('cron', this.jobName)) {
        this.schedulerRegistry.deleteCronJob(this.jobName);
      }

      const job = new CronJob(cronExpression, () => {
        // 间隔时间仅作为执行频率，每次执行都统计过去30天的数据
        void this.runStatisticsTask();
      });

      this.schedulerRegistry.addCronJob(this.jobName, job as any);
      job.start();
      this.logger.log(`Home statistics job started: ${cronExpression}`);
    } catch (error) {
      this.logger.error('Failed to initialize cron job', error);
    }
  }

  /**
   * 执行统计任务
   * 统计过去30天的数据，按天聚合
   */
  async runStatisticsTask() {
    this.logger.log('Starting statistics task (Last 30 days)...');

    // 统计范围：过去30天（包含今天）
    const now = dayjs();
    const startDate = now.subtract(30, 'day').startOf('day');
    const endDate = now.endOf('day');

    const startDateDate = startDate.toDate();
    const endDateDate = endDate.toDate();

    this.logger.log(
      `Statistics range: ${startDate.format()} - ${endDate.format()}`,
    );

    const transaction = await this.sequelize.transaction();

    try {
      // 1. 统计每个店铺每一天的会员增长
      const memberGrowth = await this.memberModel.findAll({
        attributes: [
          'shop_id',
          [Sequelize.fn('DATE', Sequelize.col('create_time')), 'stats_date'],
          [Sequelize.fn('COUNT', Sequelize.col('member_id')), 'count'],
        ],
        where: {
          create_time: {
            [Op.gte]: startDateDate,
            [Op.lte]: endDateDate,
          },
          shop_id: { [Op.ne]: null },
        } as any,
        group: ['shop_id', 'stats_date'],
        raw: true,
        transaction,
      });

      // 2. 统计每个店铺每一天的销售额 (status=1 已支付)
      const sales = await this.ticketModel.findAll({
        attributes: [
          'shop_id',
          [Sequelize.fn('DATE', Sequelize.col('pay_time')), 'stats_date'],
          [Sequelize.fn('SUM', Sequelize.col('pay_amount')), 'total_amount'],
        ],
        where: {
          pay_time: {
            [Op.gte]: startDateDate,
            [Op.lte]: endDateDate,
          },
          status: '1',
        },
        group: ['shop_id', 'stats_date'],
        raw: true,
        transaction,
      });

      // 3. 统计每个店铺每一天的退款 (status=3 已退款)
      const refunds = await this.ticketModel.findAll({
        attributes: [
          'shop_id',
          [Sequelize.fn('DATE', Sequelize.col('update_time')), 'stats_date'],
          [Sequelize.fn('SUM', Sequelize.col('pay_amount')), 'refund_amount'],
          [Sequelize.fn('COUNT', Sequelize.col('ticket_id')), 'refund_count'],
        ],
        where: {
          update_time: {
            [Op.gte]: startDateDate,
            [Op.lte]: endDateDate,
          },
          status: '3',
        },
        group: ['shop_id', 'stats_date'],
        raw: true,
        transaction,
      });

      // 4. 汇总数据
      // 需要按 shop_id 和 stats_date 组合
      const dataMap = new Map<string, any>();

      const getKey = (shopId: number, dateStr: string) =>
        `${shopId}_${dateStr}`;

      // 处理会员增长
      memberGrowth.forEach((item: any) => {
        // stats_date 可能是 string 也可能是 Date 对象，取决于驱动
        const dateStr = dayjs(item.stats_date).format('YYYY-MM-DD');
        const key = getKey(item.shop_id, dateStr);
        if (!dataMap.has(key)) {
          dataMap.set(key, { shop_id: item.shop_id, stats_time: dateStr });
        }
        dataMap.get(key).member_growth = Number(item.count);
      });

      // 处理销售额
      sales.forEach((item: any) => {
        const dateStr = dayjs(item.stats_date).format('YYYY-MM-DD');
        const key = getKey(item.shop_id, dateStr);
        if (!dataMap.has(key)) {
          dataMap.set(key, { shop_id: item.shop_id, stats_time: dateStr });
        }
        dataMap.get(key).ticket_sales = Number(item.total_amount);
      });

      // 处理退款
      refunds.forEach((item: any) => {
        const dateStr = dayjs(item.stats_date).format('YYYY-MM-DD');
        const key = getKey(item.shop_id, dateStr);
        if (!dataMap.has(key)) {
          dataMap.set(key, { shop_id: item.shop_id, stats_time: dateStr });
        }
        dataMap.get(key).refund_amount = Number(item.refund_amount);
        dataMap.get(key).refund_count = Number(item.refund_count);
      });

      const records = Array.from(dataMap.values()).map((record) => ({
        shop_id: record.shop_id,
        stats_time: record.stats_time, // 存入 Date 类型时会自动处理 'YYYY-MM-DD'
        member_growth: record.member_growth || 0,
        ticket_sales: record.ticket_sales || 0,
        refund_amount: record.refund_amount || 0,
        refund_count: record.refund_count || 0,
      }));

      if (records.length > 0) {
        // 使用 bulkCreate 并启用 updateOnDuplicate
        await this.homeStatisticsModel.bulkCreate(records as any, {
          transaction,
          updateOnDuplicate: [
            'member_growth',
            'ticket_sales',
            'refund_amount',
            'refund_count',
          ],
        });
      }

      await transaction.commit();
      this.logger.log(
        `Statistics task completed. Upserted ${records.length} records.`,
      );
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Statistics task failed', error);
    }
  }

  /**
   * 获取统计数据（ECharts 格式）
   */
  async getStatistics(query: {
    shop_id?: number;
    days?: number; // 7, 14, 30
  }) {
    const { shop_id, days = 7 } = query;
    const where: any = {};

    if (shop_id) {
      where.shop_id = shop_id;
    }

    // 默认查询最近 days 天的数据
    // 注意：这里的 stats_time 存的是 'YYYY-MM-DD 00:00:00'
    const startDate = dayjs()
      .subtract(days - 1, 'day')
      .startOf('day')
      .toDate();
    const endDate = dayjs().endOf('day').toDate();

    where.stats_time = {
      [Op.between]: [startDate, endDate],
    };

    const data = await this.homeStatisticsModel.findAll({
      where,
      order: [['stats_time', 'ASC']],
      raw: true,
    });

    // 补全日期（如果某些天没有数据，也应该显示 0）
    const fullDateRange: string[] = [];
    for (let i = 0; i < days; i++) {
      fullDateRange.push(
        dayjs()
          .subtract(days - 1 - i, 'day')
          .format('YYYY-MM-DD'),
      );
    }

    // 格式化数据
    let processedData: any[] = [];

    if (shop_id) {
      // 单个店铺：补全缺失日期
      processedData = fullDateRange.map((dateStr) => {
        const record = data.find(
          (item) => dayjs(item.stats_time).format('YYYY-MM-DD') === dateStr,
        );
        return (
          record || {
            stats_time: dateStr,
            member_growth: 0,
            ticket_sales: 0,
            refund_amount: 0,
            refund_count: 0,
          }
        );
      });
    } else {
      // 汇总所有店铺：先按日期聚合
      const timeMap = new Map<string, any>();
      fullDateRange.forEach((dateStr) => {
        timeMap.set(dateStr, {
          stats_time: dateStr,
          member_growth: 0,
          ticket_sales: 0,
          refund_amount: 0,
          refund_count: 0,
        });
      });

      for (const item of data) {
        const timeKey = dayjs(item.stats_time).format('YYYY-MM-DD');
        if (timeMap.has(timeKey)) {
          const record = timeMap.get(timeKey);
          record.member_growth += Number(item.member_growth);
          record.ticket_sales += Number(item.ticket_sales);
          record.refund_amount += Number(item.refund_amount);
          record.refund_count += Number(item.refund_count);
        }
      }
      processedData = Array.from(timeMap.values());
    }

    return {
      xAxis: {
        type: 'category',
        data: fullDateRange,
      },
      series: [
        {
          name: '会员增长人数',
          type: 'line',
          data: processedData.map((item) => Number(item.member_growth)),
        },
        {
          name: '卖票营业额',
          type: 'line',
          data: processedData.map((item) => Number(item.ticket_sales)),
        },
        {
          name: '退款金额',
          type: 'line',
          data: processedData.map((item) => Number(item.refund_amount)),
        },
        {
          name: '退款单数',
          type: 'line',
          data: processedData.map((item) => Number(item.refund_count)),
        },
      ],
    };
  }
}
