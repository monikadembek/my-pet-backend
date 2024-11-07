import { Test, TestingModule } from '@nestjs/testing';
import { UsersProfilesController } from './users-profiles.controller';

describe('UsersProfilesController', () => {
  let controller: UsersProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersProfilesController],
    }).compile();

    controller = module.get<UsersProfilesController>(UsersProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
