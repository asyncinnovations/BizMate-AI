// src/quotations/quotations.module.ts

import { Module }             from "@nestjs/common";
import { TypeOrmModule }      from "@nestjs/typeorm";
import { QuotationsService }  from "./quotations.service";
import { QuotationsController } from "./quotations.controller";
import { QuotationEntity }    from "./quotations.entity";
import { InvoicesModule }     from "src/invoices/invoices.module";
import { GPTService }         from "src/services/GPTService";
import { PromptService }      from "src/services/PromptService";
import { EmailService }       from "src/services/EmailService";
import { PdfService }         from "src/services/PdfService";
import { ChatgptService }     from "src/chatgpt/chatgpt.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([QuotationEntity]),
    // Import InvoicesModule so InvoicesService is available for convert-to-invoice
    InvoicesModule,
  ],
  providers: [
    QuotationsService,
    GPTService,
    PromptService,
    EmailService,
    PdfService,
    ChatgptService,
  ],
  controllers: [QuotationsController],
  exports:     [QuotationsService],
})
export class QuotationsModule {}
