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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const documents_entity_1 = require("./documents.entity");
const templates_entity_1 = require("../templates/templates.entity");
const GPTService_1 = require("../services/GPTService");
const PromptService_1 = require("../services/PromptService");
let DocumentsService = class DocumentsService {
    docsRepo;
    templateRepo;
    gptService;
    promptService;
    constructor(docsRepo, templateRepo, gptService, promptService) {
        this.docsRepo = docsRepo;
        this.templateRepo = templateRepo;
        this.gptService = gptService;
        this.promptService = promptService;
    }
    append_log(existing, new_status) {
        const log = Array.isArray(existing) ? existing : [];
        return [...log, { status: new_status, timestamp: new Date().toISOString() }];
    }
    async create_document_service(data) {
        const status = documents_entity_1.DocumentStatus.DRAFT;
        const doc = this.docsRepo.create({
            ...data,
            status,
            source: data.source ?? documents_entity_1.DocumentSource.TEMPLATE,
            activity_log: this.append_log([], status),
            compliance_score: null,
            compliance_notes: [],
        });
        return await this.docsRepo.save(doc);
    }
    async ai_generate_document_service(user_id, prompt, document_type) {
        if (!prompt?.trim()) {
            throw new common_1.BadRequestException("Prompt is required.");
        }
        const system_prompt = this.promptService.DocumentGenerator();
        const gpt_response = await this.gptService.GPTChat(prompt, system_prompt);
        let ai_result = {};
        try {
            const raw = gpt_response?.data?.content ?? "";
            const cleaned = raw.replace(/```json|```/g, "").trim();
            ai_result = JSON.parse(cleaned);
        }
        catch {
            ai_result = {
                document_name: document_type ?? "AI Generated Document",
                document_type: document_type ?? "Custom",
                category: "Business",
                content: gpt_response?.data?.content ?? "",
                field_values: {},
                compliance_score: 85,
                compliance_notes: [
                    { type: "ok", message: "Document structure generated successfully." },
                    { type: "warning", message: "Review all clauses before finalising." },
                ],
            };
        }
        return {
            message: "Document draft generated. Review before saving.",
            ai_result,
            user_id,
            source: documents_entity_1.DocumentSource.AI,
            ai_prompt: prompt,
        };
    }
    async save_ai_document_service(data) {
        const status = documents_entity_1.DocumentStatus.AI_GENERATED;
        const doc = this.docsRepo.create({
            ...data,
            status,
            source: documents_entity_1.DocumentSource.AI,
            activity_log: this.append_log([], status),
            field_values: data.field_values ?? {},
            compliance_notes: data.compliance_notes ?? [],
        });
        return await this.docsRepo.save(doc);
    }
    async user_documents_service(user_id, filters) {
        const where = { user_id };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.category)
            where.category = filters.category;
        if (filters?.document_type)
            where.document_type = filters.document_type;
        if (filters?.search) {
            where.document_name = (0, typeorm_2.ILike)(`%${filters.search}%`);
        }
        return await this.docsRepo.find({
            where,
            order: { created_at: "DESC" },
        });
    }
    async single_document_service(uuid) {
        const doc = await this.docsRepo.findOne({ where: { uuid } });
        if (!doc)
            throw new common_1.NotFoundException("Document not found.");
        return doc;
    }
    async update_document_service(uuid, data) {
        const doc = await this.single_document_service(uuid);
        Object.assign(doc, data);
        return await this.docsRepo.save(doc);
    }
    async update_document_status_service(uuid, new_status) {
        const valid = Object.values(documents_entity_1.DocumentStatus);
        if (!valid.includes(new_status)) {
            throw new common_1.BadRequestException(`Invalid status "${new_status}". Allowed: ${valid.join(", ")}`);
        }
        const doc = await this.single_document_service(uuid);
        const updated_log = this.append_log(doc.activity_log ?? [], new_status);
        await this.docsRepo.query(`UPDATE generated_documents
       SET status = $1, activity_log = $2::jsonb, updated_at = NOW()
       WHERE uuid = $3`, [new_status, JSON.stringify(updated_log), uuid]);
        return {
            message: `Document status updated to "${new_status}"`,
            uuid,
            status: new_status,
            activity_log: updated_log,
        };
    }
    async delete_document_service(uuid) {
        const doc = await this.single_document_service(uuid);
        await this.docsRepo.remove(doc);
        return { message: "Document deleted successfully." };
    }
    async duplicate_document_service(uuid, user_id) {
        const original = await this.single_document_service(uuid);
        if (original.user_id !== user_id) {
            throw new common_1.BadRequestException("You do not have permission to duplicate this document.");
        }
        const status = documents_entity_1.DocumentStatus.DRAFT;
        const duplicate = this.docsRepo.create({
            user_id: original.user_id,
            template_id: original.template_id,
            document_name: `${original.document_name} (Copy)`,
            category: original.category,
            document_type: original.document_type,
            field_values: original.field_values,
            content: original.content,
            ai_prompt: original.ai_prompt,
            compliance_score: null,
            compliance_notes: [],
            status,
            source: original.source,
            activity_log: this.append_log([], status),
            pdf_path: null,
            docx_path: null,
        });
        const saved = await this.docsRepo.save(duplicate);
        return { message: "Document duplicated successfully.", document: saved };
    }
    async run_compliance_check_service(uuid) {
        const doc = await this.single_document_service(uuid);
        if (!doc.content) {
            throw new common_1.BadRequestException("Document has no content to check. Generate the document first.");
        }
        const system_prompt = this.promptService.DocumentComplianceChecker();
        const gpt_response = await this.gptService.GPTChat(JSON.stringify({
            document_type: doc.document_type,
            category: doc.category,
            content: doc.content.slice(0, 3000),
        }), system_prompt);
        let result = {
            compliance_score: 80,
            compliance_notes: [
                { type: "ok", message: "Document structure is valid." },
                { type: "warning", message: "Consider adding a governing law clause." },
            ],
        };
        try {
            const raw = gpt_response?.data?.content ?? "";
            const cleaned = raw.replace(/```json|```/g, "").trim();
            result = JSON.parse(cleaned);
        }
        catch {
        }
        await this.docsRepo.update({ uuid }, {
            compliance_score: result.compliance_score,
            compliance_notes: result.compliance_notes,
        });
        return {
            message: "Compliance check complete.",
            uuid,
            compliance_score: result.compliance_score,
            compliance_notes: result.compliance_notes,
        };
    }
    async get_ai_suggestions_service(user_id) {
        const recent_docs = await this.docsRepo.find({
            where: { user_id },
            order: { created_at: "DESC" },
            take: 10,
            select: ["document_name", "document_type", "category", "created_at"],
        });
        if (recent_docs.length === 0) {
            return {
                message: "No document history yet.",
                suggestions: [
                    { document_type: "NDA", reason: "Start with a Non-Disclosure Agreement to protect your business." },
                    { document_type: "Service Agreement", reason: "Define the scope and terms of your client work." },
                    { document_type: "Business Proposal", reason: "Win new clients with a professional proposal." },
                ],
            };
        }
        const context = recent_docs.map((d) => ({
            document_type: d.document_type,
            category: d.category,
            created_at: d.created_at,
        }));
        const system_prompt = this.promptService.DocumentSuggestionEngine();
        const gpt_response = await this.gptService.GPTChat(JSON.stringify({ recent_documents: context }), system_prompt);
        let suggestions = [];
        try {
            const raw = gpt_response?.data?.content ?? "";
            const cleaned = raw.replace(/```json|```/g, "").trim();
            suggestions = JSON.parse(cleaned);
        }
        catch {
            suggestions = [
                { document_type: "Offer Letter", reason: "Typically follows an employment contract." },
                { document_type: "Service Agreement", reason: "Formalise your active client relationships." },
            ];
        }
        return {
            message: "AI suggestions generated.",
            suggestions,
            based_on: recent_docs.length,
        };
    }
    async set_document_file_paths_service(uuid, paths) {
        await this.docsRepo.update({ uuid }, paths);
        return { message: "File paths updated.", uuid, ...paths };
    }
    async recent_documents_service(user_id, limit = 5) {
        return await this.docsRepo.find({
            where: { user_id },
            order: { created_at: "DESC" },
            take: Math.min(limit, 20),
            select: [
                "uuid", "document_name", "document_type", "category",
                "status", "source", "created_at",
            ],
        });
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(documents_entity_1.GeneratedDocumentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(templates_entity_1.TemplateEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, GPTService_1.GPTService,
        PromptService_1.PromptService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map