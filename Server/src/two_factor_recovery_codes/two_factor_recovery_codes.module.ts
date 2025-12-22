import { Module } from "@nestjs/common";
import { TwoFactorRecoveryCodesService } from "./two_factor_recovery_codes.service";
import { TwoFactorRecoveryCodesController } from "./two_factor_recovery_codes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TwoFactorRecoveryCode } from "./two_factor_recovery_codes.entity";
import { AuthUsers } from "src/auth/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TwoFactorRecoveryCode, AuthUsers])],
  providers: [TwoFactorRecoveryCodesService],
  controllers: [TwoFactorRecoveryCodesController],
})
export class TwoFactorRecoveryCodesModule {}
