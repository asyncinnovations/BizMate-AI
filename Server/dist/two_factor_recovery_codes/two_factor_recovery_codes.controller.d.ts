import { TwoFactorRecoveryCodesService } from "./two_factor_recovery_codes.service";
export declare class TwoFactorRecoveryCodesController {
    private readonly recoveryService;
    constructor(recoveryService: TwoFactorRecoveryCodesService);
    generateRecoveryCodes(user_id: string): Promise<{
        message: string;
        success: boolean;
        codes: string[];
    }>;
    verifyRecoveryCode(user_id: string, code: string): Promise<{
        message: string;
        success: boolean;
    }>;
    expireAllRecoveryCodes(user_id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
