// src/quotations/quotations.entity.ts

import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * All statuses a quotation can move through in its lifecycle.
 * The happy path is: draft → sent → viewed → accepted → converted
 * Exit paths:  draft → deleted  |  sent → rejected  |  sent → expired  |  accepted → archived
 */
export enum QuotationStatus {
  DRAFT     = "draft",
  SENT      = "sent",
  VIEWED    = "viewed",
  ACCEPTED  = "accepted",
  REJECTED  = "rejected",
  EXPIRED   = "expired",
  CONVERTED = "converted",
  ARCHIVED  = "archived",
}

/** Where the quotation originated */
export enum QuotationSource {
  MANUAL   = "manual",
  AI       = "ai",
  DUPLICATE = "duplicate",
}

@Entity("quotations")
export class QuotationEntity {

  @Column({ type: "integer", generated: "increment" })
  id!: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid!: string;

  // Owner of the quotation
  @Column({ type: "uuid", nullable: false })
  user_id!: string;

  // Auto-generated reference number e.g. QT-2026-0041
  @Column({ type: "varchar", length: 50, nullable: false })
  quotation_number!: string;

  // What this quotation is for
  @Column({ type: "varchar", length: 255, nullable: true, default: null })
  project_title!: string | null;

  @Column({ type: "text", nullable: true, default: null })
  description!: string | null;

  // Client details — stored directly for snapshot accuracy
  @Column({ type: "uuid", nullable: true, default: null })
  client_id!: string | null;

  @Column({ type: "varchar", length: 255, nullable: false })
  client_name!: string;

  @Column({ type: "varchar", length: 255, nullable: true, default: null })
  client_email!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true, default: null })
  client_address!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true, default: null })
  client_phone!: string | null;

  // Financials
  @Column({ type: "varchar", length: 10, default: "AED" })
  currency!: string;

  @Column({ type: "numeric", precision: 14, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: "numeric", precision: 14, scale: 2, default: 0 })
  total_discount!: number;

  @Column({ type: "numeric", precision: 14, scale: 2, default: 0 })
  total_tax!: number;

  @Column({ type: "numeric", precision: 14, scale: 2, default: 0 })
  grand_total!: number;

  // Line items — each item has: name, description, qty, unit, unit_price, discount_pct, tax_pct, total
  @Column({ type: "jsonb", default: () => "'[]'" })
  line_items!: {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unit?: string;
    unit_price: number;
    discount_pct: number;
    tax_pct: number;
    line_total: number;
  }[];

  // Dates
  @Column({ type: "date", nullable: false })
  issue_date!: Date;

  @Column({ type: "date", nullable: false })
  expiry_date!: Date;

  // Terms and notes
  @Column({ type: "text", nullable: true, default: null })
  terms_and_conditions!: string | null;

  @Column({ type: "text", nullable: true, default: null })
  notes!: string | null;

  // AI prompt used to generate this quotation (if source = ai)
  @Column({ type: "text", nullable: true, default: null })
  ai_prompt!: string | null;

  // Status lifecycle
  @Column({ type: "varchar", length: 50, default: QuotationStatus.DRAFT })
  status!: QuotationStatus;

  @Column({ type: "varchar", length: 50, default: QuotationSource.MANUAL })
  source!: QuotationSource;

  // Activity log — every status transition with timestamp and actor
  @Column({ type: "jsonb", default: () => "'[]'" })
  activity_log!: { status: string; timestamp: string; actor?: string }[];

  // Public client token — generated on send, used for the shareable URL
  // Token is cleared after client accepts or rejects
  @Column({ type: "varchar", length: 100, nullable: true, default: null, unique: true })
  public_token!: string | null;

  @Column({ type: "timestamp", nullable: true, default: null })
  viewed_at!: Date | null;

  @Column({ type: "timestamp", nullable: true, default: null })
  client_action_at!: Date | null;

  // Comment left by client on acceptance or rejection
  @Column({ type: "text", nullable: true, default: null })
  client_comment!: string | null;

  // If converted: UUID of the resulting invoice
  @Column({ type: "uuid", nullable: true, default: null })
  converted_invoice_id!: string | null;

  // Linked documents: proposal, contract, scope docs
  // Array of { document_uuid, document_type, document_name }
  @Column({ type: "jsonb", default: () => "'[]'" })
  linked_documents!: { document_uuid: string; document_type: string; document_name: string }[];

  // PDF path after generation
  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  pdf_path!: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
