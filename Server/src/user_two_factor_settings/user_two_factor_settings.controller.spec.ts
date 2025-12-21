import { Test, TestingModule } from '@nestjs/testing';
import { UserTwoFactorSettingsController } from './user_two_factor_settings.controller';

describe('UserTwoFactorSettingsController', () => {
  let controller: UserTwoFactorSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTwoFactorSettingsController],
    }).compile();

    controller = module.get<UserTwoFactorSettingsController>(UserTwoFactorSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
