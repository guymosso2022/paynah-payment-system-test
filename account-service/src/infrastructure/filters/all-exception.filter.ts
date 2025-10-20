import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AccountNotFoundApplicationException } from 'src/application/exceptions/account-not-found.exception';
import { InsufficientFundsApplicationException } from 'src/application/exceptions/insufficient-funds-application.exception';
import { InsufficientFundsDomainException } from 'src/domain/exceptions/insufficient-funds-domain.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : ((res as any).message ?? JSON.stringify(res));
    } else if (exception instanceof InsufficientFundsDomainException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof AccountNotFoundApplicationException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof InsufficientFundsApplicationException) {
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
