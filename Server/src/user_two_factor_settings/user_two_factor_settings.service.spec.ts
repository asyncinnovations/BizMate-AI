import { Test, TestingModule } from '@nestjs/testing';
import { UserTwoFactorSettingsService } from './user_two_factor_settings.service';

describe('UserTwoFactorSettingsService', () => {
  let service: UserTwoFactorSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTwoFactorSettingsService],
    }).compile();

    service = module.get<UserTwoFactorSettingsService>(UserTwoFactorSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
