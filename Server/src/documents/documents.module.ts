// src/documents/documents.module.ts
import { Module }             from "@nestjs/common";
import { TypeOrmModule }      from "@nestjs/typeorm";
import { DocumentsService }   from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { GeneratedDocumentEntity } from "./documents.entity";
import { TemplateEntity }     from "src/templates/templates.entity";
import { GPTService }         from "src/services/GPTService";
import { PromptService }      from "src/services/PromptService";
import { PdfService }         from "src/services/PdfService";
import { ChatgptService }     from "src/chatgpt/chatgpt.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([GeneratedDocumentEntity, TemplateEntity]),
  ],
  providers: [
    DocumentsService,
    GPTService,
    PromptService,
    PdfService,
    ChatgptService,
  ],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
