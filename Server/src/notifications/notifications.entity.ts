// src/notifications/notifications.entity.ts
// UPDATED:
// 1. Added event_type column — "reminder" | "invoice_paid" | "quotation_accepted" etc.
// 2. Added reference_id — UUID of linked invoice/quotation/document
// 3. NotificationStatus: added READ so unread count works correctly
// 4. is_read boolean shortcut for simpler queries

import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

export enum NotificationStatus {
  PENDING = "pending",   // created, not yet seen by user
  SENT    = "sent",      // email dispatched / dashboard shown
  READ    = "read",      // user has opened/acknowledged it
  FAILED  = "failed",    // send attempt failed
}

export enum NotificationType {
  EMAIL     = "email",
  SMS       = "sms",
  PUSH      = "push",
  DASHBOARD = "dashboard",
}

// All MVP event types — used for preference filtering and frontend icons
export enum NotificationEventType {
  REMINDER              = "reminder",
  INVOICE_PAID          = "invoice_paid",
  INVOICE_SENT          = "invoice_sent",
  QUOTATION_ACCEPTED    = "quotation_accepted",
  QUOTATION_REJECTED    = "quotation_rejected",
  QUOTATION_SENT        = "quotation_sent",
  DOCUMENT_FINALISED    = "document_finalised",
  SUBSCRIPTION_EXPIRING = "subscription_expiring",
  WELCOME               = "welcome",
  GENERAL               = "general",
}

@Entity("notifications")
export class Notification {
  @Column({ type: "integer", generated: "increment" })
  id: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "uuid", nullable: true })
  company_id: string;

  @Column({ type: "uuid", nullable: true })
  reminder_id: string;

  @Column({ type: "uuid", nullable: true })
  document_id: string;

  /** UUID of any linked record (invoice, quotation, document, reminder) */
  @Column({ type: "uuid", nullable: true })
  reference_id: string;

  /**
   * Event type — used to:
   * - look up user preferences by event
   * - drive the icon/colour shown in the bell dropdown
   * - filter on the notifications page
   */
  @Column({
    type: "varchar",
    length: 80,
    nullable: true,
    default: "general",
  })
  event_type: string;

  @Column({ type: "enum", enum: NotificationType })
  notification_type: NotificationType;

  @Column({ type: "varchar", length: 255, nullable: true })
  title: string;

  @Column({ type: "text" })
  message: string;

  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  /** True once the user clicks/reads it — shortcut for unread badge */
  @Column({ type: "boolean", default: false })
  is_read: boolean;

  @Column({ type: "timestamp", nullable: true })
  sent_at: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
