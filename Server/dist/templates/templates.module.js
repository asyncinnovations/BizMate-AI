"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const templates_service_1 = require("./templates.service");
const templates_controller_1 = require("./templates.controller");
const templates_entity_1 = require("./templates.entity");
const PdfService_1 = require("../services/PdfService");
const EmailService_1 = require("../services/EmailService");
const GPTService_1 = require("../services/GPTService");
const PromptService_1 = require("../services/PromptService");
const chatgpt_service_1 = require("../chatgpt/chatgpt.service");
let TemplatesModule = class TemplatesModule {
};
exports.TemplatesModule = TemplatesModule;
exports.TemplatesModule = TemplatesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([templates_entity_1.TemplateEntity])],
        providers: [
            templates_service_1.TemplatesService,
            PdfService_1.PdfService,
            EmailService_1.EmailService,
            GPTService_1.GPTService,
            PromptService_1.PromptService,
            chatgpt_service_1.ChatgptService,
        ],
        controllers: [templates_controller_1.TemplatesController],
        exports: [templates_service_1.TemplatesService],
    })
], TemplatesModule);
//# sourceMappingURL=templates.module.js.map