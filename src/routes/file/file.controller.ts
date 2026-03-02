import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SysFileService } from './file.service';
import { ListFileDto } from './dto/file.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ApiResponse } from '@/dto/api-response';

@ApiTags('附件管理')
@Controller('file')
export class SysFileController {
  constructor(private readonly sysFileService: SysFileService) {}

  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './static/uploads';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    // 保存文件信息到数据库
    const savedFile = await this.sysFileService.create({
      name: file.filename, // 或者使用 originalname，或者保存完整路径/URL
      type: file.mimetype,
    });
    const data = {
      ...savedFile.toJSON(),
      url: `/static/uploads/${file.filename}`, // 假设静态文件服务已配置
    };
    return new ApiResponse(HttpStatus.CREATED, '上传成功', data);
  }

  @ApiOperation({ summary: '获取文件列表' })
  @Get('list')
  async list(@Query() query: ListFileDto) {
    const data = await this.sysFileService.findAll(query);
    return new ApiResponse(HttpStatus.OK, '获取成功', data);
  }

  @ApiOperation({ summary: '获取文件详情' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.sysFileService.findOne(+id);
    return new ApiResponse(HttpStatus.OK, '获取成功', data);
  }

  @ApiOperation({ summary: '删除文件' })
  @Delete(':ids')
  async remove(@Param('ids') ids: string) {
    const data = await this.sysFileService.delete(ids);
    return new ApiResponse(HttpStatus.OK, '删除成功', data);
  }
}
