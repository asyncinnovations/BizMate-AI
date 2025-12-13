import { Module } from "@nestjs/common";
import { ComplianceLicensingService } from "./compliance_licensing.service";
import { ComplianceLicensingController } from "./compliance_licensing.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplianceLicense } from "./compliance_licensing.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceLicense])],
  providers: [ComplianceLicensingService],
  controllers: [ComplianceLicensingController],
})
export class ComplianceLicensingModule {}
