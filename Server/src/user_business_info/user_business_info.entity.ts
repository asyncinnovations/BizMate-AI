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

  @CreateDateColumn({ type: "timestamp", default: () => "NOW()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "NOW()" })
  updated_at: Date;
}
