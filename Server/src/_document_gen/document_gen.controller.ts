import { Body, Controller, Get } from "@nestjs/common";

@Controller("document-generator")
export class DocumentGenController {
  @Get()
  get_document() {
    return { message: "welcome to document generator" };
  }
}
