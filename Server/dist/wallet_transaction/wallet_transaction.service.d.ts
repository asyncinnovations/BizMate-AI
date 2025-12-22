import { Repository } from "typeorm";
import { WalletTransaction } from "./wallet_transaction.entity";
export declare class WalletTransactionService {
    private readonly walletTransactionRepo;
    constructor(walletTransactionRepo: Repository<WalletTransaction>);
    create_wallet_transaction_service(data: Partial<WalletTransaction>): Promise<WalletTransaction>;
    all_wallet_transaction_service(): Promise<WalletTransaction[]>;
    single_wallet_transaction_service(uuid: string): Promise<WalletTransaction | null>;
    user_wallet_transaction_service(userId: string): Promise<WalletTransaction[]>;
    update_wallet_transaction_status_service(uuid: string, status: WalletTransaction["status"]): Promise<WalletTransaction | null>;
    refund_wallet_transaction_service(uuid: string): Promise<WalletTransaction | null>;
    delete_wallet_transaction_service(uuid: string): Promise<boolean>;
    subscription_wallet_transaction_service(userId: string): Promise<WalletTransaction[]>;
}
