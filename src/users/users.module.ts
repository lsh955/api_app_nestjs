import {Logger, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CqrsModule} from '@nestjs/cqrs';

import {UsersController} from './users.controller';
import {UserEntity} from './entities/user.entity';
import {EmailModule} from '../email/email.module';
import {AuthModule} from 'src/auth/auth.module';
import {UsersService} from './users.service';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
