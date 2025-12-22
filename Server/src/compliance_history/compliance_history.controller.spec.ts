import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceHistoryController } from './compliance_history.controller';

describe('ComplianceHistoryController', () => {
  let controller: ComplianceHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplianceHistoryController],
    }).compile();

    controller = module.get<ComplianceHistoryController>(ComplianceHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
