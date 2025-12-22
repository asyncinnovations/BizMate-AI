import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorRecoveryCodesController } from './two_factor_recovery_codes.controller';

describe('TwoFactorRecoveryCodesController', () => {
  let controller: TwoFactorRecoveryCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwoFactorRecoveryCodesController],
    }).compile();

    controller = module.get<TwoFactorRecoveryCodesController>(TwoFactorRecoveryCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
