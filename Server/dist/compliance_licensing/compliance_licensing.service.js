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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceLicensingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const compliance_licensing_entity_1 = require("./compliance_licensing.entity");
let ComplianceLicensingService = class ComplianceLicensingService {
    licenseRepository;
    constructor(licenseRepository) {
        this.licenseRepository = licenseRepository;
    }
    async create_license_service(user_id, company_id, license_type, license_number, issue_date, expiry_date, document_id) {
        const license = this.licenseRepository.create({
            user_id,
            company_id,
            license_type,
            license_number,
            issue_date,
            expiry_date,
            document_id,
            status: compliance_licensing_entity_1.LicenseStatus.ACTIVE,
        });
        const saved = await this.licenseRepository.save(license);
        return saved;
    }
    async get_user_licences_service(user_id, company_id) {
        return this.licenseRepository.find({
            where: { user_id, company_id },
            order: { expiry_date: "ASC" },
        });
    }
    async single_licences_service(license_id) {
        const license = await this.licenseRepository.findOne({
            where: { uuid: license_id },
        });
        if (!license)
            throw new common_1.HttpException("License not found", 404);
        return license;
    }
    async update_licences_service(license_id, updates) {
        const license = await this.single_licences_service(license_id);
        Object.assign(license, updates);
        const updated = await this.licenseRepository.save(license);
        return updated;
    }
    async delete_licences_service(license_id) {
        const license = await this.single_licences_service(license_id);
        await this.licenseRepository.remove(license);
        return { message: "License deleted successfully" };
    }
    async verify_licences_service(license_id) {
        return this.update_licences_service(license_id, {
            status: compliance_licensing_entity_1.LicenseStatus.ACTIVE,
        });
    }
    async mark_expire_licences_service(license_id) {
        return this.update_licences_service(license_id, {
            status: compliance_licensing_entity_1.LicenseStatus.EXPIRED,
        });
    }
    async suspend_licences_service(license_id) {
        return this.update_licences_service(license_id, {
            status: compliance_licensing_entity_1.LicenseStatus.SUSPENDED,
        });
    }
    async attach_licences_document_service(license_id, document_id) {
        return this.update_licences_service(license_id, { document_id });
    }
    async get_expired_licences_service(user_id, daysBefore = 30) {
        const now = new Date();
        const targetDate = new Date();
        targetDate.setDate(now.getDate() + daysBefore);
        return this.licenseRepository
            .createQueryBuilder("license")
            .where("license.user_id = :user_id", { user_id })
            .andWhere("license.expiry_date BETWEEN :now AND :targetDate", {
            now,
            targetDate,
        })
            .orderBy("license.expiry_date", "ASC")
            .getMany();
    }
};
exports.ComplianceLicensingService = ComplianceLicensingService;
exports.ComplianceLicensingService = ComplianceLicensingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(compliance_licensing_entity_1.ComplianceLicense)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object])
], ComplianceLicensingService);
//# sourceMappingURL=compliance_licensing.service.js.map