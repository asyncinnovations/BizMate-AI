import { UserTwoFactorSettingsService } from "./user_two_factor_settings.service";
export declare class UserTwoFactorSettingsController {
    private readonly twoFactorService;
    constructor(twoFactorService: UserTwoFactorSettingsService);
    getSettings(userId: string): Promise<import("./user_two_factor_settings.entity").UserTwoFactorSettings>;
    enableTOTP(user_id: string): Promise<{
        response: {
            secret: string;
            otpauthUrl: string;
        };
        qrcode: any;
    }>;
    verifyTOTP(userId: string, code: string): Promise<import("./user_two_factor_settings.entity").UserTwoFactorSettings | {
        success: boolean;
        message: string;
    }>;
    disable2FA(userId: string): Promise<{
        message: string;
        response: import("./user_two_factor_settings.entity").UserTwoFactorSettings;
    }>;
    setMethod(userId: string, method: "sms" | "email", value: string): Promise<{
        message: string;
        response: import("./user_two_factor_settings.entity").UserTwoFactorSettings;
    }>;
    generateRecoveryCodes(userId: string): Promise<{
        message: string;
        response: string[];
    }>;
    verifyRecoveryCode(userId: string, code: string): Promise<{
        success: boolean;
    }>;
}
