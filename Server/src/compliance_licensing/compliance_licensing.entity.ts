import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
export enum LicenseStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  SUSPENDED = "suspended",
}

@Entity("compliance_licenses")
export class ComplianceLicense {
  @Column({ type: "integer", generated: "increment" })
  id!: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid!: string;

  @Column({ type: "uuid" })
  user_id!: string;

  @Column({ type: "uuid", nullable: true })
  company_id!: string;

  @Column({ type: "varchar", length: 100 })
  license_type!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  license_number!: string;

  @Column({ type: "date", nullable: true })
  issue_date!: string;

  @Column({ type: "date", nullable: true })
  expiry_date!: string;

  @Column({
    type: "enum",
    enum: LicenseStatus,
    default: LicenseStatus.ACTIVE,
  })
  status!: LicenseStatus;

  @Column({ type: "uuid", nullable: true })
  document_id!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
