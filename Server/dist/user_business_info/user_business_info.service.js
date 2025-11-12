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
exports.UserBusinessInfoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_business_info_entity_1 = require("./user_business_info.entity");
let UserBusinessInfoService = class UserBusinessInfoService {
    userBusiness;
    constructor(userBusiness) {
        this.userBusiness = userBusiness;
    }
    async create_business_info_serivce(data) {
        if (!data.user_id ||
            !data.business_name ||
            !data.industry ||
            !data.services_offered) {
            throw new common_1.BadRequestException("Required fields: user_id, business_name, industry, services_offered");
        }
        const entity = this.userBusiness.create(data);
        const result = await this.userBusiness.save(entity);
        return result;
    }
    async single_business_info_service(idOrUuid) {
        const info = await this.userBusiness.findOne({
            where: [
                { id: typeof idOrUuid === "number" ? idOrUuid : undefined },
                { uuid: typeof idOrUuid === "string" ? idOrUuid : undefined },
            ],
        });
        if (!info)
            throw new common_1.NotFoundException("Business info not found");
        return info;
    }
    async user_business_info_service(user_id) {
        const info = await this.userBusiness.find({
            where: { user_id, is_active: true },
            order: { created_at: "DESC" },
        });
        return info;
    }
    async update_business_info_service(idOrUuid, data) {
        const info = await this.single_business_info_service(idOrUuid);
        Object.assign(info, data);
        const result = await this.userBusiness.save(info);
        return result;
    }
    async delete_business_info_service(idOrUuid, soft = true) {
        const info = await this.single_business_info_service(idOrUuid);
        if (soft) {
            info.is_active = false;
            return await this.userBusiness.save(info);
        }
        else {
            return await this.userBusiness.delete({
                uuid: typeof idOrUuid === "string" ? idOrUuid : undefined,
                id: typeof idOrUuid === "number" ? idOrUuid : undefined,
            });
        }
    }
    async search_business_info_service(user_id, query) {
        if (!query || query.trim().length < 2) {
            throw new common_1.BadRequestException("Search query must be at least 2 characters");
        }
        const result = await this.userBusiness.find({
            where: [
                { user_id, business_name: (0, typeorm_1.Like)(`%${query}%`) },
                { user_id, industry: (0, typeorm_1.Like)(`%${query}%`) },
            ],
            order: { created_at: "DESC" },
        });
        return result;
    }
    async bulk_insert_business_info_service(entries) {
        if (!Array.isArray(entries) || entries.length === 0) {
            throw new common_1.BadRequestException("Entries must be a non-empty array");
        }
        const entities = this.userBusiness.create(entries);
        const result = await this.userBusiness.save(entities);
        return result;
    }
};
exports.UserBusinessInfoService = UserBusinessInfoService;
exports.UserBusinessInfoService = UserBusinessInfoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_business_info_entity_1.UserBusinessInfo)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserBusinessInfoService);
//# sourceMappingURL=user_business_info.service.js.map