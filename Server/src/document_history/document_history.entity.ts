import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("document_history")
@Index(["user_id"])
@Index(["uploaded_at"])
export class DocumentHistory {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ type: "uuid" })
  user_id!: string;

  @Column({ type: "varchar", length: 255 })
  file_name!: string; // original file name

  @Column({ type: "varchar", length: 50 })
  file_type!: string; // pdf, docx, jpg, png

  @Column({ type: "bigint" })
  file_size!: number; // size in bytes

  @Column({ type: "text", nullable: true })
  raw_text!: string; // extracted text from file

  @Column({ type: "jsonb", nullable: true })
  parsed_data?: {
    license_no?: string;
    expiry_date?: string;
    company_name?: string;
    [key: string]: any; // for future fields
  };

  @Column({
    type: "enum",
    enum: ["pending", "processed", "failed"],
    default: "pending",
  })
  status!: "pending" | "processed" | "failed";

  @Column({ type: "varchar", length: 255, nullable: true })
  storage_path?: string; // if storing file in S3 or local

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  uploaded_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
