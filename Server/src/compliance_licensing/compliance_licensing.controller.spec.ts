import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceLicensingController } from './compliance_licensing.controller';

describe('ComplianceLicensingController', () => {
  let controller: ComplianceLicensingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplianceLicensingController],
    }).compile();

    controller = module.get<ComplianceLicensingController>(ComplianceLicensingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
