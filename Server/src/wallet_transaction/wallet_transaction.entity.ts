import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "wallet_transactions" })
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({
    type: "enum",
    enum: ["credit", "debit", "subscription_purchase", "refund"],
  })
  transaction_type: "credit" | "debit" | "subscription_purchase" | "refund";

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount: number;

  @Column({ type: "varchar", length: 10, default: "USD" })
  currency: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  payment_method: string;

  @Column({ type: "bigint", nullable: true })
  subscription_id: number | null;

  @Column({
    type: "enum",
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending",
  })
  status: "pending" | "success" | "failed" | "refunded";

  @Column({ type: "varchar", length: 100, nullable: true })
  reference_no: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
