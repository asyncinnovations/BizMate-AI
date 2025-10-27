import { Module } from "@nestjs/common";
import { TemplateFieldService } from "./template_field.service";
import { TemplateFieldController } from "./template_field.controller";
import { TemplateFieldEntity } from "./template_field.entity";
import { TemplateEntity } from "./../templates/templates.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  imports: [TypeOrmModule.forFeature([TemplateFieldEntity, TemplateEntity])],
  providers: [TemplateFieldService],
  controllers: [TemplateFieldController],
  exports: [TemplateFieldService],
})
export class TemplateFieldModule {}
