import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceAssistantController } from './compliance_assistant_chat.controller';

describe('ComplianceAssistantController', () => {
  let controller: ComplianceAssistantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplianceAssistantController],
    }).compile();

    controller = module.get<ComplianceAssistantController>(ComplianceAssistantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
