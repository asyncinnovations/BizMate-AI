import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("user_integrations")
export class UserIntegration {
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

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  platform: "email" | "whatsapp" | "instagram";

  @Column({ type: "text", nullable: true })
  access_token: string;

  @Column({ type: "text", nullable: true })
  refresh_token: string;

  @Column({ type: "timestamp", nullable: true })
  expires_at: Date;

  @Column({ type: "timestamp", nullable: true })
  last_sync_at: Date;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
    default: "disconnected",
  })
  status: "connected" | "disconnected";

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: "timestamp", default: () => "NOW()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "NOW()" })
  updated_at: Date;
}
