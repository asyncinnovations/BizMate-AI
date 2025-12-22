import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
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
  @HttpCode(HttpStatus.CREATED)
  async generateRecoveryCodes(@Param("user_id") user_id: string) {
    try {
      const codes = await this.recoveryService.generateRecoveryCodes(user_id);
      return { message: "recovery codes generated", success: true, codes };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Verify Recovery Code
  ///////////////////////////////////////////
  @Post("verify/:user_id")
  @HttpCode(HttpStatus.OK)
  async verifyRecoveryCode(
    @Param("user_id") user_id: string,
    @Body("code") code: string
  ) {
    try {
      const isValid = await this.recoveryService.verifyRecoveryCode(
        user_id,
        code
      );
      return { message: "verification status", success: isValid };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Expire All Recovery Codes for a User (optional)
  ///////////////////////////////////////////
  @Post("expire/:user_id")
  @HttpCode(HttpStatus.OK)
  async expireAllRecoveryCodes(@Param("user_id") user_id: string) {
    try {
      await this.recoveryService.expireAllRecoveryCodes(user_id);
      return { message: "all recovery code expired", success: true };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
