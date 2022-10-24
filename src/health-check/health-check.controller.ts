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
      // pingCheck 함수를 이용하여 제공하는 다른 서버가 잘 동작하고 있는지 확인
      () => this.http.pingCheck('google', 'https://google.com', {timeout: 800}),
      () => this.db.pingCheck('database'),
    ]);
  }
}
