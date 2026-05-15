import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

export enum ScheduleType {
  ONE_TIME = "one_time",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export enum ScheduleStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SENT = "sent",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

@Entity("invoice_schedules")
@Index(["scheduled_at"])
@Index(["status"])
@Index(["invoice_id"])
export class InvoiceSchedule {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  user_id!: string;

  @Column()
  invoice_id!: string;

  @Column()
  recipient_email!: string;

  @Column({
    type: "enum",
    enum: ScheduleType,
    default: ScheduleType.ONE_TIME,
  })
  type!: ScheduleType;

  @Column({ type: "timestamp" })
  scheduled_at!: Date;

  @Column({
    type: "enum",
    enum: ScheduleStatus,
    default: ScheduleStatus.PENDING,
  })
  status!: ScheduleStatus;

  @Column({ default: 0 })
  attempts!: number;

  @Column({ type: "text", nullable: true })
  last_error?: string;

  @Column({ type: "timestamp", nullable: true })
  sent_at?: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
