import { Module } from "@nestjs/common";
import { ChatgptService } from "./chatgpt.service";
import { ChatgptController } from "./chatgpt.controller";
import { ConfigModule } from "@nestjs/config";
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ChatgptService],
  controllers: [ChatgptController],
})
export class ChatgptModule {}
