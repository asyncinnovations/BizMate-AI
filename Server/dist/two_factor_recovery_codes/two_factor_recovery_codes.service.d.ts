import { Repository } from "typeorm";
import { TwoFactorRecoveryCode } from "./two_factor_recovery_codes.entity";
import { AuthUsers } from "src/auth/user.entity";
export declare class TwoFactorRecoveryCodesService {
    private readonly recoveryRepo;
    private readonly userRepo;
    constructor(recoveryRepo: Repository<TwoFactorRecoveryCode>, userRepo: Repository<AuthUsers>);
    generateRecoveryCodes(userId: string, count?: number): Promise<string[]>;
    verifyRecoveryCode(userId: string, code: string): Promise<boolean>;
    expireAllRecoveryCodes(userId: string): Promise<void>;
    getActiveRecoveryCodes(userId: string): Promise<TwoFactorRecoveryCode[]>;
}
