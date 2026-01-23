import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity("subscription_usage")
@Unique("uq_subscription_usage", [
  "subscriptionId",
  "usageKey",
  "periodStart",
])
@Index("idx_subscription_usage_sub", ["subscriptionId"])
@Index("idx_subscription_usage_key", ["usageKey"])
@Index("idx_subscription_usage_period", [
  "subscriptionId",
  "periodStart",
  "periodEnd",
])
export class SubscriptionUsage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "subscription_id" })
  subscriptionId: string;

  @Column({ type: "varchar", length: 100, name: "usage_key" })
  usageKey: string;
  // e.g. email_send, api_call, whatsapp_send, ai_prompt

  @Column({ type: "int", default: 0 })
  used: number;

  @Column({ type: "timestamp", name: "period_start" })
  periodStart: Date;

  @Column({ type: "timestamp", name: "period_end" })
  periodEnd: Date;

  @Column({ type: "timestamp", name: "last_used_at", nullable: true })
  lastUsedAt?: Date;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}
