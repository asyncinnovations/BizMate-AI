"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSchedulesModule = void 0;
const common_1 = require("@nestjs/common");
const invoice_schedules_service_1 = require("./invoice_schedules.service");
const invoice_schedules_controller_1 = require("./invoice_schedules.controller");
const typeorm_1 = require("@nestjs/typeorm");
const invoice_schedules_entity_1 = require("./invoice_schedules.entity");
const invoices_entity_1 = require("../invoices/invoices.entity");
const invoices_module_1 = require("../invoices/invoices.module");
let InvoiceSchedulesModule = class InvoiceSchedulesModule {
};
exports.InvoiceSchedulesModule = InvoiceSchedulesModule;
exports.InvoiceSchedulesModule = InvoiceSchedulesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([invoice_schedules_entity_1.InvoiceSchedule, invoices_entity_1.InvoiceEntity]),
            invoices_module_1.InvoicesModule,
        ],
        providers: [invoice_schedules_service_1.InvoiceSchedulesService],
        controllers: [invoice_schedules_controller_1.InvoiceSchedulesController],
    })
], InvoiceSchedulesModule);
//# sourceMappingURL=invoice_schedules.module.js.map