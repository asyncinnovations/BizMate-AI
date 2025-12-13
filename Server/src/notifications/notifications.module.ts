import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./notifications.entity";
import { NotificationPreferencesService } from "src/notification_preferences/notification_preferences.service";
import { NotificationPreference } from "src/notification_preferences/notification_preferences.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationPreference])],
  providers: [NotificationsService, NotificationPreferencesService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
