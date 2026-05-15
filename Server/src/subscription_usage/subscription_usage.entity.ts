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
@Unique("uq_subscription_usage", ["subscriptionId", "usageKey", "periodStart"])
@Index("idx_subscription_usage_sub", ["subscriptionId"])
@Index("idx_subscription_usage_key", ["usageKey"])
@Index("idx_subscription_usage_period", [
  "subscriptionId",
  "periodStart",
  "periodEnd",
])
@Entity("subscription_usage")
export class SubscriptionUsage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", nullable: true })
  subscriptionId!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  usageKey!: string;

  @Column({ type: "int", default: 0 })
  used!: number;

  // NEW
  @Column({ type: "varchar", length: 20, nullable: true, default: "daily" })
  periodType!: "daily" | "monthly" | "lifetime";

  @Column({ type: "timestamp", nullable: true })
  periodStart!: Date;

  @Column({ type: "timestamp", nullable: true })
  periodEnd!: Date;

  // NEW (important for upgrades)
  @Column({ type: "int", nullable: true })
  limitSnapshot?: number;

  // NEW (for reset logic / redis sync)
  @Column({ type: "varchar", length: 50, nullable: true })
  resetKey?: string;

  // NEW (enterprise AI control)
  @Column({ type: "varchar", length: 30, nullable: true })
  policyType?: "strict" | "fair_use" | "unlimited";

  @Column({ type: "timestamp", nullable: true })
  lastUsedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
// User Request
//      ↓
// Check capability (allowed?)
//      ↓
// Check quota (remaining?)
//      ↓
// Check AI tier (how smart?)
//      ↓
// Execute + update usage
//  {
//   "payroll": 5,
//   "documents": true,
//   "invoicing": true,
//   "reminders": true,
//   "compliance": true,
//   "ai_advisory": false,
//   "ai_assistant": true,
//   "ai_invoicing": true,
//   "corporate_tax": true,
//   "auto_reply_hub": true,
//   "analytics_reports": true
// }
