"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const documents_service_1 = require("./documents.service");
const documents_controller_1 = require("./documents.controller");
const documents_entity_1 = require("./documents.entity");
const templates_entity_1 = require("../templates/templates.entity");
const GPTService_1 = require("../services/GPTService");
const PromptService_1 = require("../services/PromptService");
const PdfService_1 = require("../services/PdfService");
const chatgpt_service_1 = require("../chatgpt/chatgpt.service");
let DocumentsModule = class DocumentsModule {
};
exports.DocumentsModule = DocumentsModule;
exports.DocumentsModule = DocumentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([documents_entity_1.GeneratedDocumentEntity, templates_entity_1.TemplateEntity]),
        ],
        providers: [
            documents_service_1.DocumentsService,
            GPTService_1.GPTService,
            PromptService_1.PromptService,
            PdfService_1.PdfService,
            chatgpt_service_1.ChatgptService,
        ],
        controllers: [documents_controller_1.DocumentsController],
        exports: [documents_service_1.DocumentsService],
    })
], DocumentsModule);
//# sourceMappingURL=documents.module.js.map