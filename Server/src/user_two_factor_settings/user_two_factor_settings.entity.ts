import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "user_two_factor_settings" })
export class UserTwoFactorSettings {
  @Column({ generated: "increment", type: "integer" })
  id: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "uuid", nullable: false })
  user_id: string;

  @Column({ type: "boolean", default: false })
  is_enabled: boolean;

  @Column({ type: "varchar", length: 30 })
  method: "totp" | "sms" | "email";

  @Column({ type: "varchar", length: 255, nullable: true })
  secret: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string | null;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "NOW()",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp with time zone",
    default: () => "NOW()",
    onUpdate: "NOW()",
  })
  updated_at: Date;
}
