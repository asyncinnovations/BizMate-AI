"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeePayroll = exports.ContractType = void 0;
const typeorm_1 = require("typeorm");
var ContractType;
(function (ContractType) {
    ContractType["FULL_TIME"] = "Full_Time";
    ContractType["PART_TIME"] = "Part_Time";
    ContractType["CONTRACT"] = "Contract";
    ContractType["INTERNSHIP"] = "Internship";
})(ContractType || (exports.ContractType = ContractType = {}));
let EmployeePayroll = class EmployeePayroll {
    id;
    uuid;
    fullName;
    emailAddress;
    phoneNumber;
    emiratesId;
    designation;
    user_id;
    department;
    joiningDate;
    contractType;
    basicSalary;
    housingAllowance;
    transportAllowance;
    otherAllowance;
    bankName;
    iban;
    createdAt;
    updatedAt;
};
exports.EmployeePayroll = EmployeePayroll;
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], EmployeePayroll.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "full_name", type: "varchar", length: 255 }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "email_address", type: "varchar", length: 255, unique: true }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "emailAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "phone_number", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "emirates_id",
        type: "varchar",
        length: 21,
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "emiratesId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "joining_date", type: "date" }),
    __metadata("design:type", Date)
], EmployeePayroll.prototype, "joiningDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "contract_type",
        type: "enum",
        enum: ContractType,
        default: ContractType.FULL_TIME,
    }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "contractType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "basic_salary",
        type: "decimal",
        precision: 15,
        scale: 2,
        default: 0.0,
    }),
    __metadata("design:type", Number)
], EmployeePayroll.prototype, "basicSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "housing_allowance",
        type: "decimal",
        precision: 15,
        scale: 2,
        default: 0.0,
    }),
    __metadata("design:type", Number)
], EmployeePayroll.prototype, "housingAllowance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "transport_allowance",
        type: "decimal",
        precision: 15,
        scale: 2,
        default: 0.0,
    }),
    __metadata("design:type", Number)
], EmployeePayroll.prototype, "transportAllowance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "other_allowance",
        type: "decimal",
        precision: 15,
        scale: 2,
        default: 0.0,
    }),
    __metadata("design:type", Number)
], EmployeePayroll.prototype, "otherAllowance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "bank_name", type: "varchar", length: 150, nullable: true }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 23, unique: true, nullable: true }),
    __metadata("design:type", String)
], EmployeePayroll.prototype, "iban", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], EmployeePayroll.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], EmployeePayroll.prototype, "updatedAt", void 0);
exports.EmployeePayroll = EmployeePayroll = __decorate([
    (0, typeorm_1.Entity)("employee_payroll")
], EmployeePayroll);
//# sourceMappingURL=employee_payroll.entity.js.map