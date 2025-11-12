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
exports.AiReplyHubChat = void 0;
const typeorm_1 = require("typeorm");
let AiReplyHubChat = class AiReplyHubChat {
    id;
    uuid;
    user_id;
    client_id;
    platform;
    direction;
    message;
    ai_reply;
    ai_reply_enable;
    ai_model;
    sent_at;
    received_at;
    status;
    error_message;
};
exports.AiReplyHubChat = AiReplyHubChat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AiReplyHubChat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", unique: true, default: () => "gen_random_uuid()" }),
    __metadata("design:type", String)
], AiReplyHubChat.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AiReplyHubChat.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AiReplyHubChat.prototype, "client_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 20,
    }),
    __metadata("design:type", String)
], AiReplyHubChat.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 20,
    }),
    __metadata("design:type", String)
], AiReplyHubChat.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], AiReplyHubChat.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], AiReplyHubChat.prototype, "ai_reply", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], AiReplyHubChat.prototype, "ai_reply_enable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", Object)
], AiReplyHubChat.prototype, "ai_model", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "now()" }),
    __metadata("design:type", Date)
], AiReplyHubChat.prototype, "sent_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Object)
], AiReplyHubChat.prototype, "received_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 20,
        default: "sent",
    }),
    __metadata("design:type", String)
], AiReplyHubChat.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], AiReplyHubChat.prototype, "error_message", void 0);
exports.AiReplyHubChat = AiReplyHubChat = __decorate([
    (0, typeorm_1.Entity)({ name: "ai_reply_hub_chats" })
], AiReplyHubChat);
//# sourceMappingURL=ai_reply_hub_chat.entity.js.map