import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import {
  CreateTicketDto,
  DetailTicketDto,
  ListTicketDto,
  TicketPayDto,
  TicketPayStatusDto,
  TicketRefundDto,
} from './dto/ticket.dto';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';
import { RequirePermissions } from '@/guards';

@ApiTags('购票管理')
@Controller({
  path: 'ticket',
  version: '1',
})
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @RequirePermissions('arrange:ticket:add')
  @ApiOperation({ summary: '新增购票' })
  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    const data = await this.ticketService.create(createTicketDto);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('arrange:ticket:list')
  @ApiOperation({ summary: '购票列表' })
  @Get('list')
  async findAll(@Query() query: ListTicketDto) {
    const { rows, total } = await this.ticketService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('arrange:ticket:pay')
  @ApiOperation({ summary: '购票支付' })
  @Post('pay')
  async pay(@Body() body: TicketPayDto) {
    const data = await this.ticketService.pay(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('arrange:ticket:query')
  @ApiOperation({ summary: '查询支付状态' })
  @Get('pay-status')
  async queryPayStatus(@Query() query: TicketPayStatusDto) {
    const data = await this.ticketService.queryPayStatus(query);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('arrange:ticket:refund')
  @ApiOperation({ summary: '购票退款' })
  @Post('refund')
  async refund(@Body() body: TicketRefundDto) {
    const data = await this.ticketService.refund(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @RequirePermissions('arrange:ticket:query')
  @ApiOperation({ summary: '购票详情' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: DetailTicketDto) {
    const data = await this.ticketService.findOne(+id, query.shop_id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}
