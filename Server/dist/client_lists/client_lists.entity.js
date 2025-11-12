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
exports.ClientList = void 0;
const typeorm_1 = require("typeorm");
let ClientList = class ClientList {
    id;
    uuid;
    user_id;
    name;
    email;
    whatsapp_number;
    instagram_id;
    notes;
    added_at;
};
exports.ClientList = ClientList;
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], ClientList.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], ClientList.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], ClientList.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], ClientList.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], ClientList.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], ClientList.prototype, "whatsapp_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], ClientList.prototype, "instagram_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], ClientList.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "NOW()" }),
    __metadata("design:type", Date)
], ClientList.prototype, "added_at", void 0);
exports.ClientList = ClientList = __decorate([
    (0, typeorm_1.Entity)("client_lists"),
    (0, typeorm_1.Unique)("unique_user_email", ["user_id", "email"]),
    (0, typeorm_1.Unique)("unique_user_whatsapp", ["user_id", "whatsapp_number"]),
    (0, typeorm_1.Unique)("unique_user_instagram", ["user_id", "instagram_id"])
], ClientList);
//# sourceMappingURL=client_lists.entity.js.map