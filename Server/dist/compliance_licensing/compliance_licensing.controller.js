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
exports.ComplianceLicensingController = void 0;
const common_1 = require("@nestjs/common");
const compliance_licensing_service_1 = require("./compliance_licensing.service");
let ComplianceLicensingController = class ComplianceLicensingController {
    licensingService;
    constructor(licensingService) {
        this.licensingService = licensingService;
    }
    async create_license(body) {
        const { user_id, company_id, license_type, license_number, issue_date, expiry_date, document_id, } = body;
        return await this.licensingService.create_license_service(user_id, company_id, license_type, license_number, issue_date, expiry_date, document_id);
    }
    async get_user_licences(user_id, company_id) {
        return await this.licensingService.get_user_licences_service(user_id, company_id);
    }
    async get_single_licences(license_id) {
        return await this.licensingService.single_licences_service(license_id);
    }
    async update_licences(license_id, updates) {
        return await this.licensingService.update_licences_service(license_id, updates);
    }
    async delete_licences(license_id) {
        return await this.licensingService.delete_licences_service(license_id);
    }
    async verify_licences(license_id) {
        return await this.licensingService.verify_licences_service(license_id);
    }
    async mark_expire_licences(license_id) {
        return await this.licensingService.mark_expire_licences_service(license_id);
    }
    async suspend_licences(license_id) {
        return await this.licensingService.suspend_licences_service(license_id);
    }
    async attach_licences_document(license_id, document_id) {
        return await this.licensingService.attach_licences_document_service(license_id, document_id);
    }
    async get_expired_licences(user_id, daysBefore) {
        return await this.licensingService.get_expired_licences_service(user_id, daysBefore);
    }
};
exports.ComplianceLicensingController = ComplianceLicensingController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "create_license", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("company_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "get_user_licences", null);
__decorate([
    (0, common_1.Get)("single/:license_id"),
    __param(0, (0, common_1.Param)("license_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "get_single_licences", null);
__decorate([
    (0, common_1.Put)("update/:license_id"),
    __param(0, (0, common_1.Param)("license_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "update_licences", null);
__decorate([
    (0, common_1.Delete)("delete/:license_id"),
    __param(0, (0, common_1.Param)("license_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "delete_licences", null);
__decorate([
    (0, common_1.Put)("verify/:license_id"),
    __param(0, (0, common_1.Param)("license_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "verify_licences", null);
__decorate([
    (0, common_1.Put)("expire/:license_id"),
    __param(0, (0, common_1.Param)("license_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "mark_expire_licences", null);
__decorate([
    (0, common_1.Put)(":license_id/suspend"),
    __param(0, (0, common_1.Param)("license_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "suspend_licences", null);
__decorate([
    (0, common_1.Put)(":license_id/attach-document/:document_id"),
    __param(0, (0, common_1.Param)("license_id")),
    __param(1, (0, common_1.Param)("document_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "attach_licences_document", null);
__decorate([
    (0, common_1.Get)("user/:user_id/expiring"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("daysBefore")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ComplianceLicensingController.prototype, "get_expired_licences", null);
exports.ComplianceLicensingController = ComplianceLicensingController = __decorate([
    (0, common_1.Controller)("compliance-licensing"),
    __metadata("design:paramtypes", [compliance_licensing_service_1.ComplianceLicensingService])
], ComplianceLicensingController);
//# sourceMappingURL=compliance_licensing.controller.js.map