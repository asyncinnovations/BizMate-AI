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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_history_entity_1 = require("./document_history.entity");
let DocumentHistoryService = class DocumentHistoryService {
    documentRepo;
    constructor(documentRepo) {
        this.documentRepo = documentRepo;
    }
    async create_document_service(data) {
        const doc = this.documentRepo.create({
            ...data,
            status: "pending",
        });
        return this.documentRepo.save(doc);
    }
    async get_document_by_uuid_service(uuid) {
        return this.documentRepo.findOne({ where: { uuid } });
    }
    async get_documents_by_user_service(user_id) {
        return this.documentRepo.find({
            where: { user_id },
            order: { uploaded_at: "DESC" },
        });
    }
    async search_documents_service(user_id, keyword) {
        const options = {
            where: [
                { user_id, file_name: (0, typeorm_2.Like)(`%${keyword}%`) },
                { user_id, raw_text: (0, typeorm_2.Like)(`%${keyword}%`) },
            ],
            order: { uploaded_at: "DESC" },
        };
        return this.documentRepo.find(options);
    }
    async update_status_service(uuid, status) {
        await this.documentRepo.update({ uuid }, { status });
    }
    async update_parsed_data_service(uuid, parsedData) {
        await this.documentRepo.update({ uuid }, { parsed_data: parsedData });
    }
    async delete_document_service(uuid) {
        await this.documentRepo.delete({ uuid });
    }
    async get_pending_documents_service() {
        return this.documentRepo.find({
            where: { status: "pending" },
            order: { uploaded_at: "ASC" },
        });
    }
    async get_documents_expiring_within_service(days) {
        const now = new Date();
        const target = new Date();
        target.setDate(now.getDate() + days);
        return this.documentRepo
            .createQueryBuilder("doc")
            .where(`doc.parsed_data->>'expiry_date' IS NOT NULL`)
            .andWhere(`doc.parsed_data->>'expiry_date'::date BETWEEN :now AND :target`, { now, target })
            .orderBy("doc.parsed_data->>'expiry_date'")
            .getMany();
    }
};
exports.DocumentHistoryService = DocumentHistoryService;
exports.DocumentHistoryService = DocumentHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_history_entity_1.DocumentHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentHistoryService);
//# sourceMappingURL=document_history.service.js.map