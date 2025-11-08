"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoices_entity_1 = require("./invoices.entity");
let InvoicesService = class InvoicesService {
    invoicesRepo;
    constructor(invoicesRepo) {
        this.invoicesRepo = invoicesRepo;
    }
    async create_invoice_service(data) {
        const invoice = this.invoicesRepo.create(data);
        return await this.invoicesRepo.save(invoice);
    }
    async all_invoices_service(query) {
        const where = {};
        if (query?.status)
            where.status = query.status;
        if (query?.user_id)
            where.user_id = query.user_id;
        if (query?.search) {
            where.customer_name = (0, typeorm_2.ILike)(`%${query.search}%`);
        }
        return await this.invoicesRepo.find({
            where,
            order: { created_at: "DESC" },
        });
    }
    async user_invoices_service(user_id) {
        const response = await this.invoicesRepo.query(`SELECT i.*, u.full_name as primary_owner
FROM invoices i
JOIN users u ON i.user_id::UUID = u.uuid
WHERE i.user_id = $1
GROUP BY i.uuid, u.full_name
`, [user_id]);
        return response;
    }
    async single_invoice_service(idOrUuid) {
        const invoice = await this.invoicesRepo.query(` SELECT * FROM invoices WHERE uuid=$1`, [idOrUuid]);
        if (!invoice || invoice.length === 0)
            throw new common_1.NotFoundException("Invoice not found");
        return invoice[0];
    }
    async update_invoice_service(idOrUuid, data) {
        const invoice = await this.single_invoice_service(idOrUuid);
        Object.assign(invoice, data);
        return await this.invoicesRepo.save(invoice);
    }
    async update_custom_field_service(idOrUuid, customFields) {
        const invoice = await this.single_invoice_service(idOrUuid);
        invoice.custom_fields = { ...invoice.custom_fields, ...customFields };
        return await this.invoicesRepo.save(invoice);
    }
    async delete_invoices_service(idOrUuid) {
        const invoice = await this.single_invoice_service(idOrUuid);
        await this.invoicesRepo.remove(invoice);
        return { message: "Invoice deleted successfully" };
    }
    async update_invoice_status_service(idOrUuid, status) {
        const invoice = await this.single_invoice_service(idOrUuid);
        invoice.status = status;
        return await this.invoicesRepo.save(invoice);
    }
    async total_inovices_service(subtotal, vatRate) {
        let vat = parseFloat(((subtotal * vatRate) / 100).toFixed(2));
        let total = parseFloat((subtotal + vat).toFixed(2));
        return { vat, total };
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoices_entity_1.InvoiceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map