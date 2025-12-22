import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

// Enum for payment methods
export enum PaymentMethod {
  STRIPE = "stripe",
  PAYPAL = "paypal",
  CARD = "card",
}

// Enum for payment status
export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

@Entity({ name: "subscription_payments" })
export class SubscriptionPayment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  user_subscription_id: string;

  @Column({ type: "enum", enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "enum", enum: PaymentStatus })
  payment_status: PaymentStatus;

  @Column({ type: "varchar", length: 100, nullable: true })
  transaction_id?: string; // provider transaction ID

  @Column({ type: "timestamp", nullable: true })
  paid_at?: Date;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "NOW()",
  })
  created_at: Date;
}
