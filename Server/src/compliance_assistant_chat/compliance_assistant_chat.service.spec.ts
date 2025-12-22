import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceAssistantService } from './compliance_assistant_chat.service';

describe('ComplianceAssistantService', () => {
  let service: ComplianceAssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplianceAssistantService],
    }).compile();

    service = module.get<ComplianceAssistantService>(ComplianceAssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
