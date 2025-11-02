import { Test, TestingModule } from '@nestjs/testing';
import { DocumentGenController } from './document_gen.controller';

describe('DocumentGenController', () => {
  let controller: DocumentGenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentGenController],
    }).compile();

    controller = module.get<DocumentGenController>(DocumentGenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
