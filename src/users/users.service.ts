import * as uuid from 'uuid';
import {ulid} from 'ulid';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {UserEntity} from './entities/user.entity';
import {EmailService} from 'src/email/email.service';
import {UserInfo} from './userInfo';

/**
 * 유저 서비스(정보저장, 조회하는 역할을 위주로...)
 */
@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  /**
   * 유저 회원가입
   *
   * @param name      성함
   * @param email     이메일
   * @param password  비밀번호
   */
  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  /**
   * 가입하려는 유저가 존재하는지 검사
   *
   * @param emailAddress  이메일
   * @private
   */
  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({email: emailAddress});

    return user !== undefined;
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
  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid(); // 랜덤한 스트링을 생성하기 위해
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;

    await this.usersRepository.save(user);
  }

  /**
   * 인증 이메일 발송
   *
   * @param email             이메일
   * @param signupVerifyToken 가입토큰
   * @private
   */
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  /**
   * 이메일 인증
   *
   * @param signupVerifyToken 가입토큰
   */
  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB 에서 signupVerifyToken 으로 회원가입 처리중인 유저가 있는지 조회하고 없다면 에러처리
    // 2. 바로 로그인 상태가 되도록 JWT 발급

    throw new Error('Method not implemented');
  }

  /**
   * 로그인
   *
   * @param email     이메일
   * @param password  비밀번호
   */
  async login(email: string, password: string): Promise<string> {
    // TODO
    // 1. email, password 를 가진 유저가 존재하는지 DB 에서 확인하고 없다면 에러처리
    // 2. JWT 발급

    throw new Error('Method not implemented');
  }

  /**
   * 유저정보 조회
   *
   * @param userId  아이디
   */
  async getUserInfo(userId: string): Promise<UserInfo> {
    // TODO
    // 1. userId 를 가진 유저가 존재하는지 DB 에서 확인하고 없다면 에러처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답

    throw new Error('Method not implemented');
  }
}
