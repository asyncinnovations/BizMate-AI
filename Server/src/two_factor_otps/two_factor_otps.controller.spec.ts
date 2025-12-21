import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorOtpsController } from './two_factor_otps.controller';

describe('TwoFactorOtpsController', () => {
  let controller: TwoFactorOtpsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwoFactorOtpsController],
    }).compile();

    controller = module.get<TwoFactorOtpsController>(TwoFactorOtpsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
