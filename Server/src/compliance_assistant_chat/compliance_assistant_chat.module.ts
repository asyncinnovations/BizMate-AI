import { Module } from "@nestjs/common";
import { ComplianceAssistantChatService } from "./compliance_assistant_chat.service";
import { ComplianceAssistantController } from "./compliance_assistant_chat.controller";
import { ComplianceAssistantChat } from "./compliance_assistant_chat.entity";
import { GPTService } from "src/services/GPTService";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceAssistantChat])],
  providers: [ComplianceAssistantChatService, GPTService],
  controllers: [ComplianceAssistantController],
})
export class ComplianceAssistantModule {}
