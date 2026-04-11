import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("compliance_assistant_chat")
export class ComplianceAssistantChat {
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
  company!: string;

  @Column({ type: "uuid", nullable: true })
  reminder_id!: string;

  @Column({ type: "text" })
  question!: string; // User's question

  @Column({ type: "text" })
  answer!: string; // AI response

  @CreateDateColumn({ type: "timestamp" })
  timestamp!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
