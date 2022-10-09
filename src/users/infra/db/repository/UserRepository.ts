import {Connection, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {IUserRepository} from 'src/users/domain/repository/iuser.repository';
import {UserEntity} from '../entity/user.entity';
import {User} from 'src/users/domain/user';
import {UserFactory} from 'src/users/domain/user.factory';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private connection: Connection,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    // 전달된 이메일 주소를 가진 유저를 DB 조회
    const userEntity = await this.userRepository.findOne({email});

    if (!userEntity) {
      return null; // 만약 저장되어 있지 않다면 null
    }

    // 존재한다면 User 도메인 객체를 돌려준다.
    const {id, name, signupVerifyToken, password} = userEntity;

    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({email, password});
    if (!userEntity) {
      return null;
    }

    const {id, name, signupVerifyToken} = userEntity;

    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  async findBySignupVerifyToken(
    signupVerifyToken: string,
  ): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({signupVerifyToken});
    if (!userEntity) {
      return null;
    }

    const {id, name, email, password} = userEntity;

    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  async save(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = id;
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}
