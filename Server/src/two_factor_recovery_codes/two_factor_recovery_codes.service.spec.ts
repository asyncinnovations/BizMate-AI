import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorRecoveryCodesService } from './two_factor_recovery_codes.service';

describe('TwoFactorRecoveryCodesService', () => {
  let service: TwoFactorRecoveryCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFactorRecoveryCodesService],
    }).compile();

    service = module.get<TwoFactorRecoveryCodesService>(TwoFactorRecoveryCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
