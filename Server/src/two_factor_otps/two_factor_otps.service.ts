import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as crypto from "crypto";
import { TwoFactorOTP } from "./two_factor_otps.entity";
import { AuthUsers } from "src/auth/user.entity";

@Injectable()
export class TwoFactorOtpsService {
  constructor(
    @InjectRepository(TwoFactorOTP)
    private readonly otpRepo: Repository<TwoFactorOTP>,
    @InjectRepository(AuthUsers)
    private readonly userRepo: Repository<AuthUsers>
  ) {}

  ///////////////////////////////////////////
  // Generate OTP for a User
  ///////////////////////////////////////////
  async generateOtp(
    userId: string,
    length = 6,
    ttlMinutes = 5
  ): Promise<string> {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");

    const otpCode = crypto
      .randomInt(0, Math.pow(10, length))
      .toString()
      .padStart(length, "0");
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    const otp = this.otpRepo.create({
      user_id: userId,
      otp_code: otpCode,
      expires_at: expiresAt,
    });

    await this.otpRepo.save(otp);

    // TODO: Send OTP via SMS/Email using your preferred service

    return otpCode; // return plaintext OTP to send
  }

  ///////////////////////////////////////////
  // Verify OTP for a User
  ///////////////////////////////////////////
  async verifyOtp(userId: string, otpCode: string): Promise<boolean> {
    const otp = await this.otpRepo.findOne({
      where: { user_id: userId, otp_code: otpCode, is_used: false },
    });

    if (!otp) throw new BadRequestException("Invalid OTP");

    if (otp.expires_at < new Date())
      throw new BadRequestException("OTP expired");

    otp.is_used = true;
    await this.otpRepo.save(otp);

    return true;
  }

  ///////////////////////////////////////////
  // Expire All OTPs for a User
  ///////////////////////////////////////////
  async expireOtps(userId: string): Promise<void> {
    const otps = await this.otpRepo.find({
      where: { user_id: userId, is_used: false },
    });
    for (const otp of otps) {
      otp.is_used = true;
      await this.otpRepo.save(otp);
    }
  }

  ///////////////////////////////////////////
  // Get Active OTPs for a User (optional, for admin/debug)
  ///////////////////////////////////////////
  async getActiveOtps(userId: string): Promise<TwoFactorOTP[]> {
    return this.otpRepo.find({
      where: {
        user_id: userId,
        is_used: false,
        expires_at: MoreThan(new Date()),
      },
    });
  }
}
