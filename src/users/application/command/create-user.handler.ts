import * as uuid from 'uuid';
import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {CreateUserCommand} from './create-user.command';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '../../infra/db/entity/user.entity';
import {Connection, Repository} from 'typeorm';
import {UserCreatedEvent} from '../../domain/user-created.event';

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
}
