import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pug from 'pug';

@Injectable()
export class EmailService {
  private appName = 'My Pet App';

  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendAccountCreationConfirmationEmail(
    userEmail: string,
    userName: string,
  ) {
    const subject = `${this.appName} - account created`;

    const html = pug.renderFile(
      './dist/email/templates/account-creation-confirmation.pug',
      {
        appName: this.appName,
        userName,
      },
    );

    await this.mailerService.sendMail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendResetPasswordEmail(
    userEmail: string,
    userName: string,
    token: string,
  ) {
    const subject = `${this.appName} - reset password`;
    const frontendUrl = this.configService.get<string>('frontendUrl');
    const resetLink = `${frontendUrl}/reset-password?resetPasswordToken=${token}`;

    const html = pug.renderFile('./dist/email/templates/reset-password.pug', {
      appName: this.appName,
      userName,
      resetLink,
    });

    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject,
        html,
      });
    } catch (error) {
      console.log('Error with sending email: ', error);
    }
  }
}
