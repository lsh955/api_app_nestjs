import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {EmailService} from 'src/email/email.service';
import {UserCreatedEvent} from '../../domain/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: UserCreatedEvent) {
    switch (event.name) {
      case UserCreatedEvent.name: {
        console.log('UserCreatedEvent!');
        const {email, signupVerifyToken} = event as UserCreatedEvent;
        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;
      }
      default:
        break;
    }
  }
}
