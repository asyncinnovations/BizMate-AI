import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { TwoFactorOtpsService } from "./two_factor_otps.service";

@Controller("two-factor-otps")
export class TwoFactorOtpsController {
  constructor(private readonly otpService: TwoFactorOtpsService) {}

  ///////////////////////////////////////////
  // Generate OTP for a User (SMS/Email)
  ///////////////////////////////////////////
  @Post("generate/:user_id")
  @HttpCode(HttpStatus.CREATED)
  async generateOtp(
    @Param("user_id") user_id: string,
    @Body("length") length?: number,
    @Body("ttlMinutes") ttlMinutes?: number
  ) {
    try {
      const otp = await this.otpService.generateOtp(
        user_id,
        length || 6,
        ttlMinutes || 5
      );
      return { success: true, otp };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Verify OTP for a User
  ///////////////////////////////////////////
  @Post("verify/:user_id")
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Param("user_id") user_id: string,
    @Body("otpCode") otpCode: string
  ) {
    try {
      const isValid = await this.otpService.verifyOtp(user_id, otpCode);
      return { success: isValid };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Expire All OTPs for a User (optional)
  ///////////////////////////////////////////
  @Post("expire/:user_id")
  @HttpCode(HttpStatus.OK)
  async expireOtps(@Param("user_id") user_id: string) {
    try {
      await this.otpService.expireOtps(user_id);
      return { message: "all otps expired", success: true };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
