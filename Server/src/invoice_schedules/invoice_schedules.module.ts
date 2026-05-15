import { Module } from "@nestjs/common";
import { InvoiceSchedulesService } from "./invoice_schedules.service";
import { InvoiceSchedulesController } from "./invoice_schedules.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoiceSchedule } from "./invoice_schedules.entity";
import { InvoiceEntity } from "src/invoices/invoices.entity";
import { InvoicesModule } from "src/invoices/invoices.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceSchedule, InvoiceEntity]),
    InvoicesModule,
  ],
  providers: [InvoiceSchedulesService],
  controllers: [InvoiceSchedulesController],
})
export class InvoiceSchedulesModule {}
