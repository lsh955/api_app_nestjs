import * as uuid from 'uuid';
import {ulid} from 'ulid';
import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {CreateUserCommand} from './create-user.command';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '../entities/user.entity';
import {Connection, Repository} from 'typeorm';
import {UserCreatedEvent} from '../domain/user-created.event';
import {TestEvent} from '../event/test.event';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private connection: Connection,
    private eventBus: EventBus,

    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(command: CreateUserCommand) {
    const {name, email, password} = command;

    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUserUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );

    // FIXME :: 비즈니스 요구사항이 추가로 생겨 난다면, 또 다른 이벤트 핸들러에서 요구사항을 처리하는 로직을 구현할 것.

    // 회원가입 이메일 전송 로직을 회원가입 이벤트를 통해 처리
    // EmailService 를 이용하는 부분을 UserCreatedEvent 를 발송하도록 변경
    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    this.eventBus.publish(new TestEvent());
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
   * @param password          패스워드
   * @param signupVerifyToken 가입토큰
   * @private
   */
  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}
