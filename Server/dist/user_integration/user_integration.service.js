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
exports.UserIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const user_integration_entity_1 = require("./user_integration.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let UserIntegrationService = class UserIntegrationService {
    userIntegration;
    constructor(userIntegration) {
        this.userIntegration = userIntegration;
    }
    async create_userIntegration_service(data) {
        const response = this.userIntegration.create(data);
        const result = await this.userIntegration.save(response);
        return result;
    }
    async all_userIntegration_service() {
        const response = await this.userIntegration.find();
        return response;
    }
    async single_userIntegration_service(uuid) {
        const response = await this.userIntegration.findOne({
            where: { uuid },
        });
        if (!response)
            throw new common_1.NotFoundException(`Integration with UUID ${uuid} not found`);
        return response;
    }
    async user_userIntegration_service(user_id) {
        const response = await this.userIntegration.find({ where: { user_id } });
        return response;
    }
    async update_userIntegration_service(uuid, data) {
        await this.userIntegration.update(uuid, data);
        return this.userIntegration.findOneBy({ uuid: uuid });
    }
    async delete_userIntegration_service(uuid) {
        const response = await this.userIntegration.delete(uuid);
        return response;
    }
    async update_lastsync_userIntegration_service(uuid) {
        const record = await this.userIntegration.findOne({ where: { uuid } });
        if (!record) {
            throw new Error("Integration not found");
        }
        record.last_sync_at = new Date();
        await this.userIntegration.save(record);
        return record;
    }
    async change_status_userIntegration_service(uuid, status) {
        const record = await this.userIntegration.findOne({ where: { uuid } });
        if (!record) {
            throw new Error("Integration not found");
        }
        record.status = status;
        await this.userIntegration.save(record);
        return record;
    }
};
exports.UserIntegrationService = UserIntegrationService;
exports.UserIntegrationService = UserIntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_integration_entity_1.UserIntegration)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserIntegrationService);
//# sourceMappingURL=user_integration.service.js.map