import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { TemplatesService } from "./templates.service";
import { JwtGuard } from "src/guards/auth/auth.guard";

@Controller("templates")
@UseGuards(JwtGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  //////////////////////////////////////////////////////////
  // CREATE TEMPLATE
  //////////////////////////////////////////////////////////
  @Post("/create")
  @HttpCode(HttpStatus.CREATED)
  async createTemplate(@Body() data: any, @Req() req) {
    // ✅ Manual validation
    if (!data.template_name || typeof data.template_name !== "string") {
      throw new BadRequestException(
        "Template name is required and must be a string."
      );
    }

    if (!data.fields_schema || typeof data.fields_schema !== "object") {
      throw new BadRequestException(
        "Fields schema is required and must be a valid JSON object."
      );
    }

    if (data.description && typeof data.description !== "string") {
      throw new BadRequestException(
        "Description must be a string if provided."
      );
    }

    if (
      data.is_prebuilt !== undefined &&
      typeof data.is_prebuilt !== "boolean"
    ) {
      throw new BadRequestException("is_prebuilt must be a boolean value.");
    }

    if (data.is_active !== undefined && typeof data.is_active !== "boolean") {
      throw new BadRequestException("is_active must be a boolean value.");
    }

    if (data.version && isNaN(Number(data.version))) {
      throw new BadRequestException("Version must be a number if provided.");
    }

    const post_data = {
      template_name: data.template_name.trim(),
      description: data.description?.trim() || null,
      fields_schema: data.fields_schema,
      user_id: data.user_id || req.user?.uuid,
      is_prebuilt: data.is_prebuilt ?? false,
      version: data.version ?? 1,
      is_active: data.is_active ?? true,
    };

    const result =
      await this.templatesService.create_template_service(post_data);
    return { message: "Template created successfully", data: result };
  }

  //////////////////////////////////////////
  // GET ALL TEMPLATES
  //////////////////////////////////////////
  @Get("/all")
  async get_all_template() {
    const templates = await this.templatesService.get_all_template_service();
    if (!templates || templates.length === 0) {
      return { message: "No templates found", status: 404 };
    }
    return { message: "All templates", data: templates };
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE TEMPLATE
  ///////////////////////////////////////////////////////
  @Get("/single/:id")
  async single_template(@Param("id") id: string) {
    if (!id) {
      throw new BadRequestException("Template ID or UUID is required.");
    }

    const template = await this.templatesService.single_template_service(id);
    if (!template) {
      return { message: "Template not found", status: 404 };
    }

    return { message: "Template found", data: template };
  }

  //////////////////////////////////////////////////
  // UPDATE TEMPLATE
  //////////////////////////////////////////////////
  @Put("/update/:id")
  async update_template(@Param("id") id: string, @Body() data: any) {
    if (!id) {
      throw new BadRequestException("Template ID or UUID is required.");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException("No data provided for update.");
    }

    if (data.template_name && typeof data.template_name !== "string") {
      throw new BadRequestException("Template name must be a string.");
    }

    if (data.fields_schema && typeof data.fields_schema !== "object") {
      throw new BadRequestException(
        "Fields schema must be a valid JSON object."
      );
    }

    if (data.version && isNaN(Number(data.version))) {
      throw new BadRequestException("Version must be numeric if provided.");
    }

    const updated = await this.templatesService.update_template_service(
      id,
      data
    );
    return { message: "Template updated successfully", data: updated };
  }

  //////////////////////////////////////////////
  // GET USER TEMPLATES
  //////////////////////////////////////////////
  @Get("/user/:user_id")
  async user_template(@Param("user_id") user_id: string) {
    if (!user_id) {
      throw new BadRequestException("User ID is required.");
    }

    const templates =
      await this.templatesService.user_template_service(user_id);
    if (!templates || templates.length === 0) {
      return { message: "No templates found for this user", status: 404 };
    }

    return { message: "User templates found", data: templates };
  }

  //////////////////////////////////////////////
  // DELETE TEMPLATE
  //////////////////////////////////////////////
  @Delete("/delete/:id")
  async delete_template(@Param("id") id: string) {
    if (!id) {
      throw new BadRequestException(
        "Template ID or UUID is required for deletion."
      );
    }

    await this.templatesService.delete_template_service(id);
    return { message: "Template deleted successfully" };
  }
}
