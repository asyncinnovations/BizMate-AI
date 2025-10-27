import { Module, Injectable } from "@nestjs/common";
import { TemplatesService } from "./templates.service";
import { TemplatesController } from "./templates.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplateEntity } from "./templates.entity";
@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [TemplatesService],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
