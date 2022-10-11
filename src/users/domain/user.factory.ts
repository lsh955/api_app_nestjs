import {Injectable} from '@nestjs/common';
import {EventBus} from '@nestjs/cqrs';
import {UserCreatedEvent} from './user-created.event';
import {User} from './user';

/**
 * @description
 * USER 객체를 생성할때 회원가입 되었다고 이메일을 발송해야 하는데,
 * USER Class 는 new 키워드로 생성해야 하나 EventBus 를 주입받을 수 없다.
 * 그래서 User 를 생성하는 Factory Class 를 따로 생성하여 프로바이더(제공하는 역할) 로 제공한다.
 */
@Injectable()
export class UserFactory {
  // EventBus 를 주입
  constructor(private eventBus: EventBus) {}

  /**
   * 사용자를 생성하는 가입(CREATE) 메서드
   *
   * @param id                아이디
   * @param name              성함
   * @param email             이메일
   * @param signupVerifyToken 가입토큰
   * @param password          패스워드
   */
  create(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ): User {
    // 유저 객체를 생성하고,
    const user = new User(id, name, email, password, signupVerifyToken);
    // UserCreatedEvent 를 발행,
    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    // 생성한 유저도메인 객체를 Return
    return user;
  }

  reconstitute(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ): User {
    return new User(id, name, email, password, signupVerifyToken);
  }
}
