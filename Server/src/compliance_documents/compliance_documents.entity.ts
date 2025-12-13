import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

export enum DocumentStatus {
  UPLOADED = "uploaded",
  VERIFIED = "verified",
  REJECTED = "rejected",
  PENDING = "pending",
}

@Entity("compliance_documents")
export class ComplianceDocument {
  @Column({ type: "integer", generated: "increment" })
  id: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "uuid", nullable: true })
  reminder_id: string;

  @Column({ type: "varchar", length: 100 })
  document_type: string; // e.g., VAT, ESR, Trade License

  @Column({ type: "varchar", length: 255 })
  filename: string;

  @Column({ type: "text", nullable: true })
  file_url: string; // path or S3 URL

  @Column({
    type: "enum",
    enum: DocumentStatus,
    default: DocumentStatus.UPLOADED,
  })
  status: DocumentStatus;

  @Column({ type: "text", nullable: true })
  ai_summary?: string;

  @CreateDateColumn({ type: "timestamp" })
  uploadedAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
