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
exports.InvoiceSchedulesController = void 0;
const common_1 = require("@nestjs/common");
const invoice_schedules_service_1 = require("./invoice_schedules.service");
let InvoiceSchedulesController = class InvoiceSchedulesController {
    invoiceSchedulesService;
    constructor(invoiceSchedulesService) {
        this.invoiceSchedulesService = invoiceSchedulesService;
    }
    async create_schedule_controller(dto) {
        try {
            const response = await this.invoiceSchedulesService.create_schedule_service(dto);
            return {
                message: "Schedule created successfully",
                response,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async all_schedules_controller(user_id) {
        try {
            const response = await this.invoiceSchedulesService.all_schedules_service(user_id);
            return {
                message: "Schedules retrieved successfully",
                response,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async single_schedule_controller(id) {
        try {
            const response = await this.invoiceSchedulesService.single_schedule_service(id);
            return {
                message: "Schedule retrieved successfully",
                response,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async cancel_schedule_controller(id) {
        try {
            const response = await this.invoiceSchedulesService.cancel_schedule_service(id);
            return {
                message: "Schedule cancelled successfully",
                response,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async retry_schedule_controller(id) {
        try {
            const response = await this.invoiceSchedulesService.retry_schedule_service(id);
            return {
                message: "Schedule retry triggered successfully",
                response,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async execute_schedule_controller(id) {
        try {
            const response = await this.invoiceSchedulesService.execute_schedule_service(id);
            return {
                message: "Schedule executed successfully",
                response,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async reload_pending_controller() {
        try {
            const response = await this.invoiceSchedulesService.load_pending_schedules_service();
            return {
                message: "Pending schedules reloaded successfully",
                response,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.InvoiceSchedulesController = InvoiceSchedulesController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceSchedulesController.prototype, "create_schedule_controller", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceSchedulesController.prototype, "all_schedules_controller", null);
__decorate([
    (0, common_1.Get)("single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceSchedulesController.prototype, "single_schedule_controller", null);
__decorate([
    (0, common_1.Delete)("cancel/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceSchedulesController.prototype, "cancel_schedule_controller", null);
__decorate([
    (0, common_1.Patch)("retry/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceSchedulesController.prototype, "retry_schedule_controller", null);
__decorate([
    (0, common_1.Post)("execute/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceSchedulesController.prototype, "execute_schedule_controller", null);
__decorate([
    (0, common_1.Post)("reload"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoiceSchedulesController.prototype, "reload_pending_controller", null);
exports.InvoiceSchedulesController = InvoiceSchedulesController = __decorate([
    (0, common_1.Controller)("invoice-schedules"),
    __metadata("design:paramtypes", [invoice_schedules_service_1.InvoiceSchedulesService])
], InvoiceSchedulesController);
//# sourceMappingURL=invoice_schedules.controller.js.map