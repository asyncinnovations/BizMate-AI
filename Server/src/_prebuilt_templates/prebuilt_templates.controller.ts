import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";

@Controller("prebuilt-templates")
export class PrebuiltTemplatesController {
  /////////////////////////////////////////////////////////
  // GET ALL TEMPLATE
  /////////////////////////////////////////////////////////
  @Get("/all")
  all_template_controller() {
    return { message: "all template" };
  }
  /////////////////////////////////////////////////////////
  // CREATE TEMPLATE
  /////////////////////////////////////////////////////////
  @Post("/create")
  create_template_controller(@Body() data: any) {
    return { message: "create template" };
  }
  /////////////////////////////////////////////////////////
  // GET SINGLE TEMPLATE
  /////////////////////////////////////////////////////////
  @Get("/single/:id")
  single_template_controller(@Param("id") id: any) {
    return { message: "single template:id", id: id };
  }
}
