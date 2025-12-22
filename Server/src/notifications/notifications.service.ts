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
  async create_notification_service(data: {
    user_id: string;
    company_id?: string;
    reminder_id?: string;
    document_id?: string;
    notification_type: NotificationType;
    title?: string;
    message: string;
  }) {
    const notification = this.notificationRepository.create(data);
    const result = await this.notificationRepository.save(notification);
    return result;
  }

  /////////////////////////////////////////////////////////////////////////
  // SEND NOTIFICATION AFTER PREF CHECK
  /////////////////////////////////////////////////////////////////////////
  async send_notification_service(notification_id: string) {
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
  async user_notification_service(user_id: string, company_id?: string) {
    return this.notificationRepository.find({
      where: { user_id, company_id },
      order: { created_at: "DESC" },
    });
  }

  ///////////////////////////////////////////////////////
  //  GET SINGLE NOTIFICATION
  ///////////////////////////////////////////////////////
  async single_notification_service(notification_id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { uuid: notification_id },
    });
    if (!notification) throw new HttpException("Notification not found", 404);
    return notification;
  }

  ///////////////////////////////////////////////////////
  // DELETE NOTIFICAITON
  ///////////////////////////////////////////////////////
  async delete_notification(notification_id: string) {
    const notification =
      await this.single_notification_service(notification_id);
    await this.notificationRepository.remove(notification);
    return { message: "Notification deleted successfully" };
  }

  ///////////////////////////////////////////////////////
  // MARK NOTIFICATION AS READ
  ///////////////////////////////////////////////////////
  async mark_read_notification_service(notification_id: string) {
    const notification =
      await this.single_notification_service(notification_id);
    notification.status = NotificationStatus.SENT; // or another status like READ
    await this.notificationRepository.save(notification);
    return notification;
  }

  ///////////////////////////////////////////////////////
  // SEND BULK NOTIFICATION
  ///////////////////////////////////////////////////////
  async send_bulk_notification_service(notifications: any) {
    const results: any = [];
    for (const notif of notifications) {
      results.push(await this.send_notification_service(notif.uuid));
    }
    return results;
  }
}
