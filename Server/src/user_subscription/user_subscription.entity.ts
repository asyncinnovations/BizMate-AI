import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

// Enum for subscription status
export enum SubscriptionStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

@Entity({ name: "user_subscriptions" })
export class UserSubscription {
  @Column({ generated: "increment", type: "integer" })
  id: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "uuid", nullable: false })
  user_id: string;

  @Column({ type: "uuid", nullable: false })
  plan_id: string;

  @Column({ type: "timestamp", default: () => "NOW()" })
  start_date: Date;

  @Column({ type: "timestamp" })
  end_date: Date;

  @Column({
    type: "enum",
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "NOW()",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp with time zone",
    default: () => "NOW()",
  })
  updated_at: Date;
}
