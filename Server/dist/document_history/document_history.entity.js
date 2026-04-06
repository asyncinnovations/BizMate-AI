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
exports.DocumentHistory = void 0;
const typeorm_1 = require("typeorm");
let DocumentHistory = class DocumentHistory {
    uuid;
    user_id;
    file_name;
    file_type;
    file_size;
    raw_text;
    parsed_data;
    status;
    storage_path;
    uploaded_at;
    updated_at;
};
exports.DocumentHistory = DocumentHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], DocumentHistory.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], DocumentHistory.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], DocumentHistory.prototype, "file_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], DocumentHistory.prototype, "file_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint" }),
    __metadata("design:type", Number)
], DocumentHistory.prototype, "file_size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], DocumentHistory.prototype, "raw_text", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], DocumentHistory.prototype, "parsed_data", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["pending", "processed", "failed"],
        default: "pending",
    }),
    __metadata("design:type", String)
], DocumentHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], DocumentHistory.prototype, "storage_path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], DocumentHistory.prototype, "uploaded_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], DocumentHistory.prototype, "updated_at", void 0);
exports.DocumentHistory = DocumentHistory = __decorate([
    (0, typeorm_1.Entity)("document_history"),
    (0, typeorm_1.Index)(["user_id"]),
    (0, typeorm_1.Index)(["uploaded_at"])
], DocumentHistory);
//# sourceMappingURL=document_history.entity.js.map