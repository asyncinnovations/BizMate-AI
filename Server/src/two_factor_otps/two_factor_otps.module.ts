import { Module } from '@nestjs/common';
import { TwoFactorOtpsService } from './two_factor_otps.service';
import { TwoFactorOtpsController } from './two_factor_otps.controller';

@Module({
  providers: [TwoFactorOtpsService],
  controllers: [TwoFactorOtpsController]
})
export class TwoFactorOtpsModule {}
