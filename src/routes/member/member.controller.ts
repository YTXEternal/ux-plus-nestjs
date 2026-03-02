import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { MemberService } from './member.service';
import { ApiResponse } from '@/dto/api-response';
import {
  CreateMemberDto,
  UpdateMemberDto,
  ListMemberDto,
  DeleteMemberDto,
} from './dto/member.dto';
import { formatPagination } from '@/tools';

@ApiTags('会员管理')
@Controller({
  path: 'member',
  version: '1',
})
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: '新增会员' })
  @ApiSwaggerResponse({
    status: 200,
    description: '新增成功',
    type: ApiResponse,
  })
  @Post()
  async create(@Body() body: CreateMemberDto) {
    const data = await this.memberService.create(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '删除会员' })
  @ApiSwaggerResponse({
    status: 200,
    description: '删除成功',
    type: ApiResponse,
  })
  @Delete()
  async remove(@Body() body: DeleteMemberDto) {
    await this.memberService.delete(body.member_ids);
    return new ApiResponse(HttpStatus.OK, '删除成功', null);
  }

  @ApiOperation({ summary: '修改会员信息' })
  @ApiSwaggerResponse({
    status: 200,
    description: '修改成功',
    type: ApiResponse,
  })
  @Put()
  async update(@Body() body: UpdateMemberDto) {
    const data = await this.memberService.update(body);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取会员列表' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @Get('list')
  async findAll(@Query() query: ListMemberDto) {
    const { rows, total } = await this.memberService.findAll(query);
    const data = formatPagination(rows, total, query.pageNum, query.pageSize);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }

  @ApiOperation({ summary: '获取会员详情' })
  @ApiSwaggerResponse({
    status: 200,
    description: '获取成功',
    type: ApiResponse,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.memberService.findOne(+id);
    return new ApiResponse(HttpStatus.OK, '操作成功', data);
  }
}
