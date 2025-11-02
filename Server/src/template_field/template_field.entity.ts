import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Generated,
  PrimaryColumn,
} from "typeorm";

@Entity("template_fields")
export class TemplateFieldEntity {
  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "integer", generated: "increment" })
  id: number;

  @Column({ type: "uuid", nullable: false })
  template_id: string;

  //   @ManyToOne(() => TemplateEntity, (template) => template.fields, {
  //     onDelete: "CASCADE",
  //     onUpdate: "CASCADE",
  //   })

  @Column({ type: "varchar", length: 100, nullable: false })
  field_name: string;

  @Column({ type: "text", nullable: true })
  field_value: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  field_type: string;

  @Column({ type: "boolean", default: false })
  required: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
