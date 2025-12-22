import { Module } from "@nestjs/common";
import { NotificationPreferencesService } from "./notification_preferences.service";
import { NotificationPreferencesController } from "./notification_preferences.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationPreference } from "./notification_preferences.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationPreference])],
  providers: [NotificationPreferencesService],
  controllers: [NotificationPreferencesController],
})
export class NotificationPreferencesModule {}
