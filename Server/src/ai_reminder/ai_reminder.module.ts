import { Module } from "@nestjs/common";
import { AiReminderService } from "./ai_reminder.service";
import { AiReminderController } from "./ai_reminder.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AiReminder } from "./ai_reminder.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AiReminder])],
  providers: [AiReminderService],
  controllers: [AiReminderController],
  exports: [],
})
export class AiReminderModule {}
