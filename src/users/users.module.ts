import {Module} from '@nestjs/common';
import {EmailModule} from '../email/email.module';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';

@Module({
  imports: [EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
