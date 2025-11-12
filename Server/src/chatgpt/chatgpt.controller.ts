import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatgptService } from "./chatgpt.service";

@Controller("chatgpt")
export class ChatgptController {
  constructor(private readonly gptService: ChatgptService) {}
  ///////////////////////////////////////////////////////////////////////////
  // BASIC RESPONSE BASED ON PROMPT
  ///////////////////////////////////////////////////////////////////////////
  @Post("/")
  async chat(@Body("prompt") prompt: string) {
    const reply = await this.gptService.generate_response_service(prompt);
    return { reply };
  }

  @Get()
  send_document_form() {
    return { message: "send document form to chatgpt" };
  }
}
