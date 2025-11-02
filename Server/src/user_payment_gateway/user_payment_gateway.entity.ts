import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  PrimaryColumn,
} from "typeorm";

@Entity("user_payment_gateways")
@Unique(["user_id", "gateway_name"])
export class UserPaymentGatewayEntity {
  @Column({ generated: "increment", type: "integer" })
  id: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ nullable: false, type: "uuid" })
  user_id: string;

  @Column({ nullable: false })
  gateway_name: string;

  @Column({ type: "jsonb", nullable: false })
  credentials: Record<string, any>;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
