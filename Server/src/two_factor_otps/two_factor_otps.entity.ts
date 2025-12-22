import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "two_factor_otps" })
export class TwoFactorOTP {
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

  @Column({ type: "varchar", length: 10 })
  otp_code: string;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @Column({ type: "boolean", default: false })
  is_used: boolean;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "NOW()",
  })
  created_at: Date;
}
