import { Module } from "@nestjs/common";
import { ComplianceDocumentsService } from "./compliance_documents.service";
import { ComplianceDocumentsController } from "./compliance_documents.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplianceDocument } from "./compliance_documents.entity";
import { PdfService } from "src/services/PdfService";
import { OpenAIService } from "src/services/OpenAIService";
import { DocumentHistoryService } from "src/document_history/document_history.service";
import { DocumentConverter } from "src/services/DocumentConverter";
import { DocumentHistory } from "src/document_history/document_history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceDocument, DocumentHistory])],
  providers: [
    ComplianceDocumentsService,
    PdfService,
    OpenAIService,
    DocumentHistoryService,
    DocumentConverter,
  ],
  controllers: [ComplianceDocumentsController],
})
export class ComplianceDocumentsModule {}
