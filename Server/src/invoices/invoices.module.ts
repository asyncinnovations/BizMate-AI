import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoicesService } from "./invoices.service";
import { InvoicesController } from "./invoices.controller";
import { InvoiceEntity } from "./invoices.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule {}
