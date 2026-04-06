import { Test, TestingModule } from '@nestjs/testing';
import { DocumentHistoryController } from './document_history.controller';

describe('DocumentHistoryController', () => {
  let controller: DocumentHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentHistoryController],
    }).compile();

    controller = module.get<DocumentHistoryController>(DocumentHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
