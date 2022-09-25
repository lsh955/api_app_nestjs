import {ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException,} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch() // 처리되지 않은 모든 예외를 잡으려고 할 때 사용
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
    };

    console.log(log);

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
