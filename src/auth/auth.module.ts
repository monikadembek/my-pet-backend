import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccountCreatedListener } from './listeners/account-created.listener';
import { EmailModule } from 'src/email/email.module';
import { ResetPasswordTokenGeneratedListener } from './listeners/reset-password-token-generated.listener';

@Module({
  imports: [UsersModule, JwtModule.register({}), EmailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccountCreatedListener,
    ResetPasswordTokenGeneratedListener,
  ],
  exports: [AuthService],
})
export class AuthModule {}
