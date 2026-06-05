"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const quotations_service_1 = require("./quotations.service");
const quotations_controller_1 = require("./quotations.controller");
const quotations_entity_1 = require("./quotations.entity");
const invoices_module_1 = require("../invoices/invoices.module");
const GPTService_1 = require("../services/GPTService");
const PromptService_1 = require("../services/PromptService");
const EmailService_1 = require("../services/EmailService");
const PdfService_1 = require("../services/PdfService");
const chatgpt_service_1 = require("../chatgpt/chatgpt.service");
let QuotationsModule = class QuotationsModule {
};
exports.QuotationsModule = QuotationsModule;
exports.QuotationsModule = QuotationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([quotations_entity_1.QuotationEntity]),
            invoices_module_1.InvoicesModule,
        ],
        providers: [
            quotations_service_1.QuotationsService,
            GPTService_1.GPTService,
            PromptService_1.PromptService,
            EmailService_1.EmailService,
            PdfService_1.PdfService,
            chatgpt_service_1.ChatgptService,
        ],
        controllers: [quotations_controller_1.QuotationsController],
        exports: [quotations_service_1.QuotationsService],
    })
], QuotationsModule);
//# sourceMappingURL=quotations.module.js.map