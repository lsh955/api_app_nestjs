import {Injectable} from '@nestjs/common';

@Injectable()
export class UsersService {
  create(CreateUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  /**
   * 가입하려는 유저가 존재하는지 검사
   *
   * @param email 이메일
   * @private
   */
  private checkUserExists(email: string) {
    return false; // TODO: DB 연동 후 구현
  }

  /**
   * 사용자정보 저장
   *
   * @param name              성함
   * @param email             이메일
   * @param password          비밀번호
   * @param signupVerifyToken 가입토큰
   * @private
   */
  private saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    return; // TODO: DB 연동 후 구현
  }

  /**
   * 회원가입 인증 이메일 발송
   *
   * @param email             이메일
   * @param signupVerifyToken 가입토큰
   * @private
   */
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}
