import { Module } from "@nestjs/common";
import { UserTwoFactorSettingsService } from "./user_two_factor_settings.service";
import { UserTwoFactorSettingsController } from "./user_two_factor_settings.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthUsers } from "src/auth/user.entity";
import { UserTwoFactorSettings } from "./user_two_factor_settings.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserTwoFactorSettings, AuthUsers])],
  providers: [UserTwoFactorSettingsService],
  controllers: [UserTwoFactorSettingsController],
})
export class UserTwoFactorSettingsModule {}
