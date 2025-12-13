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
exports.ComplianceAssistantChat = void 0;
const typeorm_1 = require("typeorm");
let ComplianceAssistantChat = class ComplianceAssistantChat {
    id;
    uuid;
    user_id;
    company;
    reminder_id;
    question;
    answer;
    timestamp;
    updatedAt;
};
exports.ComplianceAssistantChat = ComplianceAssistantChat;
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], ComplianceAssistantChat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], ComplianceAssistantChat.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], ComplianceAssistantChat.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], ComplianceAssistantChat.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], ComplianceAssistantChat.prototype, "reminder_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], ComplianceAssistantChat.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], ComplianceAssistantChat.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ComplianceAssistantChat.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ComplianceAssistantChat.prototype, "updatedAt", void 0);
exports.ComplianceAssistantChat = ComplianceAssistantChat = __decorate([
    (0, typeorm_1.Entity)("compliance_assistant_chat")
], ComplianceAssistantChat);
//# sourceMappingURL=compliance_chat.entity.js.map