import { Module } from "@nestjs/common";
import { UserBusinessInfoService } from "./user_business_info.service";
import { UserBusinessInfoController } from "./user_business_info.controller";
import { UserBusinessInfo } from "./user_business_info.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([UserBusinessInfo])],
  providers: [UserBusinessInfoService],
  controllers: [UserBusinessInfoController],
  exports: [UserBusinessInfoService],
})
export class UserBusinessInfoModule {}
