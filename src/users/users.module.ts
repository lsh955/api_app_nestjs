import {Logger, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CqrsModule} from '@nestjs/cqrs';

import {UsersController} from './interface/users.controller';
import {UserEntity} from './infra/db/entity/user.entity';
import {EmailModule} from '../email/email.module';
import {AuthModule} from 'src/auth/auth.module';
import {CreateUserHandler} from './application/command/create-user.handler';
import {UserEventsHandler} from './application/event/user-events.handler';
import {UserFactory} from './domain/user.factory';
import {UserRepository} from './infra/db/repository/UserRepository';
import {EmailService} from './infra/adapter/email.service';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
    UserFactory,
  ],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    UserEventsHandler,
    Logger,
    {provide: 'UserRepository', useClass: UserRepository},
    {provide: 'EmailService', useClass: EmailService},
  ],
})
export class UsersModule {}
