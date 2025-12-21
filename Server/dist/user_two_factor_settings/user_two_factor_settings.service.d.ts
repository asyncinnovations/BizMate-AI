import { Repository } from 'typeorm';
import { UserTwoFactorSettings } from './user-two-factor-settings.entity';
import { User } from './user.entity';
export declare class UserTwoFactorSettingsService {
    private readonly twoFactorRepo;
    private readonly userRepo;
    constructor(twoFactorRepo: Repository<UserTwoFactorSettings>, userRepo: Repository<User>);
    getSettings(userId: string): Promise<UserTwoFactorSettings>;
    enableTOTP(userId: string): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    verifyTOTP(userId: string, code: string): Promise<boolean>;
    enable2FA(userId: string): Promise<UserTwoFactorSettings>;
    disable2FA(userId: string): Promise<UserTwoFactorSettings>;
    setMethod(userId: string, method: 'sms' | 'email', value: string): Promise<UserTwoFactorSettings>;
    generateRecoveryCodes(userId: string, count?: number): Promise<string[]>;
    verifyRecoveryCode(userId: string, code: string): Promise<boolean>;
}
