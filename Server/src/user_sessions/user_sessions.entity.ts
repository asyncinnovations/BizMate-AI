import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("user_sessions")
export class UserSession {
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

  @Column({ type: "varchar", length: 255, nullable: true })
  device_name: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  ip_address: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  location: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  browser: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  os: string;

  @Column({ type: "timestamp", default: () => "NOW()" })
  last_active: Date;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    default: () => "NOW()",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
    default: () => "NOW()",
  })
  updated_at: Date;
}
