import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

export enum ContractType {
  FULL_TIME = "Full_Time",
  PART_TIME = "Part_Time",
  CONTRACT = "Contract",
  INTERNSHIP = "Internship",
}

@Entity("employee_payroll")
export class EmployeePayroll {
  @Column({ type: "integer", generated: "increment" })
  id!: number;

  @PrimaryColumn({
    type: "uuid",
    default: () => "gen_random_uuid()",
    unique: true,
  })
  uuid!: string;

  // Personal Information
  @Column({ name: "full_name", type: "varchar", length: 255 })
  fullName!: string;

  @Column({ name: "email_address", type: "varchar", length: 255, unique: true })
  emailAddress!: string;

  @Column({ name: "phone_number", type: "varchar", length: 20, nullable: true })
  phoneNumber!: string;

  @Column({
    name: "emirates_id",
    type: "varchar",
    length: 21,
    unique: true,
    nullable: true,
  })
  emiratesId!: string;

  // Employment Details
  @Column({ type: "varchar", length: 100 })
  designation!: string;
  @Column({ type: "uuid" })
  user_id!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  department!: string;

  @Column({ name: "joining_date", type: "date" })
  joiningDate!: Date;

  @Column({
    name: "contract_type",
    type: "enum",
    enum: ContractType,
    default: ContractType.FULL_TIME,
  })
  contractType!: ContractType;

  // Salary Breakdown (Financial Precision)
  @Column({
    name: "basic_salary",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  basicSalary!: number;

  @Column({
    name: "housing_allowance",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  housingAllowance!: number;

  @Column({
    name: "transport_allowance",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  transportAllowance!: number;

  @Column({
    name: "other_allowance",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  otherAllowance!: number;

  // Banking Details (WPS)
  @Column({ name: "bank_name", type: "varchar", length: 150, nullable: true })
  bankName!: string;

  @Column({ type: "varchar", length: 23, unique: true, nullable: true })
  iban!: string;

  // Metadata
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
