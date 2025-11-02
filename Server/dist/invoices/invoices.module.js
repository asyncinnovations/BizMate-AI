"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const invoices_service_1 = require("./invoices.service");
const invoices_controller_1 = require("./invoices.controller");
const invoices_entity_1 = require("./invoices.entity");
const PdfService_1 = require("../common/PdfService");
const EmailService_1 = require("../common/EmailService");
const user_payment_gateway_service_1 = require("../user_payment_gateway/user_payment_gateway.service");
const user_payment_gateway_entity_1 = require("../user_payment_gateway/user_payment_gateway.entity");
let InvoicesModule = class InvoicesModule {
};
exports.InvoicesModule = InvoicesModule;
exports.InvoicesModule = InvoicesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([invoices_entity_1.InvoiceEntity, user_payment_gateway_entity_1.UserPaymentGatewayEntity]),
        ],
        providers: [
            invoices_service_1.InvoicesService,
            PdfService_1.PdfService,
            EmailService_1.EmailService,
            user_payment_gateway_service_1.UserPaymentGatewayService,
        ],
        controllers: [invoices_controller_1.InvoicesController],
        exports: [invoices_service_1.InvoicesService],
    })
], InvoicesModule);
//# sourceMappingURL=invoices.module.js.map