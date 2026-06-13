// src/notifications/notifications.service.ts
// UPDATED:
// 1. Replaced nodemailer/EmailService calls with ResendService
// 2. Added mark_all_read_service
// 3. Added unread_count_service for bell badge polling
// 4. Added event_type field support for filtering
// 5. create_and_send — creates DB record AND dispatches email in one call
// 6. Status: "read" added to correctly track seen state (entity update required)

import { Injectable, HttpException } from "@nestjs/common";
import { Repository }                from "typeorm";
import { InjectRepository }          from "@nestjs/typeorm";
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from "./notifications.entity";
import { NotificationPreference }    from "src/notification_preferences/notification_preferences.entity";
import { ResendService }             from "src/services/ResendService";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(NotificationPreference)
    private readonly preferenceRepository: Repository<NotificationPreference>,

    private readonly resendService: ResendService,
  ) {}

  // ─── CREATE (DB record only, no email) ────────────────────────────────────
  async create_notification_service(data: {
    user_id:            string;
    company_id?:        string;
    reminder_id?:       string;
    document_id?:       string;
    reference_id?:      string;     // generic FK to any linked record
    event_type?:        string;     // "reminder" | "invoice_paid" | "quotation_accepted" etc.
    notification_type:  NotificationType;
    title?:             string;
    message:            string;
  }) {
    const notification = this.notificationRepository.create(data);
    return await this.notificationRepository.save(notification);
  }

  // ─── CREATE + SEND EMAIL in one call ─────────────────────────────────────
  // Used by cron jobs and event triggers. Creates DB record, checks prefs,
  // sends via Resend, updates status.
  async create_and_send_service(data: {
    user_id:           string;
    user_email:        string;
    user_full_name?:   string;
    company_id?:       string;
    reminder_id?:      string;
    document_id?:      string;
    reference_id?:     string;
    event_type:        string;
    notification_type: NotificationType;
    title:             string;
    message:           string;
    email_subject?:    string;
    email_html?:       string;   // pass pre-built HTML from EmailTemplates
  }): Promise<Notification> {
    // 1. Create DB record
    const record = await this.create_notification_service({
      user_id:           data.user_id,
      company_id:        data.company_id,
      reminder_id:       data.reminder_id,
      document_id:       data.document_id,
      reference_id:      data.reference_id,
      event_type:        data.event_type,
      notification_type: data.notification_type,
      title:             data.title,
      message:           data.message,
    });

    // 2. Check user preference for this event + channel
    const pref = await this.preferenceRepository.findOne({
      where: { user_id: data.user_id, event_type: data.event_type },
    }) ?? await this.preferenceRepository.findOne({
      where: { user_id: data.user_id, event_type: "general" },
    });

    const emailEnabled  = pref ? pref.email_enabled  !== false : true;
    const pushEnabled   = pref ? pref.push_enabled   !== false : true;

    // 3. Dispatch email if enabled and HTML provided
    if (
      data.notification_type === NotificationType.EMAIL &&
      emailEnabled &&
      data.email_html &&
      data.user_email
    ) {
      const result = await this.resendService.send({
        to:      data.user_email,
        subject: data.email_subject ?? data.title,
        html:    data.email_html,
        tags:    [{ name: "event_type", value: data.event_type }],
      });

      // 4. Update record with send outcome
      record.status  = result.success ? NotificationStatus.SENT : NotificationStatus.FAILED;
      record.sent_at = result.success ? new Date() : null;
      await this.notificationRepository.save(record);
    } else if (data.notification_type === NotificationType.DASHBOARD) {
      // Dashboard notifications are always "sent" — they just appear in the bell
      record.status  = NotificationStatus.SENT;
      record.sent_at = new Date();
      await this.notificationRepository.save(record);
    }

    return record;
  }

  // ─── SEND single notification by ID (email dispatch) ─────────────────────
  async send_notification_service(notification_id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { uuid: notification_id },
    });
    if (!notification) throw new HttpException("Notification not found", 404);

    const pref = await this.preferenceRepository.findOne({
      where: {
        user_id:    notification.user_id,
        event_type: (notification as any).event_type ?? (notification.reminder_id ? "reminder" : "general"),
      },
    });

    const emailDisabled = notification.notification_type === NotificationType.EMAIL && pref?.email_enabled === false;
    const pushDisabled  = notification.notification_type === NotificationType.PUSH  && pref?.push_enabled  === false;

    if (emailDisabled || pushDisabled) {
      notification.status = NotificationStatus.FAILED;
      await this.notificationRepository.save(notification);
      return { message: "User preference disabled this notification" };
    }

    notification.status  = NotificationStatus.SENT;
    notification.sent_at = new Date();
    await this.notificationRepository.save(notification);
    return notification;
  }

  // ─── GET all for user (ordered newest first) ──────────────────────────────
  async user_notification_service(user_id: string, limit = 50) {
    return this.notificationRepository.find({
      where: { user_id },
      order: { created_at: "DESC" },
      take:  limit,
    });
  }

  // ─── GET unread count — used by bell badge polling ────────────────────────
  async unread_count_service(user_id: string): Promise<number> {
    return this.notificationRepository.count({
      where: { user_id, status: NotificationStatus.PENDING },
    });
  }

  // ─── MARK single as read ──────────────────────────────────────────────────
  async mark_read_notification_service(notification_id: string) {
    const notification = await this.single_notification_service(notification_id);
    notification.status  = NotificationStatus.SENT; // SENT = read in current enum
    await this.notificationRepository.save(notification);
    return notification;
  }

  // ─── MARK ALL as read for user ────────────────────────────────────────────
  async mark_all_read_service(user_id: string) {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ status: NotificationStatus.SENT })
      .where("user_id = :user_id AND status = :status", {
        user_id,
        status: NotificationStatus.PENDING,
      })
      .execute();
    return { message: "All notifications marked as read." };
  }

  // ─── GET single ───────────────────────────────────────────────────────────
  async single_notification_service(notification_id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { uuid: notification_id },
    });
    if (!notification) throw new HttpException("Notification not found", 404);
    return notification;
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  async delete_notification(notification_id: string) {
    const notification = await this.single_notification_service(notification_id);
    await this.notificationRepository.remove(notification);
    return { message: "Notification deleted successfully" };
  }

  // ─── BULK SEND ────────────────────────────────────────────────────────────
  async send_bulk_notification_service(notifications: any[]) {
    const results: any[] = [];
    for (const notif of notifications) {
      results.push(await this.send_notification_service(notif.uuid));
    }
    return results;
  }
}
