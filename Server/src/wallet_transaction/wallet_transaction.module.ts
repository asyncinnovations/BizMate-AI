import { Module } from '@nestjs/common';
import { WalletTransactionService } from './wallet_transaction.service';
import { WalletTransactionController } from './wallet_transaction.controller';

@Module({
  providers: [WalletTransactionService],
  controllers: [WalletTransactionController]
})
export class WalletTransactionModule {}
