import { Module } from '@nestjs/common';
import { TwoFactorRecoveryCodesService } from './two_factor_recovery_codes.service';
import { TwoFactorRecoveryCodesController } from './two_factor_recovery_codes.controller';

@Module({
  providers: [TwoFactorRecoveryCodesService],
  controllers: [TwoFactorRecoveryCodesController]
})
export class TwoFactorRecoveryCodesModule {}
