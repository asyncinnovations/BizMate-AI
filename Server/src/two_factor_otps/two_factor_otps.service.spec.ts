import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorOtpsService } from './two_factor_otps.service';

describe('TwoFactorOtpsService', () => {
  let service: TwoFactorOtpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFactorOtpsService],
    }).compile();

    service = module.get<TwoFactorOtpsService>(TwoFactorOtpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
