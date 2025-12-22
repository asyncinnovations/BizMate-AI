import { Module } from "@nestjs/common";
import { TwoFactorOtpsService } from "./two_factor_otps.service";
import { TwoFactorOtpsController } from "./two_factor_otps.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TwoFactorOTP } from "./two_factor_otps.entity";
import { AuthUsers } from "src/auth/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TwoFactorOTP, AuthUsers])],
  providers: [TwoFactorOtpsService],
  controllers: [TwoFactorOtpsController],
})
export class TwoFactorOtpsModule {}
