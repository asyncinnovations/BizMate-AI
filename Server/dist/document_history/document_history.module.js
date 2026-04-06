"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const document_history_service_1 = require("./document_history.service");
const document_history_controller_1 = require("./document_history.controller");
const typeorm_1 = require("@nestjs/typeorm");
const document_history_entity_1 = require("./document_history.entity");
let DocumentHistoryModule = class DocumentHistoryModule {
};
exports.DocumentHistoryModule = DocumentHistoryModule;
exports.DocumentHistoryModule = DocumentHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([document_history_entity_1.DocumentHistory])],
        providers: [document_history_service_1.DocumentHistoryService],
        controllers: [document_history_controller_1.DocumentHistoryController]
    })
], DocumentHistoryModule);
//# sourceMappingURL=document_history.module.js.map