import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import {
  Notification,
  NotificationType,
  NotificationStatus,
} from "./notifications.entity";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  ///////////////////////////////////////////////////////
  // CREATE NOTIFICATION
  ///////////////////////////////////////////////////////
  @Post()
  async createNotification(@Body() body: any) {
    return this.notificationsService.createNotification(body);
  }

  ///////////////////////////////////////////////////////
  // SEND NOTIFICATION
  ///////////////////////////////////////////////////////
  @Put(":notification_id/send")
  async sendNotification(@Param("notification_id") notification_id: string) {
    return this.notificationsService.sendNotification(notification_id);
  }

  ///////////////////////////////////////////////////////
  // GET USER NOTIFICATION
  ///////////////////////////////////////////////////////
  @Get("user/:user_id")
  async getUserNotifications(
    @Param("user_id") user_id: string,
    @Query("company_id") company_id?: string
  ) {
    return this.notificationsService.getUserNotifications(user_id, company_id);
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE NOTIFICATION
  ///////////////////////////////////////////////////////
  @Get(":notification_id")
  async getNotificationById(@Param("notification_id") notification_id: string) {
    return this.notificationsService.getNotificationById(notification_id);
  }

  ///////////////////////////////////////////////////////
  // DELETE NOTIFICATION
  ///////////////////////////////////////////////////////
  @Delete(":notification_id")
  async deleteNotification(@Param("notification_id") notification_id: string) {
    return this.notificationsService.deleteNotification(notification_id);
  }

  ///////////////////////////////////////////////////////
  // MARK NOTIFICATION AS READ
  ///////////////////////////////////////////////////////
  @Put(":notification_id/mark-read")
  async markAsRead(@Param("notification_id") notification_id: string) {
    return this.notificationsService.markAsRead(notification_id);
  }

  ///////////////////////////////////////////////////////
  // SEND BULK NOTIFICATION
  ///////////////////////////////////////////////////////
  @Post("bulk-send")
  async sendBulkNotifications(@Body() notifications: Notification[]) {
    return this.notificationsService.sendBulkNotifications(notifications);
  }

  ///////////////////////////////////////////////////////
  // GET NOTIFICATION BY STATUS
  ///////////////////////////////////////////////////////
  @Get("status/:status")
  async getNotificationsByStatus(@Param("status") status: NotificationStatus) {
    return this.notificationsService.getNotificationsByStatus(status);
  }

  ///////////////////////////////////////////////////////
  // GET REMINDER NOTIFICATION
  ///////////////////////////////////////////////////////
  @Get("reminder/:reminder_id")
  async getNotificationsByReminder(@Param("reminder_id") reminder_id: string) {
    return this.notificationsService.getNotificationsByReminder(reminder_id);
  }

  ///////////////////////////////////////////////////////
  // GET DOCUMENT NOTIFICATION
  ///////////////////////////////////////////////////////
  @Get("document/:document_id")
  async getNotificationsByDocument(@Param("document_id") document_id: string) {
    return this.notificationsService.getNotificationsByDocument(document_id);
  }
}
