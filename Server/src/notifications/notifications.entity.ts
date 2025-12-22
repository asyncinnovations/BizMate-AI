import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
}

export enum NotificationType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  DASHBOARD = "dashboard",
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

  @Column({ type: "timestamp", nullable: true })
  sent_at: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
