import { Repository } from "typeorm";
import { TwoFactorOTP } from "./two_factor_otps.entity";
import { AuthUsers } from "src/auth/user.entity";
export declare class TwoFactorOtpsService {
    private readonly otpRepo;
    private readonly userRepo;
    constructor(otpRepo: Repository<TwoFactorOTP>, userRepo: Repository<AuthUsers>);
    generateOtp(userId: string, length?: number, ttlMinutes?: number): Promise<string>;
    verifyOtp(userId: string, otpCode: string): Promise<boolean>;
    expireOtps(userId: string): Promise<void>;
    getActiveOtps(userId: string): Promise<TwoFactorOTP[]>;
}
