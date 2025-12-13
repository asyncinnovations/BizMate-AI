import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceDocumentsController } from './compliance_documents.controller';

describe('ComplianceDocumentsController', () => {
  let controller: ComplianceDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplianceDocumentsController],
    }).compile();

    controller = module.get<ComplianceDocumentsController>(ComplianceDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
