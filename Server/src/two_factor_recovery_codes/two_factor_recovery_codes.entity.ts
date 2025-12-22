import { Entity, Column, CreateDateColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "two_factor_recovery_codes" })
export class TwoFactorRecoveryCode {
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

  @Column({ type: "varchar", length: 100 })
  code: string; //  hashed recovery code

  @Column({ type: "boolean", default: false })
  is_used: boolean;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "NOW()",
  })
  created_at: Date;
}
