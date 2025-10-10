import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
export enum UserRole {
  ADMIN = "admin",
  BUSINESS_OWNER = "business_owner",
  TEAM_MEMBER = "team_member",
}

@Entity("users")
export class AuthUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", default: () => "gen_random_uuid()", unique: true })
  uuid: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  full_name: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password_hash: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.TEAM_MEMBER,
  })
  role: UserRole;

  @Column({
    type: "enum",
    enum: ["en", "ar", "hi"],
    default: "en",
  })
  language_preference: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
