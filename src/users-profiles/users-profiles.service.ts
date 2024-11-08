import { Injectable } from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UsersProfilesService {
  constructor(private readonly prisma: DatabaseService) {}

  async getUserProfile(userId: string): Promise<UserProfile> {
    return this.prisma.userProfile.findUnique({
      where: {
        userId: +userId,
      },
    });
  }

  async updateUserProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.prisma.userProfile.upsert({
      where: {
        userId: +userId,
      },
      update: updateUserProfileDto,
      create: {
        userId: +userId,
        ...updateUserProfileDto,
      },
    });
  }
}
