import {Controller, Get} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // FIXME :: pingCheck 함수를 이용해서 서비스가 제공하는 다른 서버가 잘 동작하고 있는지 확인
      //  URL 요청을 보내서 응답을 잘 받으면 응답 결과에 첫번째 인자로 넣은 docs 로 응답
      () => this.http.pingCheck('docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database'),
    ]);
  }
}
