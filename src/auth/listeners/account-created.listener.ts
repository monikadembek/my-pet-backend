import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AccountCreatedEvent } from '../events/account-created.event';
import { EmailService } from 'src/email/email.service';
import { EVENTS } from 'src/constants/events.constants';

@Injectable()
export class AccountCreatedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EVENTS.AUTH.ACCOUNT_CREATED)
  handleAccountCreatedEvent(event: AccountCreatedEvent) {
    this.emailService.sendAccountCreationConfirmationEmail(
      event.userEmail,
      event.userName,
    );
  }
}
