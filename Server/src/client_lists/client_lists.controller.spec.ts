import { Test, TestingModule } from '@nestjs/testing';
import { ClientListsController } from './client_lists.controller';

describe('ClientListsController', () => {
  let controller: ClientListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientListsController],
    }).compile();

    controller = module.get<ClientListsController>(ClientListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
