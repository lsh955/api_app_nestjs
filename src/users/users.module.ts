import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {UsersController} from './users.controller';
import {UserEntity} from './entities/user.entity';
import {EmailModule} from '../email/email.module';
import {UsersService} from './users.service';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
