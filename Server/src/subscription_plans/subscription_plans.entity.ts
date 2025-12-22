import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

// Enum for plan names
export enum PlanName {
  TRIAL = "Trial",
  STARTER = "Starter",
  STANDARD = "Standard",
  PREMIUM = "Premium",
}

@Entity({ name: "subscription_plans" })
export class SubscriptionPlan {
  @Column({ generated: "increment", type: "integer" })
  id: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "enum", enum: PlanName })
  name: PlanName;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "jsonb", nullable: true })
  features?: Record<string, any>; // store dynamic plan features as JSON

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "int" })
  duration_days: number;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

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
