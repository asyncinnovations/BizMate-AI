"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceDocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const compliance_documents_entity_1 = require("./compliance_documents.entity");
const PdfService_1 = require("../services/PdfService");
const OpenAIService_1 = require("../services/OpenAIService");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
let ComplianceDocumentsService = class ComplianceDocumentsService {
    documentRepository;
    pdf_service;
    Openai_service;
    constructor(documentRepository, pdf_service, Openai_service) {
        this.documentRepository = documentRepository;
        this.pdf_service = pdf_service;
        this.Openai_service = Openai_service;
    }
    async upload_document_service(data) {
        const doc = this.documentRepository.create({
            user_id: data.user_id,
            reminder_id: data.reminder_id,
            document_type: data.document_type,
            filename: data.filename,
            file_url: data.file_url,
        });
        const result = await this.documentRepository.save(doc);
        return result;
    }
    async get_user_document_service(userId, reminderId) {
        const response = await this.documentRepository.find({
            where: { user_id: userId, reminder_id: reminderId },
        });
        return response;
    }
    async get_single_document_service(documentId) {
        const doc = await this.documentRepository.findOne({
            where: { uuid: documentId },
        });
        if (!doc) {
            throw new common_1.HttpException("Document not found", 404);
        }
        return doc;
    }
    async update_document_service(documentId, updates) {
        const doc = await this.get_single_document_service(documentId);
        Object.assign(doc, updates);
        const result = await this.documentRepository.save(doc);
        return result;
    }
    async verify_document_service(documentId) {
        return await this.update_document_service(documentId, {
            status: compliance_documents_entity_1.DocumentStatus.VERIFIED,
        });
    }
    async reject_document_service(documentId) {
        return await this.update_document_service(documentId, {
            status: compliance_documents_entity_1.DocumentStatus.REJECTED,
        });
    }
    async attach_ai_summary_service(documentId) {
        const find_document = await this.documentRepository.findOne({
            where: { uuid: documentId },
        });
        if (!find_document) {
            return { message: "document not found" };
        }
        const { filename } = find_document;
        const filePath = `${process.cwd()}/public/uploads/${filename}`;
        const text_response = await this.pdf_service.PDFToTextConverter(filePath);
        const response = await this.Openai_service.summarize_document(text_response);
        const result = await this.update_document_service(documentId, {
            ai_summary: response,
        });
        return result;
    }
    async delete_document_service(documentId) {
        const docs = await this.documentRepository.findOne({
            where: { uuid: documentId },
        });
        if (!docs)
            throw new common_1.NotFoundException("docs not found");
        if (docs.filename) {
            const filePath = path_1.default.join(__dirname, "../../public/uploads", docs.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        const doc = await this.get_single_document_service(documentId);
        const result = await this.documentRepository.remove(doc);
        return result;
    }
};
exports.ComplianceDocumentsService = ComplianceDocumentsService;
exports.ComplianceDocumentsService = ComplianceDocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(compliance_documents_entity_1.ComplianceDocument)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, PdfService_1.PdfService,
        OpenAIService_1.OpenAIService])
], ComplianceDocumentsService);
//# sourceMappingURL=compliance_documents.service.js.map