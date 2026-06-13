// src/subscription_payments/subscription_payments.entity.ts
// UPDATED:
// 1. Added order_ref column — links payment to gateway order reference
// 2. Added gateway column — tracks which gateway processed the payment
// 3. Added refund_status for future refund tracking
// 4. Expanded PaymentMethod enum to include telr, tap, apple_pay, google_pay

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum PaymentMethod {
  STRIPE     = "stripe",
  PAYPAL     = "paypal",
  TELR       = "telr",
  TAP        = "tap",
  APPLE_PAY  = "apple_pay",
  GOOGLE_PAY = "google_pay",
  CARD       = "card",
  FREE       = "free",
}

export enum PaymentStatus {
  PENDING   = "pending",
  COMPLETED = "completed",
  FAILED    = "failed",
  REFUNDED  = "refunded",
}

@Entity({ name: "subscription_payments" })
export class SubscriptionPayment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  user_subscription_id: string;

  @Column({ type: "enum", enum: PaymentMethod })
  payment_method: PaymentMethod;

  /** The gateway used to process the payment (may differ from method for Apple/Google Pay) */
  @Column({ type: "varchar", length: 50, nullable: true })
  gateway?: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "varchar", length: 10, nullable: true, default: "AED" })
  currency?: string;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  payment_status: PaymentStatus;

  /** Provider transaction ID — from Stripe session ID, Telr order ref, etc. */
  @Column({ type: "varchar", length: 200, nullable: true })
  transaction_id?: string;

  /** Our internal order reference — passed to gateway and returned in webhook */
  @Column({ type: "varchar", length: 100, nullable: true, unique: true })
  order_ref?: string;

  @Column({ type: "timestamp", nullable: true })
  paid_at?: Date;

  @CreateDateColumn({ type: "timestamp with time zone", default: () => "NOW()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", default: () => "NOW()" })
  updated_at: Date;
}
