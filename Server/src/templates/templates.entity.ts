import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("templates")
export class TemplateEntity {
  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "integer", generated: "increment" })
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  template_name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "jsonb", nullable: false })
  fields_schema: object;

  @Column({ type: "uuid", nullable: true })
  user_id: string;

  @Column({ type: "boolean", default: false })
  is_prebuilt: boolean;

  @Column({ type: "int", default: 1 })
  version: number;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
