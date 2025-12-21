import { TwoFactorRecoveryCodesService } from "./two_factor_recovery_codes.service";
export declare class TwoFactorRecoveryCodesController {
    private readonly recoveryService;
    constructor(recoveryService: TwoFactorRecoveryCodesService);
    generateRecoveryCodes(user_id: string): Promise<{
        success: boolean;
        codes: string[];
    }>;
    verifyRecoveryCode(user_id: string, code: string): Promise<{
        success: boolean;
    }>;
    expireAllRecoveryCodes(user_id: string): Promise<{
        success: boolean;
    }>;
}
