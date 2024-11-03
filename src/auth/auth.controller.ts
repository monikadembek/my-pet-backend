import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AccessTokenGuard } from '../shared/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/shared/guards/refreshToken.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestUserPayload } from './auth.models';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiCreatedResponse({ description: 'User Account created' })
  @ApiBody({ type: CreateUserDto })
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Log in user' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiBody({ type: SignInDto })
  signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AccessTokenGuard) // this guard gives us req.user object in that route
  @Get('logout')
  @ApiOperation({ summary: 'Log user out' })
  @ApiOkResponse({ description: 'User logged out' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  logout(@Request() request) {
    // because of JWT strategy a user object exists in the request object when a user is signed in
    this.authService.logout(request.user.sub);
    return { message: 'User logged out' };
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  getUserProfile(@Request() request): RequestUserPayload {
    return request.user;
  }

  @UseGuards(AccessTokenGuard)
  @Get('delete-account')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  deleteUserAccount(@Request() request) {
    return this.authService.deleteUser(request.user);
  }

  // in refresh endpoint client must pass stored refresh token in authorization header as Bearer token
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get new access token by sending valid refresh token',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  refresh(@Request() request) {
    const userId = request.user.sub;
    const refreshToken = request.user.refreshToken;
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send email with url to set new password' })
  @ApiResponse({ status: 201, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Email not found' })
  forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.processForgotPasswordLogic(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Save new password when user forgets old one' })
  @ApiResponse({ status: 201, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Invalid token' })
  resetPassword(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
