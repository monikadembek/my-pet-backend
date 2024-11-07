import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersProfilesService } from './users-profiles.service';
import { AccessTokenGuard } from 'src/shared/guards/accessToken.guard';
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

@Controller('users-profiles')
export class UsersProfilesController {
  constructor(private readonly usersProfilesService: UsersProfilesService) {}

  @UseGuards(AccessTokenGuard)
  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile information' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  getProfile(@Param('userId') userId: string) {
    return this.usersProfilesService.getUserProfile(userId);
  }
}
