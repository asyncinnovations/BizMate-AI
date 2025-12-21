import { Controller, Post, Body, Param } from "@nestjs/common";
import { TwoFactorRecoveryCodesService } from "./two_factor_recovery_codes.service";

@Controller("two-factor-recovery-codes")
export class TwoFactorRecoveryCodesController {
  constructor(
    private readonly recoveryService: TwoFactorRecoveryCodesService
  ) {}

  ///////////////////////////////////////////////
  // Generate Recovery Codes for a User
  ///////////////////////////////////////////////
  @Post("generate/:user_id")
  async generateRecoveryCodes(@Param("user_id") user_id: string) {
    const codes = await this.recoveryService.generateRecoveryCodes(user_id);
    return { success: true, codes }; 
  }

  ///////////////////////////////////////////
  // Verify Recovery Code
  ///////////////////////////////////////////
  @Post("verify/:user_id")
  async verifyRecoveryCode(
    @Param("user_id") user_id: string,
    @Body("code") code: string
  ) {
    const isValid = await this.recoveryService.verifyRecoveryCode(
      user_id,
      code
    );
    return { success: isValid };
  }

  ///////////////////////////////////////////
  // Expire All Recovery Codes for a User (optional)
  ///////////////////////////////////////////
  @Post("expire/:user_id")
  async expireAllRecoveryCodes(@Param("user_id") user_id: string) {
    await this.recoveryService.expireAllRecoveryCodes(user_id);
    return { success: true };
  }
}
