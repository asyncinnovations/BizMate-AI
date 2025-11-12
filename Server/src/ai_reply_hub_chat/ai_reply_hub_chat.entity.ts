import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "ai_reply_hub_chats" })
export class AiReplyHubChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, default: () => "gen_random_uuid()" })
  uuid: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "uuid" })
  client_id: string;

  @Column({
    type: "varchar",
    length: 20,
  })
  platform: "whatsapp" | "email" | "instagram";

  @Column({
    type: "varchar",
    length: 20,
  })
  direction: "inbound" | "outbound";

  @Column({ type: "text" })
  message: string;

  @Column({ type: "text", nullable: true })
  ai_reply: string | null;

  @Column({ type: "boolean", default: true })
  ai_reply_enable: boolean;

  @Column({ type: "varchar", length: 50, nullable: true })
  ai_model: string | null; // e.g., GPT-4, GPT-3.5, local model

  @CreateDateColumn({ type: "timestamp", default: () => "now()" })
  sent_at: Date;

  @Column({ type: "timestamp", nullable: true })
  received_at: Date | null;

  @Column({
    type: "varchar",
    length: 20,
    default: "sent",
  })
  status: "sent" | "delivered" | "read" | "failed";

  @Column({ type: "text", nullable: true })
  error_message: string | null;
}
