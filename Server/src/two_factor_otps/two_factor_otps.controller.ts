import { Controller, Post, Body, Param } from "@nestjs/common";
import { TwoFactorOtpsService } from "./two_factor_otps.service";

@Controller("two-factor-otps")
export class TwoFactorOtpsController {
  constructor(private readonly otpService: TwoFactorOtpsService) {}

  ///////////////////////////////////////////
  // Generate OTP for a User (SMS/Email)
  ///////////////////////////////////////////
  @Post("generate/:user_id")
  async generateOtp(
    @Param("user_id") user_id: string,
    @Body("length") length?: number,
    @Body("ttlMinutes") ttlMinutes?: number
  ) {
    const otp = await this.otpService.generateOtp(
      user_id,
      length || 6,
      ttlMinutes || 5
    );
    return { success: true, otp }; 
  }

  ///////////////////////////////////////////
  // Verify OTP for a User
  ///////////////////////////////////////////
  @Post("verify/:user_id")
  async verifyOtp(
    @Param("user_id") user_id: string,
    @Body("otpCode") otpCode: string
  ) {
    const isValid = await this.otpService.verifyOtp(user_id, otpCode);
    return { success: isValid };
  }

  ///////////////////////////////////////////
  // Expire All OTPs for a User (optional)
  ///////////////////////////////////////////
  @Post("expire/:user_id")
  async expireOtps(@Param("user_id") user_id: string) {
    await this.otpService.expireOtps(user_id);
    return { success: true };
  }
}
