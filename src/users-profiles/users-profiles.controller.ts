import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersProfilesService } from './users-profiles.service';
import { AccessTokenGuard } from '../shared/guards/accessToken.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@ApiTags('users-profiles')
@Controller('users-profiles')
export class UsersProfilesController {
  constructor(private readonly usersProfilesService: UsersProfilesService) {}

  @UseGuards(AccessTokenGuard)
  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile information' })
  @ApiParam({ name: 'userId', format: 'String' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  getProfile(@Param('userId') userId: string) {
    return this.usersProfilesService.getUserProfile(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update information in user profile' })
  @ApiParam({ name: 'userId', format: 'String' })
  @ApiBody({ type: UpdateUserProfileDto })
  @ApiOkResponse({ description: 'User profile updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  updateProfile(
    @Param('userId') userId: string,
    @Body(ValidationPipe) updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.usersProfilesService.updateUserProfile(
      userId,
      updateUserProfileDto,
    );
  }
}
