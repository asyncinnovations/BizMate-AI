import { Module } from '@nestjs/common';
import { UserTwoFactorSettingsService } from './user_two_factor_settings.service';
import { UserTwoFactorSettingsController } from './user_two_factor_settings.controller';

@Module({
  providers: [UserTwoFactorSettingsService],
  controllers: [UserTwoFactorSettingsController]
})
export class UserTwoFactorSettingsModule {}
