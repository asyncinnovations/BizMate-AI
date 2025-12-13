import { Module } from "@nestjs/common";
import { ComplianceDocumentsService } from "./compliance_documents.service";
import { ComplianceDocumentsController } from "./compliance_documents.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplianceDocument } from "./compliance_documents.entity";
import { PdfService } from "src/services/PdfService";
import { OpenAIService } from "src/services/OpenAIService";

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceDocument])],
  providers: [ComplianceDocumentsService, PdfService, OpenAIService],
  controllers: [ComplianceDocumentsController],
})
export class ComplianceDocumentsModule {}
