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
} from "@nestjs/common";
import { TemplatesService } from "./templates.service";
import { JwtGuard } from "src/guards/auth/auth.guard";

@Controller("templates")
@UseGuards(JwtGuard) // protect all routes
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  // CREATE TEMPLATE
  @Post("/create")
  @HttpCode(HttpStatus.CREATED)
  async createTemplate(@Body() data: any, @Req() req) {
    const post_data = {
      template_name: data.template_name,
      description: data.description,
      fields_schema: data.fields_schema,
      user_id: req.user?.sub, // from JWT
    };
    const result =
      await this.templatesService.create_template_service(post_data);
    return { message: "Template created successfully", data: result };
  }

  // GET ALL TEMPLATES
  @Get("/all")
  async get_all_template() {
    const templates = await this.templatesService.get_all_template_service();
    if (!templates.length)
      return { message: "No templates found", status: 404 };
    return { message: "All templates", data: templates };
  }

  // GET SINGLE TEMPLATE
  @Get("/single/:id")
  async single_template(@Param("id") id: string) {
    const template = await this.templatesService.single_template_service(id);
    if (!template) return { message: "Template not found", status: 404 };
    return { message: "Template found", data: template };
  }

  // UPDATE TEMPLATE
  @Put("/update/:id")
  async update_template(@Param("id") id: string, @Body() data: any) {
    const updated = await this.templatesService.update_template_service(
      id,
      data
    );
    return { message: "Template updated", data: updated };
  }

  // GET USER TEMPLATES
  @Get("/user/:user_id")
  async user_template(@Param("user_id") user_id: string) {
    const templates =
      await this.templatesService.user_template_service(user_id);
    return { message: "User templates", data: templates };
  }

  // DELETE TEMPLATE
  @Delete("/delete/:id")
  async delete_template(@Param("id") id: string) {
    await this.templatesService.delete_template_service(id);
    return { message: "Template deleted successfully" };
  }
}
