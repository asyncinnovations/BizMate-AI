// src/user_business_info/user_business_info.entity.ts
// UPDATED — added business_location and compliance_framework columns.
// These are collected at signup and editable in the Compliance & Legal tab.

import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("user_business_info")
export class UserBusinessInfo {

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "integer", generated: "increment" })
  id: number;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "varchar", length: 150 })
  business_name: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  owner_name: string;

  @Column({ type: "varchar", length: 100 })
  industry: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  business_type: string;

  @Column({ type: "text" })
  services_offered: string;

  @Column({
    type: "jsonb",
    default: () => `'["Email","WhatsApp","Instagram"]'`,
  })
  communication_channels: any;

  @Column({ type: "text", nullable: true })
  availability: string;

  @Column({ type: "jsonb", nullable: true })
  faq: any;

  @Column({ type: "jsonb", nullable: true })
  tone_examples: any;

  @Column({ type: "jsonb", nullable: true })
  snapshot: any;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  // ── NEW COLUMNS ─────────────────────────────────────────────────────────────

  /**
   * Business location — collected during signup (Step 3 for Startup/SME).
   * Values: "free_zone" | "mainland" | "offshore"
   * Maps to the business_location field in the register form.
   */
  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
    default: null,
    comment: "free_zone | mainland | offshore — collected at signup",
  })
  business_location: string | null;

  /**
   * Compliance framework — selected in the Compliance & Legal tab in Settings.
   * Determines which compliance rules, VAT rates, and reminders apply.
   * Values: "mainland" | "free_zone" | "offshore"
   * For GCC countries: "mainland" is always used.
   */
  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
    default: null,
    comment: "mainland | free_zone | offshore — set in Compliance tab",
  })
  compliance_framework: string | null;

  /**
   * Business region — the GCC country where the business operates.
   * Values: "uae" | "saudi" | "qatar" | "kuwait" | "bahrain" | "oman"
   */
  @Column({
    type: "varchar",
    length: 20,
    nullable: true,
    default: "uae",
    comment: "GCC country: uae | saudi | qatar | kuwait | bahrain | oman",
  })
  business_region: string | null;

  // Additional fields added in this update for invoice/quotation accuracy
  @Column({ type: "varchar", length: 100, nullable: true, default: null })
  trade_license_number: string | null;

  @Column({ type: "varchar", length: 50, nullable: true, default: null })
  trn: string | null;

  @Column({ type: "text", nullable: true, default: null })
  address: string | null;

  @Column({ type: "varchar", length: 10, nullable: true, default: "AED" })
  currency: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "NOW()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "NOW()" })
  updated_at: Date;
}
