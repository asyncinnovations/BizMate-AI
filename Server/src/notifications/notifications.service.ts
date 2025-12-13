import { Injectable, HttpException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from "./notifications.entity";
import { NotificationPreference } from "src/notification_preferences/notification_preferences.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(NotificationPreference)
    private readonly preferenceRepository: Repository<NotificationPreference>
  ) {}

  ///////////////////////////////////////////////////////
  // CEATE NOTIFICATIONS
  ///////////////////////////////////////////////////////
  async createNotification(data: {
    user_id: string;
    company_id?: string;
    reminder_id?: string;
    document_id?: string;
    notification_type: NotificationType;
    title?: string;
    message: string;
  }) {
    const notification = this.notificationRepository.create(data);
    return await this.notificationRepository.save(notification);
  }

  /////////////////////////////////////////////////////////////////////////
  // SEND NOTIFICATION AFTER PREF CHECK
  /////////////////////////////////////////////////////////////////////////
  async sendNotification(notification_id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { uuid: notification_id },
    });
    if (!notification) throw new HttpException("Notification not found", 404);

    // Check user preferences
    const pref = await this.preferenceRepository.findOne({
      where: {
        user_id: notification.user_id,
        event_type: notification.reminder_id ? "reminder" : "general",
      },
    });

    // Skip sending if user has disabled this channel
    if (
      (notification.notification_type === NotificationType.EMAIL &&
        pref?.email_enabled === false) ||
      (notification.notification_type === NotificationType.SMS &&
        pref?.sms_enabled === false) ||
      (notification.notification_type === NotificationType.PUSH &&
        pref?.push_enabled === false) ||
      (notification.notification_type === NotificationType.DASHBOARD &&
        pref?.dashboard_enabled === false)
    ) {
      notification.status = NotificationStatus.FAILED;
      await this.notificationRepository.save(notification);
      return { message: "User preference disabled this notification" };
    }

    notification.status = NotificationStatus.SENT;
    notification.sent_at = new Date();
    await this.notificationRepository.save(notification);

    return notification;
  }

  ///////////////////////////////////////////////////////
  //  GET NOTIFICATION FOR USER
  ///////////////////////////////////////////////////////
  async getUserNotifications(user_id: string, company_id?: string) {
    return this.notificationRepository.find({
      where: { user_id, company_id },
      order: { created_at: "DESC" },
    });
  }

  ///////////////////////////////////////////////////////
  //  GET SINGLE NOTIFICATION
  ///////////////////////////////////////////////////////
  async getNotificationById(notification_id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { uuid: notification_id },
    });
    if (!notification) throw new HttpException("Notification not found", 404);
    return notification;
  }

  ///////////////////////////////////////////////////////
  // DELETE NOTIFICAITON
  ///////////////////////////////////////////////////////
  async deleteNotification(notification_id: string) {
    const notification = await this.getNotificationById(notification_id);
    await this.notificationRepository.remove(notification);
    return { message: "Notification deleted successfully" };
  }

  ///////////////////////////////////////////////////////
  // MARK NOTIFICATION AS READ
  ///////////////////////////////////////////////////////
  async markAsRead(notification_id: string) {
    const notification = await this.getNotificationById(notification_id);
    notification.status = NotificationStatus.SENT; // or another status like READ
    await this.notificationRepository.save(notification);
    return notification;
  }

  ///////////////////////////////////////////////////////
  // SEND BULK NOTIFICATION
  ///////////////////////////////////////////////////////
  async sendBulkNotifications(notifications: Notification[]) {
    const results = [];
    for (const notif of notifications) {
      //   results.push(await this.sendNotification(notif.id));
    }
    return results;
  }

  ///////////////////////////////////////////////////////
  // GET NOTIFICATION BY STATUS
  ///////////////////////////////////////////////////////
  async getNotificationsByStatus(status: NotificationStatus) {
    return this.notificationRepository.find({
      where: { status },
      order: { created_at: "DESC" },
    });
  }

  ///////////////////////////////////////////////////////
  // GET NOTIFICATION BY REMINDER
  ///////////////////////////////////////////////////////
  async getNotificationsByReminder(reminder_id: string) {
    return this.notificationRepository.find({
      where: { reminder_id },
      order: { created_at: "DESC" },
    });
  }

  async getNotificationsByDocument(document_id: string) {
    return this.notificationRepository.find({
      where: { document_id },
      order: { created_at: "DESC" },
    });
  }
}
