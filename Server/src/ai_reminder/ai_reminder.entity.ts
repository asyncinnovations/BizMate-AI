// src/ai_reminder/ai_reminder.entity.ts
// UPDATED — added: source, reference_id, reference_type, ai_prompt
// UPDATED — type enum now includes Invoice + Quotation
// UPDATED — notify_before now defaults to 3 (was 3, unchanged — just clarified)

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("ai_reminders")
export class AiReminder {

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid!: string;

  @Column({ type: "integer", generated: "increment" })
  id!: number;

  @Column({ type: "uuid" })
  user_id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  // UPDATED — added Invoice and Quotation to support cross-module reminders
  @Column({
    type: "enum",
    enum: ["VAT", "License", "Payroll", "Invoice", "Quotation", "Document", "Custom"],
    default: "Custom",
  })
  type!: "VAT" | "License" | "Payroll" | "Invoice" | "Quotation" | "Document" | "Custom";

  @Column({ type: "timestamp" })
  reminder_date!: Date;

  // Now accepts up to 30 (previously UI limited to 7 but entity had no cap)
  @Column({
    type: "integer",
    default: 3,
    comment: "Days before reminder_date to send the notification (1–30)",
  })
  notify_before!: number;

  @Column({
    type: "jsonb",
    default: () => `'{"email": true, "whatsapp": false, "push": true}'`,
  })
  notify_channels!: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };

  @Column({ type: "boolean", default: false })
  notified!: boolean;

  @Column({
    type: "enum",
    enum: ["none", "monthly", "quarterly", "yearly"],
    default: "none",
  })
  recurrence_rule!: "none" | "monthly" | "quarterly" | "yearly";

  @Column({
    type: "enum",
    enum: ["pending", "sent", "completed", "missed"],
    default: "pending",
  })
  status!: "pending" | "sent" | "completed" | "missed";

  // ── NEW FIELDS ─────────────────────────────────────────────────────────────

  /**
   * Where this reminder originated.
   * - manual:     User created it themselves
   * - ai:         User typed a prompt; AI filled the form
   * - invoice:    Auto-detected from the invoicing module
   * - quotation:  Auto-detected from the quotation module
   * - document:   Auto-detected from the document generator module
   * - compliance: Auto-detected from the compliance/licensing module
   */
  @Column({
    type: "enum",
    enum: ["manual", "ai", "invoice", "quotation", "document", "compliance"],
    default: "manual",
  })
  source!: "manual" | "ai" | "invoice" | "quotation" | "document" | "compliance";

  /**
   * UUID of the source record this reminder is linked to.
   * For source=invoice → invoice UUID
   * For source=quotation → quotation UUID
   * For source=document → document UUID
   */
  @Column({ type: "uuid", nullable: true, default: null })
  reference_id!: string | null;

  /**
   * Human-readable label for the linked record type.
   * e.g. "Invoice", "Quotation", "Document"
   */
  @Column({ type: "varchar", length: 100, nullable: true, default: null })
  reference_type!: string | null;

  /**
   * Stores the original natural language prompt the user typed
   * when source = "ai". Used to re-generate if needed.
   */
  @Column({ type: "text", nullable: true, default: null })
  ai_prompt!: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
