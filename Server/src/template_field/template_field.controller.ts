import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  BadRequestException,
  UseGuards,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { TemplateFieldService } from "./template_field.service";
import { TemplateFieldEntity } from "./template_field.entity";
import { JwtGuard } from "src/guards/auth/auth.guard";

@Controller("template_field")
// @UseGuards(JwtGuard)
export class TemplateFieldController {
  constructor(private readonly templateFieldService: TemplateFieldService) {}

  //////////////////////////////////////////////////////////////////////
  //  VALIDATE TEMPLATE FIELDS
  //////////////////////////////////////////////////////////////////////
  private validateTemplateField(data: Partial<TemplateFieldEntity>) {
    const errors: string[] = [];

    // Template ID required and must be UUID
    if (!data.template_id) errors.push("template_id is required.");
    else if (!/^[0-9a-fA-F-]{36}$/.test(data.template_id))
      errors.push("template_id must be a valid UUID.");

    // Field name
    if (!data.field_name || data.field_name.trim() === "")
      errors.push("field_name is required.");
    else if (data.field_name.length > 100)
      errors.push("field_name must be less than or equal to 100 characters.");

    // Field type
    if (data.field_type && data.field_type.length > 255)
      errors.push("field_type must be less than or equal to 255 characters.");

    // Required field (must be boolean if provided)
    if (data.required !== undefined && typeof data.required !== "boolean") {
      errors.push("required must be a boolean value (true or false).");
    }

    // Return all collected errors
    if (errors.length > 0) {
      throw new BadRequestException({
        message: "Validation failed",
        errors,
      });
    }
  }

  //////////////////////////////////////////////////////////////////////
  // CREATE SINGLE TEMPLATE FIELD
  //////////////////////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_template_field(@Body() body: Partial<TemplateFieldEntity>) {
    this.validateTemplateField(body);

    const data: any = {
      template_id: body.template_id,
      field_name: body.field_name?.trim(),
      placeholder: body.placeholder,
      field_value: body.field_value || null,
      field_type: body.field_type || null,
      required: body.required ?? false,
    };

    const response =
      await this.templateFieldService.create_template_field_service(data);

    return { message: "Template field created successfully", response };
  }

  //////////////////////////////////////////////////////////////////////
  // CREATE MULTIPLE FIELDS FOR A TEMPLATE
  //////////////////////////////////////////////////////////////////////
  @Post("bulk/:template_id")
  @HttpCode(HttpStatus.OK)
  async create_many_template_fields(
    @Param("template_id", new ParseUUIDPipe()) template_id: string,
    @Body() fields: Partial<TemplateFieldEntity>[]
  ) {
    if (!Array.isArray(fields) || fields.length === 0)
      throw new BadRequestException("Fields array cannot be empty.");

    // Validate each field manually
    for (const field of fields) {
      this.validateTemplateField({ ...field, template_id });
    }

    const response =
      await this.templateFieldService.create_many_template_field_service(
        template_id,
        fields
      );

    return { message: "Bulk fields created successfully", response };
  }

  //////////////////////////////////////////////////////////////////////
  // GET ALL FIELDS BY TEMPLATE UUID
  //////////////////////////////////////////////////////////////////////
  @Get("template/:template_id")
  @HttpCode(HttpStatus.OK)
  async get_fields_by_template(
    @Param("template_id", new ParseUUIDPipe()) template_id: string
  ) {
    const response =
      await this.templateFieldService.field_by_templateId_service(template_id);
    return { message: "Template fields retrieved successfully", response };
  }

  //////////////////////////////////////////////////////////////////////
  // GET SINGLE FIELD BY UUID
  //////////////////////////////////////////////////////////////////////
  @Get("single/:tfield_id")
  @HttpCode(HttpStatus.OK)
  async get_single_field(
    @Param("tfield_id", new ParseUUIDPipe()) tfield_id: string
  ) {
    const response =
      await this.templateFieldService.single_template_field_service(tfield_id);
    return {
      message: "Single template field retrieved successfully",
      response,
    };
  }

  //////////////////////////////////////////////////////////////////////
  // UPDATE SINGLE FIELD BY UUID
  //////////////////////////////////////////////////////////////////////
  @Patch("update/:tfield_id")
  @HttpCode(HttpStatus.OK)
  async update_single_field(
    @Param("tfield_id", new ParseUUIDPipe()) tfield_id: string,
    @Body() data: Partial<TemplateFieldEntity>
  ) {
    this.validateTemplateField(data);

    const response =
      await this.templateFieldService.update_template_field_service(
        tfield_id,
        data
      );
    return { message: "Template field updated successfully", response };
  }
  //////////////////////////////////////////////////////////////////////
  // UPDATE SINGLE FIELD BY UUID
  //////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  // Bulk Update Template Fields
  ///////////////////////////////////////////////////////////////
  @Patch("bulk_update/:tid")
  @HttpCode(HttpStatus.OK)
  async bulk_update_template_field(
    @Param("tid", new ParseUUIDPipe()) template_id: string,
    @Body() data: any[]
  ) {
    console.log(template_id);
    // Validate that `data` is an array
    if (!Array.isArray(data) || data.length === 0) {
      throw new BadRequestException(
        "Request body must be a non-empty array of template fields"
      );
    }

    // Validate each field object
    data.forEach((field, index) => {
      if (!field.id && !field.uuid) {
        throw new BadRequestException(
          `Each field must include 'id' or 'uuid' (item at index ${index})`
        );
      }
      if (!field.template_id || field.template_id !== template_id) {
        throw new BadRequestException(
          `Each field must have a matching 'template_id' (item at index ${index})`
        );
      }
    });

    const response =
      await this.templateFieldService.bulk_update_template_field_service(
        template_id,
        data
      );

    return {
      message: "Template fields updated successfully",
      success: true,
      data: response,
    };
  }

  //////////////////////////////////////////////////////////////////////
  // DELETE SINGLE FIELD
  //////////////////////////////////////////////////////////////////////
  @Delete("delete/:tfield_id")
  @HttpCode(HttpStatus.OK)
  async delete_single_field(
    @Param("tfield_id", new ParseUUIDPipe()) tfield_id: string
  ) {
    const response =
      await this.templateFieldService.delete_template_field_service(tfield_id);
    return { message: "Template field deleted successfully", response };
  }

  //////////////////////////////////////////////////////////////////////
  // DELETE ALL FIELDS OF A TEMPLATE
  //////////////////////////////////////////////////////////////////////
  @Delete("delete/template/:template_id")
  @HttpCode(HttpStatus.OK)
  async delete_all_fields_of_template(
    @Param("template_id", new ParseUUIDPipe()) template_id: string
  ) {
    const response =
      await this.templateFieldService.delete_field_by_template_service(
        template_id
      );
    return { message: "All template fields deleted successfully", response };
  }

  //////////////////////////////////////////////////////////////////////
  // CLONE FIELDS FROM ONE TEMPLATE TO ANOTHER
  //////////////////////////////////////////////////////////////////////
  @Post("clone/:fromtfield_id/:totfield_id")
  @HttpCode(HttpStatus.OK)
  async clone_fields(
    @Param("fromtfield_id", new ParseUUIDPipe()) fromtfield_id: string,
    @Param("totfield_id", new ParseUUIDPipe()) totfield_id: string
  ) {
    const response =
      await this.templateFieldService.clone_field_one_to_another_service(
        fromtfield_id,
        totfield_id
      );
    return { message: "Template fields cloned successfully", response };
  }
}
