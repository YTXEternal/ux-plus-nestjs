import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidateDtoException } from '../../exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors: string[] | undefined = void 0;
    console.log('exception', exception);
    let message = 'Internal server error:';

    if (exception instanceof ValidateDtoException) {
      const { selfError } = exception;
      status = selfError.status;
      message = selfError.message;
      errors = selfError.errors;
    } else if (exception instanceof HttpException) {
      message = exception.message;
      status = exception.getStatus();
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      message = 'Internal server error:' + exception;
    }

    response.status(status).json({
      code: status,
      message,
      errors,
    });
  }
}
