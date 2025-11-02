import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("invoices")
export class InvoiceEntity {
  @Column({ type: "integer", generated: "increment" })
  id: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  user_id: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  invoice_number: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  customer_name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  customer_email: string;

  @Column({ type: "text", nullable: true })
  customer_address: string;

  @Column({ type: "date", nullable: false })
  invoice_date: Date;

  @Column({ type: "date", nullable: false })
  due_date: Date;

  @Column({ type: "varchar", length: 100, nullable: true })
  payment_terms: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  vat: number;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "varchar", length: 50, default: "draft" })
  status: string;

  //  USER DEFINED EXTRA FILED STORED AS JSON
  @Column({ type: "jsonb", default: () => "'[]'", nullable: true })
  custom_fields: object[];

  @Column({ type: "jsonb", default: () => "'[]'", nullable: true })
  invoice_items: object[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
