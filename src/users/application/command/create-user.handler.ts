import * as uuid from 'uuid';
import {ulid} from 'ulid';
import {Inject, Injectable, UnprocessableEntityException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {CreateUserCommand} from './create-user.command';
import {UserFactory} from '../../domain/user.factory';
import {IUserRepository} from 'src/users/domain/repository/iuser.repository';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    // IUserRepository 가 제공하는 인터페이스를 이용하여 데이터를 조회하고 저장
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const {name, email, password} = command;

    const user = await this.userRepository.findByEmail(email);
    if (user !== null) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const id = ulid();
    const signupVerifyToken = uuid.v1(); // 가입토큰

    await this.userRepository.save(
      id,
      name,
      email,
      password,
      signupVerifyToken,
    );

    // 회원가입 가입진행
    this.userFactory.create(id, name, email, password, signupVerifyToken);
  }
}
