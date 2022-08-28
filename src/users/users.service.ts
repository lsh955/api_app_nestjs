import {Injectable} from '@nestjs/common';

@Injectable()
export class UsersService {
  create(CreateUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
