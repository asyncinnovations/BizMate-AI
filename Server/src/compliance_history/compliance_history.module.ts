import { Module } from "@nestjs/common";
import { ComplianceHistoryService } from "./compliance_history.service";
import { ComplianceHistoryController } from "./compliance_history.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplianceHistory } from "./compliance_history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceHistory])],
  providers: [ComplianceHistoryService],
  controllers: [ComplianceHistoryController],
  exports: [ComplianceHistoryService],
})
export class ComplianceHistoryModule {}
