import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersProfilesService {
  constructor(private readonly prisma: DatabaseService) {}

  async getUserProfile(userId: string) {
    return await this.prisma.userProfile.findUnique({
      where: {
        userId: +userId,
      },
    });
  }
}
