import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WalletTransaction } from "./wallet_transaction.entity";

@Injectable()
export class WalletTransactionService {
  constructor(
    @InjectRepository(WalletTransaction)
    private readonly walletTransactionRepo: Repository<WalletTransaction>
  ) {}

  //////////////////////////////////////
  // CREATE TRANSACTION
  /////////////////////////////////////
  async create_wallet_transaction_service(
    data: Partial<WalletTransaction>
  ): Promise<WalletTransaction> {
    const transaction = this.walletTransactionRepo.create(data);
    return await this.walletTransactionRepo.save(transaction);
  }

  //////////////////////////////////////
  // GET ALL TRANSACTION
  /////////////////////////////////////
  async all_wallet_transaction_service(): Promise<WalletTransaction[]> {
    const result = await this.walletTransactionRepo.find();
    return result;
  }

  //////////////////////////////////////
  // GET SINGLE TRANSACTION
  /////////////////////////////////////
  async single_wallet_transaction_service(
    uuid: string
  ): Promise<WalletTransaction | null> {
    const result = await this.walletTransactionRepo.findOne({
      where: { uuid },
    });
    return result;
  }

  //////////////////////////////////////
  // GET USER TRANSACTION
  /////////////////////////////////////
  async user_wallet_transaction_service(
    userId: string
  ): Promise<WalletTransaction[]> {
    const result = await this.walletTransactionRepo.find({
      where: { user_id: userId },
    });
    return result;
  }

  //////////////////////////////////////
  // UPDATE TRANSACTION
  /////////////////////////////////////
  async update_wallet_transaction_status_service(
    uuid: string,
    status: WalletTransaction["status"]
  ): Promise<WalletTransaction | null> {
    const transaction = await this.single_wallet_transaction_service(uuid);
    if (!transaction) return null;
    transaction.status = status;
    const result = await this.walletTransactionRepo.save(transaction);
    return result;
  }

  //////////////////////////////////////
  // REFUND TRANSACTION
  /////////////////////////////////////
  async refund_wallet_transaction_service(
    uuid: string
  ): Promise<WalletTransaction | null> {
    const result = await this.update_wallet_transaction_status_service(
      uuid,
      "refunded"
    );
    return result;
  }

  //////////////////////////////////////
  // DELETE TRANSACTION
  /////////////////////////////////////
  async delete_wallet_transaction_service(uuid: string): Promise<boolean> {
    const result: any = await this.walletTransactionRepo.delete({ uuid: uuid });
    return result.affected > 0;
  }

  //////////////////////////////////////////////////////////
  // USER TRANSACTION FOR SUBSCRIPTION
  //////////////////////////////////////////////////////////
  async subscription_wallet_transaction_service(
    userId: string
  ): Promise<WalletTransaction[]> {
    const result = await this.walletTransactionRepo.find({
      where: { user_id: userId, transaction_type: "subscription_purchase" },
    });
    return result;
  }
}
