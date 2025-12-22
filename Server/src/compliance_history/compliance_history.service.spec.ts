import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceHistoryService } from './compliance_history.service';

describe('ComplianceHistoryService', () => {
  let service: ComplianceHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplianceHistoryService],
    }).compile();

    service = module.get<ComplianceHistoryService>(ComplianceHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
