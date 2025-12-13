import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceDocumentsService } from './compliance_documents.service';

describe('ComplianceDocumentsService', () => {
  let service: ComplianceDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplianceDocumentsService],
    }).compile();

    service = module.get<ComplianceDocumentsService>(ComplianceDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
