import { Test, TestingModule } from '@nestjs/testing';
import { ClientListsService } from './client_lists.service';

describe('ClientListsService', () => {
  let service: ClientListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientListsService],
    }).compile();

    service = module.get<ClientListsService>(ClientListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
