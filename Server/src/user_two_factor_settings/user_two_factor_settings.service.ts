import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { authenticator } from "otplib";
import * as crypto from "crypto";
import { AuthUsers } from "src/auth/user.entity";
import { UserTwoFactorSettings } from "./user_two_factor_settings.entity";

@Injectable()
export class UserTwoFactorSettingsService {
  constructor(
    @InjectRepository(UserTwoFactorSettings)
    private readonly twoFactorRepo: Repository<UserTwoFactorSettings>,
    @InjectRepository(AuthUsers)
    private readonly userRepo: Repository<AuthUsers>
  ) {}

  ///////////////////////////////////////////
  // Get 2FA Settings for a User
  ///////////////////////////////////////////
  async getSettings(userId: string): Promise<UserTwoFactorSettings> {
    const settings = await this.twoFactorRepo.findOne({
      where: { user_id: userId },
    });
    if (!settings) throw new NotFoundException("2FA settings not found");
    return settings;
  }

  ///////////////////////////////////////////
  // Enable TOTP 2FA (Generate Secret + QR Code)
  ///////////////////////////////////////////
  async enableTOTP(
    userId: string
  ): Promise<{ secret: string; otpauthUrl: string }> {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, "YourAppName", secret);

    let settings = await this.twoFactorRepo.findOne({
      where: { user_id: userId },
    });
    if (!settings) {
      settings = this.twoFactorRepo.create({
        user_id: userId,
        method: "totp",
        secret,
        is_enabled: false,
      });
    } else {
      settings.method = "totp";
      settings.secret = secret;
      settings.is_enabled = false;
    }

    await this.twoFactorRepo.save(settings);
    return { secret, otpauthUrl };
  }

  ///////////////////////////////////////////
  // Verify TOTP Code
  ///////////////////////////////////////////
  async verifyTOTP(userId: string, code: string): Promise<boolean> {
    const settings = await this.getSettings(userId);
    if (!settings.secret) throw new BadRequestException("TOTP not set up");

    const isValid = authenticator.check(code, settings.secret);
    return isValid;
  }

  ///////////////////////////////////////////
  // Enable 2FA After Verification
  ///////////////////////////////////////////
  async enable2FA(userId: string): Promise<UserTwoFactorSettings> {
    const settings = await this.getSettings(userId);
    settings.is_enabled = true;
    return this.twoFactorRepo.save(settings);
  }

  ///////////////////////////////////////////
  // Disable 2FA
  ///////////////////////////////////////////
  async disable2FA(userId: string): Promise<UserTwoFactorSettings> {
    const settings = await this.getSettings(userId);
    settings.is_enabled = false;
    settings.secret = null;
    settings.phone = null;
    settings.email = null;
    return this.twoFactorRepo.save(settings);
  }

  ///////////////////////////////////////////
  // Set SMS or Email Method
  ///////////////////////////////////////////
  async setMethod(
    userId: string,
    method: "sms" | "email",
    value: string
  ): Promise<UserTwoFactorSettings> {
    const settings = await this.twoFactorRepo.findOne({
      where: { user_id: userId },
    });
    if (!settings) {
      const user = await this.userRepo.findOne({ where: { uuid: userId } });
      if (!user) throw new NotFoundException("User not found");
      const newSettings = this.twoFactorRepo.create({
        user_id: userId,
        method,
        is_enabled: false,
      });
      if (method === "sms") newSettings.phone = value;
      else newSettings.email = value;
      return this.twoFactorRepo.save(newSettings);
    }

    settings.method = method;
    if (method === "sms") settings.phone = value;
    else settings.email = value;
    return this.twoFactorRepo.save(settings);
  }

  ///////////////////////////////////////////
  // Generate Recovery Codes
  ///////////////////////////////////////////
  async generateRecoveryCodes(userId: string, count = 10): Promise<string[]> {
    const settings = await this.getSettings(userId);
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString("hex");
      codes.push(code);
      // await this.recoveryRepo.save({ user, code: hash(code), is_used: false });
    }
    return codes;
  }

  ///////////////////////////////////////////
  // Verify Recovery Code
  ///////////////////////////////////////////
  async verifyRecoveryCode(userId: string, code: string): Promise<boolean> {
    // Lookup hashed code in two_factor_recovery_codes table
    // Mark as used if valid
    return true;
  }
}
