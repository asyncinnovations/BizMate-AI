import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceLicensingService } from './compliance_licensing.service';

describe('ComplianceLicensingService', () => {
  let service: ComplianceLicensingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplianceLicensingService],
    }).compile();

    service = module.get<ComplianceLicensingService>(ComplianceLicensingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
