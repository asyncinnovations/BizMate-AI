import { WalletTransactionService } from "./wallet_transaction.service";
import { WalletTransaction } from "./wallet_transaction.entity";
export declare class WalletTransactionController {
    private readonly walletTransactionService;
    constructor(walletTransactionService: WalletTransactionService);
    create_wallet_transaction(data: Partial<WalletTransaction>): Promise<{
        message: string;
        response: WalletTransaction;
    }>;
    all_wallet_transaction(): Promise<{
        message: string;
        response: WalletTransaction[];
    }>;
    single_wallet_transaction(uuid: string): Promise<{
        message: string;
        response: WalletTransaction | null;
    }>;
    user_wallet_transaction(userId: string): Promise<{
        message: string;
        response: WalletTransaction[];
    }>;
    update_wallet_transaction_status(uuid: string, status: WalletTransaction["status"]): Promise<{
        message: string;
        response: WalletTransaction | null;
    }>;
    refund_wallet_transaction(uuid: string): Promise<{
        message: string;
        response: WalletTransaction | null;
    }>;
    delete_wallet_transaction(uuid: string): Promise<{
        message: string;
        response: boolean;
    }>;
    subscription_wallet_transaction(userId: string): Promise<{
        message: string;
        response: WalletTransaction[];
    }>;
}
