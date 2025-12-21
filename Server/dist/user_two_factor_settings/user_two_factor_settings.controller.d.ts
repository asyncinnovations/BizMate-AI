import { UserTwoFactorSettingsService } from './user-two-factor-settings.service';
export declare class UserTwoFactorSettingsController {
    private readonly twoFactorService;
    constructor(twoFactorService: UserTwoFactorSettingsService);
    getSettings(userId: string): Promise<any>;
    enableTOTP(userId: string): Promise<any>;
    verifyTOTP(userId: string, code: string): Promise<any>;
    disable2FA(userId: string): Promise<any>;
    setMethod(userId: string, method: 'sms' | 'email', value: string): Promise<any>;
    generateRecoveryCodes(userId: string): Promise<any>;
    verifyRecoveryCode(userId: string, code: string): Promise<{
        success: any;
    }>;
}
