import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

/**
 * All valid statuses an invoice can hold throughout its lifecycle.
 * Order: draft → saved → sent → viewed → paid / overdue → archived
 */
export enum InvoiceStatus {
  DRAFT    = "draft",
  SAVED    = "saved",
  SENT     = "sent",
  VIEWED   = "viewed",
  PAID     = "paid",
  UNPAID   = "unpaid",
  OVERDUE  = "overdue",
  ARCHIVED = "archived",
}

/**
 * Where the invoice originated — shown as a source tag in the UI.
 */
export enum InvoiceSource {
  MANUAL    = "manual",
  AI        = "ai",
  DUPLICATE = "duplicate",
  TEMPLATE  = "template",
  RECURRING = "recurring",
}

@Entity("invoices")
export class InvoiceEntity {

  @Column({ type: "integer", generated: "increment" })
  id!: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid!: string;

  @Column({ type: "varchar", length: 255, nullable: true, default: null })
  invoice_name!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true, default: null })
  invoice_type!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true, default: null })
  user_id!: string | null;

  @Column({ type: "varchar", length: 50, nullable: false })
  invoice_number!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  customer_name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  customer_email!: string;

  @Column({ type: "text", nullable: true })
  customer_address!: string;

  @Column({ type: "date", nullable: false })
  invoice_date!: Date;

  @Column({ type: "date", nullable: false })
  due_date!: Date;

  @Column({ type: "varchar", length: 100, nullable: true })
  payment_terms!: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  vat!: number;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  total!: number;

  @Column({ type: "text", nullable: true })
  notes!: string;

  // Full lifecycle status — now uses the InvoiceStatus enum
  @Column({
    type: "varchar",
    length: 50,
    default: InvoiceStatus.DRAFT,
  })
  status!: InvoiceStatus;

  // Where this invoice came from (manual, ai, duplicate, template, recurring)
  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
    default: InvoiceSource.MANUAL,
  })
  source!: InvoiceSource;

  // Timestamped log of every status transition — stored as JSONB array
  // Each entry: { status: string, timestamp: ISO string }
  @Column({ type: "jsonb", default: () => "'[]'", nullable: true })
  activity_log!: { status: string; timestamp: string }[];

  // User-defined extra fields stored as JSON
  @Column({ type: "jsonb", default: () => "'[]'", nullable: true })
  custom_fields!: object[];

  @Column({ type: "jsonb", default: () => "'[]'", nullable: true })
  invoice_items!: object[];

  @Column({ type: "text", nullable: true })
  invoice_pdf!: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
