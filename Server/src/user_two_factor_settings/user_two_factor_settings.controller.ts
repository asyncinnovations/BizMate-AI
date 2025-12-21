import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserTwoFactorSettingsService } from './user-two-factor-settings.service';

@Controller('user-two-factor-settings')
export class UserTwoFactorSettingsController {
  constructor(private readonly twoFactorService: UserTwoFactorSettingsService) {}

  ///////////////////////////////////////////
  // Get 2FA Settings for a User
  ///////////////////////////////////////////
  @Get(':userId')
  async getSettings(@Param('userId') userId: string) {
    return this.twoFactorService.getSettings(userId);
  }

  ///////////////////////////////////////////
  // Enable TOTP 2FA (Generate Secret + QR Code)
  ///////////////////////////////////////////
  @Post(':userId/totp/setup')
  async enableTOTP(@Param('userId') userId: string) {
    return this.twoFactorService.enableTOTP(userId);
  }

  ///////////////////////////////////////////
  // Verify TOTP Code
  ///////////////////////////////////////////
  @Post(':userId/totp/verify')
  async verifyTOTP(
    @Param('userId') userId: string,
    @Body('code') code: string,
  ) {
    const isValid = await this.twoFactorService.verifyTOTP(userId, code);
    if (isValid) {
      // Enable 2FA after successful verification
      return this.twoFactorService.enable2FA(userId);
    }
    return { success: false, message: 'Invalid TOTP code' };
  }

  ///////////////////////////////////////////
  // Disable 2FA
  ///////////////////////////////////////////
  @Patch(':userId/disable')
  async disable2FA(@Param('userId') userId: string) {
    return this.twoFactorService.disable2FA(userId);
  }

  ///////////////////////////////////////////
  // Set SMS or Email Method
  ///////////////////////////////////////////
  @Post(':userId/method')
  async setMethod(
    @Param('userId') userId: string,
    @Body('method') method: 'sms' | 'email',
    @Body('value') value: string,
  ) {
    return this.twoFactorService.setMethod(userId, method, value);
  }

  ///////////////////////////////////////////
  // Generate Recovery Codes
  ///////////////////////////////////////////
  @Post(':userId/recovery-codes')
  async generateRecoveryCodes(@Param('userId') userId: string) {
    return this.twoFactorService.generateRecoveryCodes(userId);
  }

  ///////////////////////////////////////////
  // Verify Recovery Code
  ///////////////////////////////////////////
  @Post(':userId/recovery-codes/verify')
  async verifyRecoveryCode(
    @Param('userId') userId: string,
    @Body('code') code: string,
  ) {
    const isValid = await this.twoFactorService.verifyRecoveryCode(userId, code);
    return { success: isValid };
  }
}
