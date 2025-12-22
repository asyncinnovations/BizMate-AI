import { Module } from "@nestjs/common";
import { WalletTransactionService } from "./wallet_transaction.service";
import { WalletTransactionController } from "./wallet_transaction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WalletTransaction } from "./wallet_transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WalletTransaction])],
  providers: [WalletTransactionService],
  controllers: [WalletTransactionController],
})
export class WalletTransactionModule {}
