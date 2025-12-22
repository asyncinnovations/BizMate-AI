import { TwoFactorOtpsService } from "./two_factor_otps.service";
export declare class TwoFactorOtpsController {
    private readonly otpService;
    constructor(otpService: TwoFactorOtpsService);
    generateOtp(user_id: string, length?: number, ttlMinutes?: number): Promise<{
        success: boolean;
        otp: string;
    }>;
    verifyOtp(user_id: string, otpCode: string): Promise<{
        success: boolean;
    }>;
    expireOtps(user_id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
