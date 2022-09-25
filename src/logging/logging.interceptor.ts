import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor,} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const {method, url} = context.getArgByIndex(0); // 실행 컨텍스트에 포함된 첫번째 객체를 얻어오기
    this.logger.log(`Request to ${method} ${url}`);

    return next.handle().pipe(
      tap((data) =>
        // 응답로그에도 HTTP 메서드와 URL 와 함께 응답결과를 함께 출력
        this.logger.log(
          `Response from ${method} ${url} \n response: ${JSON.stringify(data)}`,
        ),
      ),
    );
  }
}
