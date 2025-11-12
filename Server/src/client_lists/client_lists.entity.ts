import {
  Entity,
  Column,
  CreateDateColumn,
  Unique,
  PrimaryColumn,
} from "typeorm";
@Entity("client_lists")
@Unique("unique_user_email", ["user_id", "email"])
@Unique("unique_user_whatsapp", ["user_id", "whatsapp_number"])
@Unique("unique_user_instagram", ["user_id", "instagram_id"])
export class ClientList {
  @Column({ type: "integer", generated: "increment" })
  id: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  whatsapp_number: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  instagram_id: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  @CreateDateColumn({ type: "timestamp", default: () => "NOW()" })
  added_at: Date;
}
