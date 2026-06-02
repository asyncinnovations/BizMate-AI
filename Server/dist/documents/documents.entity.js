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
exports.GeneratedDocumentEntity = exports.DocumentSource = exports.DocumentStatus = void 0;
const typeorm_1 = require("typeorm");
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["DRAFT"] = "draft";
    DocumentStatus["AI_GENERATED"] = "ai_generated";
    DocumentStatus["UNDER_REVIEW"] = "under_review";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["FINALISED"] = "finalised";
    DocumentStatus["ARCHIVED"] = "archived";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var DocumentSource;
(function (DocumentSource) {
    DocumentSource["TEMPLATE"] = "template";
    DocumentSource["AI"] = "ai";
    DocumentSource["CUSTOM"] = "custom";
})(DocumentSource || (exports.DocumentSource = DocumentSource = {}));
let GeneratedDocumentEntity = class GeneratedDocumentEntity {
    uuid;
    id;
    user_id;
    template_id;
    document_name;
    category;
    document_type;
    field_values;
    content;
    ai_prompt;
    compliance_score;
    compliance_notes;
    status;
    source;
    activity_log;
    pdf_path;
    docx_path;
    created_at;
    updated_at;
};
exports.GeneratedDocumentEntity = GeneratedDocumentEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], GeneratedDocumentEntity.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], GeneratedDocumentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: false }),
    __metadata("design:type", String)
], GeneratedDocumentEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true, default: null }),
    __metadata("design:type", Object)
], GeneratedDocumentEntity.prototype, "template_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], GeneratedDocumentEntity.prototype, "document_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true, default: null }),
    __metadata("design:type", String)
], GeneratedDocumentEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true, default: null }),
    __metadata("design:type", String)
], GeneratedDocumentEntity.prototype, "document_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'{}'" }),
    __metadata("design:type", Object)
], GeneratedDocumentEntity.prototype, "field_values", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", String)
], GeneratedDocumentEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", String)
], GeneratedDocumentEntity.prototype, "ai_prompt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", nullable: true, default: null }),
    __metadata("design:type", Object)
], GeneratedDocumentEntity.prototype, "compliance_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], GeneratedDocumentEntity.prototype, "compliance_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        default: DocumentStatus.DRAFT,
    }),
    __metadata("design:type", String)
], GeneratedDocumentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        default: DocumentSource.TEMPLATE,
    }),
    __metadata("design:type", String)
], GeneratedDocumentEntity.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], GeneratedDocumentEntity.prototype, "activity_log", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true, default: null }),
    __metadata("design:type", Object)
], GeneratedDocumentEntity.prototype, "pdf_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true, default: null }),
    __metadata("design:type", Object)
], GeneratedDocumentEntity.prototype, "docx_path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], GeneratedDocumentEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], GeneratedDocumentEntity.prototype, "updated_at", void 0);
exports.GeneratedDocumentEntity = GeneratedDocumentEntity = __decorate([
    (0, typeorm_1.Entity)("generated_documents")
], GeneratedDocumentEntity);
//# sourceMappingURL=documents.entity.js.map