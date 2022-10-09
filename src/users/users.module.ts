import {Logger, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CqrsModule} from '@nestjs/cqrs';

import {UsersController} from './users.controller';
import {UserEntity} from './entities/user.entity';
import {EmailModule} from '../email/email.module';
import {AuthModule} from 'src/auth/auth.module';
import {UsersService} from './users.service';
import {CreateUserHandler} from './command/create-user.handler';
import {UserEventsHandler} from './event/user-events.handler';
import {UserFactory} from './domain/user.factory';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
    UserFactory,
  ],
  controllers: [UsersController],
  providers: [CreateUserHandler, UserEventsHandler, UsersService, Logger],
})
export class UsersModule {}
