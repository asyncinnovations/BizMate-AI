import { Entity, Column, CreateDateColumn, PrimaryColumn } from "typeorm";

@Entity("compliance_history")
export class ComplianceHistory {
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
  document_id: string;

  @Column({ type: "uuid", nullable: true })
  reminder_id: string;

  @Column({ type: "uuid", nullable: true })
  company_id: string;

  @Column({ type: "varchar", length: 100 })
  event_type: string;

  @Column({ type: "text" })
  details: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
