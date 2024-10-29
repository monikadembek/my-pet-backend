import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordTokenGeneratedEvent } from '../events/reset-password-token-generated.event';
import { EVENTS } from 'src/constants/events.constants';

@Injectable()
export class ResetPasswordTokenGeneratedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EVENTS.AUTH.RESET_PASSWORD_TOKEN_GENERATED)
  handleResetPasswordTokenGeneratedEvent(
    event: ResetPasswordTokenGeneratedEvent,
  ) {
    this.emailService.sendResetPasswordEmail(
      event.userEmail,
      event.userName,
      event.resetPasswordToken,
    );
  }
}
