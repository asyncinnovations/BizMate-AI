"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceDocumentsModule = void 0;
const common_1 = require("@nestjs/common");
const compliance_documents_service_1 = require("./compliance_documents.service");
const compliance_documents_controller_1 = require("./compliance_documents.controller");
const typeorm_1 = require("@nestjs/typeorm");
const compliance_documents_entity_1 = require("./compliance_documents.entity");
const PdfService_1 = require("../services/PdfService");
const OpenAIService_1 = require("../services/OpenAIService");
const document_history_service_1 = require("../document_history/document_history.service");
const DocumentConverter_1 = require("../services/DocumentConverter");
const document_history_entity_1 = require("../document_history/document_history.entity");
let ComplianceDocumentsModule = class ComplianceDocumentsModule {
};
exports.ComplianceDocumentsModule = ComplianceDocumentsModule;
exports.ComplianceDocumentsModule = ComplianceDocumentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([compliance_documents_entity_1.ComplianceDocument, document_history_entity_1.DocumentHistory])],
        providers: [
            compliance_documents_service_1.ComplianceDocumentsService,
            PdfService_1.PdfService,
            OpenAIService_1.OpenAIService,
            document_history_service_1.DocumentHistoryService,
            DocumentConverter_1.DocumentConverter,
        ],
        controllers: [compliance_documents_controller_1.ComplianceDocumentsController],
    })
], ComplianceDocumentsModule);
//# sourceMappingURL=compliance_documents.module.js.map