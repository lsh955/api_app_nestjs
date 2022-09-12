import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import * as uuid from 'uuid';
import {ulid} from 'ulid';

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
    private connection: Connection,
  ) {}

  /**
   * 유저 회원가입
   *
   * @param name      성함
   * @param email     이메일
   * @param password  비밀번호
   */
  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

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
   * 사용자정보 저장(트랜잭션 처리 X)
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
   * 사용자정보 저장(트랜잭션 처리 O)
   *
   * @param name              성함
   * @param email             이메일
   * @param password          비밀번호
   * @param signupVerifyToken 가입토큰
   * @private
   */
  private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string) {
    const queryRunner = this.connection.createQueryRunner();

    // QueryRunner에서 DB에 연결 후 트랜잭션을 시작
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      // 정상 동작을 수행했다면 트랜잭션을 커밋하여 영속화
      await queryRunner.manager.save(user);

      // DB 작업을 수행한 후 커밋을 해서 영속화
      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner 는 해제
      // 생성한 QueryRunner 는 해제시켜 주어야 한다.
      await queryRunner.release();
    }
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
