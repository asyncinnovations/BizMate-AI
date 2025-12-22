"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const compliance_history_service_1 = require("./compliance_history.service");
const compliance_history_controller_1 = require("./compliance_history.controller");
const typeorm_1 = require("@nestjs/typeorm");
const compliance_history_entity_1 = require("./compliance_history.entity");
let ComplianceHistoryModule = class ComplianceHistoryModule {
};
exports.ComplianceHistoryModule = ComplianceHistoryModule;
exports.ComplianceHistoryModule = ComplianceHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([compliance_history_entity_1.ComplianceHistory])],
        providers: [compliance_history_service_1.ComplianceHistoryService],
        controllers: [compliance_history_controller_1.ComplianceHistoryController],
        exports: [compliance_history_service_1.ComplianceHistoryService],
    })
], ComplianceHistoryModule);
//# sourceMappingURL=compliance_history.module.js.map