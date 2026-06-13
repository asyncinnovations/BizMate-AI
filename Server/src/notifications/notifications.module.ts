// src/notifications/notifications.module.ts
// UPDATED: exports NotificationsService so other modules can inject it
// and ResendService for email dispatch

import { Module }                            from "@nestjs/common";
import { TypeOrmModule }                     from "@nestjs/typeorm";
import { NotificationsService }              from "./notifications.service";
import { NotificationsController }           from "./notifications.controller";
import { Notification }                      from "./notifications.entity";
import { NotificationPreference }            from "src/notification_preferences/notification_preferences.entity";
import { NotificationPreferencesService }    from "src/notification_preferences/notification_preferences.service";
import { ResendService }                     from "src/services/ResendService";

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationPreference]),
  ],
  providers: [
    NotificationsService,
    NotificationPreferencesService,
    ResendService,
  ],
  controllers: [NotificationsController],
  // Export both so InvoicesModule, QuotationsModule, DocumentsModule can inject them
  exports: [NotificationsService, ResendService],
})
export class NotificationsModule {}
