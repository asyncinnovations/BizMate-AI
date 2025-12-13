"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceAssistantModule = void 0;
const common_1 = require("@nestjs/common");
const compliance_assistant_chat_service_1 = require("./compliance_assistant_chat.service");
const compliance_assistant_chat_controller_1 = require("./compliance_assistant_chat.controller");
const typeorm_1 = require("@nestjs/typeorm");
const compliance_assistant_chat_entity_1 = require("./compliance_assistant_chat.entity");
let ComplianceAssistantModule = class ComplianceAssistantModule {
};
exports.ComplianceAssistantModule = ComplianceAssistantModule;
exports.ComplianceAssistantModule = ComplianceAssistantModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([compliance_assistant_chat_entity_1.ComplianceAssistantChat])],
        providers: [compliance_assistant_chat_service_1.ComplianceAssistantChatService],
        controllers: [compliance_assistant_chat_controller_1.ComplianceAssistantController],
    })
], ComplianceAssistantModule);
//# sourceMappingURL=compliance_chat.module.js.map