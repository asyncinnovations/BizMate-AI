import { Test, TestingModule } from '@nestjs/testing';
import { WalletTransactionController } from './wallet_transaction.controller';

describe('WalletTransactionController', () => {
  let controller: WalletTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletTransactionController],
    }).compile();

    controller = module.get<WalletTransactionController>(WalletTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
