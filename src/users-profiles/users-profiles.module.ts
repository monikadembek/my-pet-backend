import { Module } from '@nestjs/common';
import { UsersProfilesController } from './users-profiles.controller';
import { UsersProfilesService } from './users-profiles.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersProfilesController],
  providers: [UsersProfilesService],
})
export class UsersProfilesModule {}
