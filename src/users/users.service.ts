import {Injectable} from '@nestjs/common';

@Injectable()
export class UsersService {
  create(CreateUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  private checkUserExists(email: string) {
    return false; // TODO: DB 연동 후 구현
  }

  private saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    return; // TODO: DB 연동 후 구현
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}
