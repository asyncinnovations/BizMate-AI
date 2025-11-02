import { Module, Injectable } from "@nestjs/common";
import { TemplatesService } from "./templates.service";
import { TemplatesController } from "./templates.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplateEntity } from "./templates.entity";
import { PdfService } from "src/common/PdfService";
import { EmailService } from "src/common/EmailService";
@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [TemplatesService, PdfService, EmailService],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
