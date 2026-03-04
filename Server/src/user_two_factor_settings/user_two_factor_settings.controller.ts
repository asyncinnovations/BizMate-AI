import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { UserTwoFactorSettingsService } from "./user_two_factor_settings.service";
import { QrcodeGenerator } from "./../services/QrcodeGenerator";

@Controller("user-two-factor-settings")
export class UserTwoFactorSettingsController {
  constructor(
    private readonly twoFactorService: UserTwoFactorSettingsService
  ) {}

  ///////////////////////////////////////////
  // Get 2FA Settings for a User
  ///////////////////////////////////////////
  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  async getSettings(@Param("userId") userId: string) {
    try {
      const response = await this.twoFactorService.getSettings(userId);
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Enable TOTP 2FA (Generate Secret + QR Code)
  ///////////////////////////////////////////
  @Post("user_totp_setup")
  @HttpCode(HttpStatus.OK)
  async enableTOTP(@Body("user_id") user_id: string) {
    try {
      const response = await this.twoFactorService.enableTOTP(user_id);
      return { response, qrcode: await QrcodeGenerator(response.otpauthUrl) };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Verify TOTP Code
  ///////////////////////////////////////////
  @Post("verify_user_totp/:userId")
  @HttpCode(HttpStatus.OK)
  async verifyTOTP(
    @Param("userId") userId: string,
    @Body("code") code: string
  ) {
    try {
      const isValid = await this.twoFactorService.verifyTOTP(userId, code);
      if (isValid) {
        // Enable 2FA after successful verification
        return this.twoFactorService.enable2FA(userId);
      }
      return { success: false, message: "Invalid TOTP code" };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Disable 2FA
  ///////////////////////////////////////////
  @Patch("disable/:userId")
  @HttpCode(HttpStatus.OK)
  async disable2FA(@Param("userId") userId: string) {
    try {
      const response = await this.twoFactorService.disable2FA(userId);
      return { message: "2fa disabled", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Set SMS or Email Method
  ///////////////////////////////////////////
  @Post("method/:userId")
  @HttpCode(HttpStatus.OK)
  async setMethod(
    @Param("userId") userId: string,
    @Body("method") method: "sms" | "email",
    @Body("value") value: string
  ) {
    try {
      const response = await this.twoFactorService.setMethod(
        userId,
        method,
        value
      );
      return { message: "method saved", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Generate Recovery Codes
  ///////////////////////////////////////////
  @Post("recovery_codes/:userId")
  @HttpCode(HttpStatus.OK)
  async generateRecoveryCodes(@Param("userId") userId: string) {
    try {
      const response =
        await this.twoFactorService.generateRecoveryCodes(userId);
      return { message: "recovery code verified", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Verify Recovery Code
  ///////////////////////////////////////////
  @Post("verify_recovery_codes/:userId")
  @HttpCode(HttpStatus.OK)
  async verifyRecoveryCode(
    @Param("userId") userId: string,
    @Body("code") code: string
  ) {
    try {
      const isValid = await this.twoFactorService.verifyRecoveryCode(
        userId,
        code
      );
      return { success: isValid };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
