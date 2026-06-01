import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoicesService } from "./invoices.service";
import { InvoicesController } from "./invoices.controller";
import { InvoiceEntity } from "./invoices.entity";
import { PdfService } from "src/services/PdfService";
import { EmailService } from "src/services/EmailService";
import { UserPaymentGatewayService } from "src/user_payment_gateway/user_payment_gateway.service";
import { UserPaymentGatewayEntity } from "src/user_payment_gateway/user_payment_gateway.entity";
import { PromptService } from "src/services/PromptService";
import { GPTService } from "src/services/GPTService";
import { ChatgptService } from "src/chatgpt/chatgpt.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceEntity, UserPaymentGatewayEntity]),
  ],
  providers: [
    InvoicesService,
    PromptService,
    PdfService,
    EmailService,
    GPTService,
    ChatgptService,
    UserPaymentGatewayService,
  ],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule {}
