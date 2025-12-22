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

@Entity("notification_preferences")
export class NotificationPreference {
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

  @Column({ type: "varchar", length: 100 })
  event_type: string; // e.g., vat_filing, license_expiry, ai_reminder

  @Column({ type: "boolean", default: true })
  email_enabled: boolean;

  @Column({ type: "boolean", default: false })
  sms_enabled: boolean;

  @Column({ type: "boolean", default: true })
  push_enabled: boolean;

  @Column({ type: "boolean", default: true })
  dashboard_enabled: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
