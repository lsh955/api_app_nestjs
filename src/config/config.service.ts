import {TypeOrmModuleOptions} from '@nestjs/typeorm';

require('dotenv').config();

export class ConfigService {
  // process.env 객체를 할당
  constructor(private env: {[k: string]: string | undefined}) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key]; // 환경변수에서 key로 설정된 값을 읽어온다.

    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  isDevelopment() {
    return this.getValue('NODE_ENV', false) === 'development';
  }

  // ormconfig.json 으로 저장할 객체를 생성
  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getValue('DATABASE_HOST'),
      port: 3306,
      username: this.getValue('DATABASE_USERNAME'),
      password: this.getValue('DATABASE_PASSWORD'),
      database: 'test',
      entities: ['dist/**/*.entity{.ts,.js}'],
      ssl: !this.isDevelopment(),
    };
  }
}
