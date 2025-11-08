import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("ai_reminders")
export class AiReminder {
  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({
    type: "integer",
    generated: "increment",
  })
  id: number;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: ["VAT", "License", "Payroll", "Custom"],
  })
  type: "VAT" | "License" | "Payroll" | "Custom";

  @Column({ type: "timestamp" })
  reminder_date: Date;

  @Column({
    type: "integer",
    default: 3,
    comment: "Number of days before reminder_date to notify user",
  })
  notify_before: number;

  @Column({
    type: "jsonb",
    default: () => `'{"email": true, "whatsapp": false, "push": true}'`,
  })
  notify_channels: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };

  @Column({
    type: "boolean",
    default: false,
  })
  notified: boolean;

  @Column({
    type: "enum",
    enum: ["none", "monthly", "quarterly", "yearly"],
    default: "none",
  })
  recurrence_rule: "none" | "monthly" | "quarterly" | "yearly";

  @Column({
    type: "enum",
    enum: ["pending", "sent", "completed", "missed"],
    default: "pending",
  })
  status: "pending" | "sent" | "completed" | "missed";

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
