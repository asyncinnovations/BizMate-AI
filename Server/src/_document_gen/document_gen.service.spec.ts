import { Test, TestingModule } from '@nestjs/testing';
import { DocumentGenService } from './document_gen.service';

describe('DocumentGenService', () => {
  let service: DocumentGenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentGenService],
    }).compile();

    service = module.get<DocumentGenService>(DocumentGenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
