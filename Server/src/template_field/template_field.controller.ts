import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { TemplateFieldService } from "./template_field.service";
import { TemplateFieldEntity } from "./template_field.entity";

@Controller("template_field")
export class TemplateFieldController {
  constructor(private readonly templateFieldService: TemplateFieldService) {}

  //////////////////////////////////////////////////////////////////////
  // CREATE SINGLE TEMPLATE FIELD
  //////////////////////////////////////////////////////////////////////
  @Post("/create")
  async create_template_field(
    @Body() body: Partial<TemplateFieldEntity>
  ): Promise<TemplateFieldEntity> {
    return await this.templateFieldService.create_template_field_service(body);
  }

  //////////////////////////////////////////////////////////////////////
  // CREATE MULTIPLE FIELDS FOR A TEMPLATE
  //////////////////////////////////////////////////////////////////////
  @Post("bulk/:template_id")
  async create_many_template_fields(
    @Param("template_id", new ParseUUIDPipe()) template_id: string,
    @Body() fields: Partial<TemplateFieldEntity>[]
  ): Promise<TemplateFieldEntity[]> {
    return await this.templateFieldService.create_many_template_field_service(
      template_id,
      fields
    );
  }

  //////////////////////////////////////////////////////////////////////
  // GET ALL FIELDS BY TEMPLATE UUID
  //////////////////////////////////////////////////////////////////////
  @Get("template/:template_id")
  async get_fields_by_template(
    @Param("template_id", new ParseUUIDPipe()) template_id: string
  ): Promise<TemplateFieldEntity[]> {
    return await this.templateFieldService.field_by_templateId_service(
      template_id
    );
  }

  //////////////////////////////////////////////////////////////////////
  // GET SINGLE FIELD BY UUID
  //////////////////////////////////////////////////////////////////////
  @Get("/single/:tfield_id")
  async get_single_field(
    @Param("tfield_id", new ParseUUIDPipe()) tfield_id: string
  ): Promise<TemplateFieldEntity> {
    return await this.templateFieldService.single_template_field_service(
      tfield_id
    );
  }

  //////////////////////////////////////////////////////////////////////
  // UPDATE SINGLE FIELD BY UUID
  //////////////////////////////////////////////////////////////////////
  @Patch("update/:tfield_id")
  async update_single_field(
    @Param("tfield_id", new ParseUUIDPipe()) tfield_id: string,
    @Body() data: Partial<TemplateFieldEntity>
  ): Promise<TemplateFieldEntity> {
    return await this.templateFieldService.update_template_field_service(
      tfield_id,
      data
    );
  }

  //////////////////////////////////////////////////////////////////////
  // BULK UPDATE FIELDS FOR A TEMPLATE
  //////////////////////////////////////////////////////////////////////
  @Patch("bulk_update/:template_id")
  async bulk_update_fields(
    @Param("template_id", new ParseUUIDPipe()) template_id: string,
    @Body() updates: Partial<TemplateFieldEntity>[]
  ) {
    return await this.templateFieldService.bulk_update_template_field_service(
      template_id,
      updates
    );
  }

  //////////////////////////////////////////////////////////////////////
  // DELETE SINGLE FIELD
  //////////////////////////////////////////////////////////////////////
  @Delete("delete/:tfield_id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete_single_field(
    @Param("tfield_id", new ParseUUIDPipe()) tfield_id: string
  ): Promise<void> {
    await this.templateFieldService.delete_template_field_service(tfield_id);
  }

  //////////////////////////////////////////////////////////////////////
  // DELETE ALL FIELDS OF A TEMPLATE
  //////////////////////////////////////////////////////////////////////
  @Delete("template/:template_id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete_all_fields_of_template(
    @Param("template_id", new ParseUUIDPipe()) template_id: string
  ): Promise<void> {
    await this.templateFieldService.delete_field_by_template_service(
      template_id
    );
  }

  //////////////////////////////////////////////////////////////////////
  // CLONE FIELDS FROM ONE TEMPLATE TO ANOTHER
  //////////////////////////////////////////////////////////////////////
  @Post("clone/:fromtfield_id/:totfield_id")
  async clone_fields(
    @Param("fromtfield_id", new ParseUUIDPipe()) fromtfield_id: string,
    @Param("totfield_id", new ParseUUIDPipe()) totfield_id: string
  ) {
    return await this.templateFieldService.clone_field_one_to_another_service(
      fromtfield_id,
      totfield_id
    );
  }
}
