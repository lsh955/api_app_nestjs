import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {TerminusModule} from '@nestjs/terminus';
import {HttpModule} from '@nestjs/axios';

import emailConfig from './config/emailConfig';
import authConfig from './config/authConfig';
import {validationSchema} from './config/validationSchema';
import {UsersModule} from './users/users.module';
import {ExceptionModule} from './exception/exception.module';
import {LoggingModule} from './logging/logging.module';
import {HealthCheckController} from './health-check/health-check.controller';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
    UsersModule,
    ConfigModule.forRoot({
      // out 디렉토리(dist 디렉토리) 아래에 존재하는 파일인 .XXX.env 파일의 절대 경로를 가리키게 설정
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      // load 속성을 통해 앞에서 구성해둔 ConfigFactory 를 지정
      load: [emailConfig, authConfig],
      // 전역 모듈로 동작하도록 하여 어느 모듈에서나 사용할 수 있도록 하기 위해
      isGlobal: true,
      // 환경변수의 값에 대해 유효성 검사를 수행하도록 joi 를 이용하여 유효성 검사 객체를 작성
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      charset: 'utf8mb4',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // FIXME :: synchronize 옵션을 true 로 하면 서비스가 실행되고 데이터베이스가 연결될 때
      //  항상 데이터베이스가 초기화 되므로 절대 프로덕션에는 true 로 하지 말 것.
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    }),
    ExceptionModule,
    LoggingModule,
  ],
  providers: [HealthCheckController],
})
export class AppModule {}
