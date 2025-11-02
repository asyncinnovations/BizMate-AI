import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
export enum UserRole {
  ADMIN = "admin",
  BUSINESS_OWNER = "business_owner",
  TEAM_MEMBER = "team_member",
}

@Entity("users")
export class AuthUsers {
  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid: string;

  @Column({ type: "integer", generated: "increment" })
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  full_name: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password_hash: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  lichence_file: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  profile_image: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  company_name: string;
  @Column({ type: "varchar", length: 255, nullable: true })
  license_number: string;
  @Column({ type: "varchar", length: 255, nullable: true })
  vat_id: string;
  @Column({ type: "varchar", length: 255, nullable: true })
  industry: string;

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

  @Column({
    type: "enum",
    enum: ["active", "inactive", "suspended"],
    default: "active",
  })
  status: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
