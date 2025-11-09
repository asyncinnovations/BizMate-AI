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
  Res,
} from "@nestjs/common";
import { TemplatesService } from "./templates.service";
import { JwtGuard } from "src/guards/auth/auth.guard";
import { PdfService } from "src/services/PdfService";
import { join } from "path";
import { EmailService } from "src/services/EmailService";

@Controller("templates")
@UseGuards(JwtGuard)
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService
  ) {}
  //////////////////////////////////////////////////////////
  // CREATE TEMPLATE
  //////////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async createTemplate(@Body() data: any, @Req() req) {
    // Manual validation
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
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async get_all_template() {
    const templates = await this.templatesService.get_all_template_service();
    if (!templates || templates.length === 0) {
      return { message: "No templates found", status: 404, data: [] };
    }
    return { message: "All templates", data: templates };
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE TEMPLATE
  ///////////////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async single_template(@Param("id") id: string) {
    if (!id) {
      throw new BadRequestException("Template ID or UUID is required.");
    }

    const template = await this.templatesService.single_template_service(id);
    if (!template) {
      return { message: "No templates found", status: 404, data: [] };
    }

    return { message: "Template found", data: template };
  }

  //////////////////////////////////////////////////
  // UPDATE TEMPLATE
  //////////////////////////////////////////////////
  @Put("update/:id")
  @HttpCode(HttpStatus.OK)
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
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_template(@Param("user_id") user_id: string) {
    if (!user_id) {
      throw new BadRequestException("User ID is required.");
    }

    const templates =
      await this.templatesService.user_template_service(user_id);
    if (!templates || templates.length === 0) {
      return {
        message: "No templates found for this user",
        status: 404,
        data: [],
      };
    }

    return { message: "User templates found", data: templates };
  }

  //////////////////////////////////////////////
  // PREVIEW DOCUMENT
  //////////////////////////////////////////////
  @Get("preview")
  @HttpCode(HttpStatus.OK)
  async preview_document(@Body() body: any) {
    const data = {
      template_name: "employment Template",
      description: "Standard invoice for clients",
      fields_schema: {
        company_name: "ABC Ltd.",
        company_address: "123 Business St., City, Country",
        company_email: "info@abcltd.com",
        company_phone: "+1 234 567 890",
        client_name: "John Doe",
        client_email: "john.doe@example.com",
        client_phone: "+1 987 654 321",
        invoice_number: "INV-001",
        invoice_date: "2025-10-31",
        due_date: "2025-11-15",
        payment_terms: "Net 15",
        agreement_duration: [{ name: "1 year" }],
        position: "Software Engineer",
        salary: "USD 60,000",
        benefits: ["Health insurance", "Paid leave", "Retirement plan"],
        notes: "Thank you for your business.",
      },
      user_id: "e3a77190-e83a-4a7a-a3b9-965fda4ec888",
      is_prebuilt: false,
      version: 1,
      is_active: true,
    };

    const filename = `${Math.floor(Number(new Date()) * Math.random())}-template_preview.pdf`;
    const filePath = join(__dirname, `../../public/uploads/${filename}`);
    const result = await this.pdfService.TemplatePDFGenerator(data, filePath);
    const url = `/public/uploads/${filename}`;
    return { response: result.message, success: result.success, url };
  }

  //////////////////////////////////////////////
  // DELETE TEMPLATE
  //////////////////////////////////////////////
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_template(@Param("id") id: string) {
    if (!id) {
      throw new BadRequestException(
        "Template ID or UUID is required for deletion."
      );
    }

    await this.templatesService.delete_template_service(id);
    return { message: "Template deleted successfully" };
  }

  ///////////////////////////////////////////////////////
  // SEND TEMPLATE TO EMAIL
  //////////////////////////////////////////////////////
  @Post("send_to_email")
  @HttpCode(HttpStatus.OK)
  async send_template_to_email(@Body() body: any) {
    const response = await this.emailService.send_email(body);
    return { message: "email send success", response };
  }
}
