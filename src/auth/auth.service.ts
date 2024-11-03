import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AccountCreatedEvent } from './events/account-created.event';
import { ResetPasswordTokenGeneratedEvent } from './events/reset-password-token-generated.event';
import { EVENTS } from 'src/constants/events.constants';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestUserPayload } from './auth.models';

type AuthResult = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  name: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private saltRounds = 10;

  async signUp(createUserDto: CreateUserDto): Promise<AuthResult> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(`${newUser.id}`, tokens.refreshToken);

    if (newUser) {
      this.emitAccountCreatedEvent(newUser.name, newUser.email);
    }

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  }

  private emitAccountCreatedEvent(name: string, email: string): void {
    const accountCreatedEvent = new AccountCreatedEvent();
    accountCreatedEvent.userName = name;
    accountCreatedEvent.userEmail = email;

    this.eventEmitter.emit(EVENTS.AUTH.ACCOUNT_CREATED, accountCreatedEvent);
  }

  async generateTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('jwt.accessTokenSecret'),
          expiresIn: this.configService.get<string>('jwt.accessTokenExpiresIn'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('jwt.refreshTokenSecret'),
          expiresIn: this.configService.get<string>(
            'jwt.refreshTokenExpiresIn',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await await bcrypt.hash(
      refreshToken,
      this.saltRounds,
    );

    await this.usersService.update(+userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async signIn(signInDto: SignInDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user) {
      throw new NotFoundException(
        `No user found for provided email ${signInDto.email}`,
      );
    }

    const passwordMatches = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid password');
    }

    // generate JWT and return it here instead of the user object
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(`${user.id}`, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async logout(userId: string) {
    const updatedUserRecord = await this.usersService.update(+userId, {
      refreshToken: null,
    });
    if (!updatedUserRecord) {
      throw new InternalServerErrorException();
    }
    return updatedUserRecord;
  }

  async refreshToken(userId: string, refreshToken: string) {
    // check if user with provide id exists and if it contains the refresh token
    const user = await this.usersService.findById(+userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    // verify the hashed refreshToken from user table with the provided refresh token from the client
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }

    // generate new tokens if refresh token matches,
    // update new refresh token in db ans return both tokens to the client
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(`${user.id}`, tokens.refreshToken);

    return tokens;
  }

  private emitResetPasswordTokenGeneratedEvent(
    email: string,
    name: string,
    token: string,
  ): void {
    const resetPasswordTokenGeneratedEvent =
      new ResetPasswordTokenGeneratedEvent();
    resetPasswordTokenGeneratedEvent.userEmail = email;
    resetPasswordTokenGeneratedEvent.userName = name;
    resetPasswordTokenGeneratedEvent.resetPasswordToken = token;

    this.eventEmitter.emit(
      EVENTS.AUTH.RESET_PASSWORD_TOKEN_GENERATED,
      resetPasswordTokenGeneratedEvent,
    );
  }

  async processForgotPasswordLogic(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Provided email was not found');
    }

    const resetPasswordToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email,
      },
      {
        secret: this.configService.get<string>('jwt.resetPasswordTokenSecret'),
        expiresIn: this.configService.get<string>(
          'jwt.resetPasswordTokenExpiresIn',
        ),
      },
    );

    this.emitResetPasswordTokenGeneratedEvent(
      user.email,
      user.name,
      resetPasswordToken,
    );

    return {
      status: 'success',
      message: `Email with link to reset password has been sent to ${user.email}`,
      timestamp: new Date().toISOString(),
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetPasswordToken, password } = resetPasswordDto;
    let verifiedTokenData = null;

    try {
      verifiedTokenData = this.jwtService.verify(resetPasswordToken, {
        secret: this.configService.get<string>('jwt.resetPasswordTokenSecret'),
      });
    } catch (error) {
      console.log('Error with verifying token: ', error);
      throw new InternalServerErrorException('Invalid token');
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const user = await this.usersService.findByEmail(verifiedTokenData.email);
    if (!user) {
      throw new NotFoundException(
        'User with email retrieved from token was not found',
      );
    }

    await this.usersService.update(+verifiedTokenData.sub, {
      password: hashedPassword,
    });

    return {
      status: 'success',
      message: `Password has been changed for ${verifiedTokenData.email}`,
      timestamp: new Date().toISOString(),
    };
  }

  async deleteUser(user: RequestUserPayload) {
    await this.usersService.remove(user.sub);
    return {
      status: 'success',
      message: `Account for ${user.email} was deleted`,
      timestamp: new Date().toISOString(),
    };
  }
}
