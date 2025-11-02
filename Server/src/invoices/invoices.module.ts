import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoicesService } from "./invoices.service";
import { InvoicesController } from "./invoices.controller";
import { InvoiceEntity } from "./invoices.entity";
import { PdfService } from "src/common/PdfService";
import { EmailService } from "src/common/EmailService";
import { UserPaymentGatewayService } from "src/user_payment_gateway/user_payment_gateway.service";
import { UserPaymentGatewayEntity } from "src/user_payment_gateway/user_payment_gateway.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceEntity, UserPaymentGatewayEntity]),
  ],
  providers: [
    InvoicesService,
    PdfService,
    EmailService,
    UserPaymentGatewayService,
  ],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule {}
