import { Body, Controller, Get, Param, Post, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TicketRecordService } from './ticket-record.service';
import { ListTicketRecordDto, RefundTicketDto } from './dto/ticket-record.dto';
import { ApiResponse } from '@/dto/api-response';
import { formatPagination } from '@/tools';

@ApiTags('购票记录管理')
@Controller({
  path: 'ticket-record',
  version: '1',
})
export class TicketRecordController {
  constructor(private readonly ticketRecordService: TicketRecordService) {}

  @ApiOperation({ summary: '支付订单' })
  @Post('pay/:id')
  async pay(@Param('id') id: string) {
    const data = await this.ticketRecordService.pay(+id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '退款' })
  @Post('refund')
  async refund(@Body() refundTicketDto: RefundTicketDto) {
    const data = await this.ticketRecordService.refund(refundTicketDto);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '记录列表' })
  @Get('list')
  async findAll(@Query() query: ListTicketRecordDto) {
    const { rows, total } = await this.ticketRecordService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '记录详情' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.ticketRecordService.findOne(+id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}
