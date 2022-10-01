import * as uuid from 'uuid';
import {ulid} from 'ulid';
import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {CreateUserCommand} from './create-user.command';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '../entities/user.entity';
import {Connection, Repository} from 'typeorm';

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
