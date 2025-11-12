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
exports.UserIntegrationController = void 0;
const common_1 = require("@nestjs/common");
const user_integration_service_1 = require("./user_integration.service");
const auth_guard_1 = require("../guards/auth/auth.guard");
let UserIntegrationController = class UserIntegrationController {
    Integrationservice;
    constructor(Integrationservice) {
        this.Integrationservice = Integrationservice;
    }
    async create_userIntegration(body) {
        if (!body.user_id) {
            return new common_1.BadRequestException("user id required");
        }
        const response = await this.Integrationservice.create_userIntegration_service(body);
        return { message: "user integration create success", response };
    }
    async all_userIntegration() {
        const response = await this.Integrationservice.all_userIntegration_service();
        return { message: "all user integration retrived", response };
    }
    async single_userIntegration(id) {
        const response = await this.Integrationservice.single_userIntegration_service(id);
        return { message: "single userIntegration retirved", response };
    }
    async user_userIntegration(user_id) {
        const response = await this.Integrationservice.user_userIntegration_service(user_id);
        return { message: "user integration retrived", response };
    }
    async update_userIntegration(id, body) {
        const response = await this.Integrationservice.update_userIntegration_service(id, body);
        return { message: "userIntegration update success", response };
    }
    async delete_userIntegration(id) {
        const response = await this.Integrationservice.delete_userIntegration_service(id);
        return { message: "userIntegration delete success", response };
    }
    async change_userIntegration_status(id, status) {
        const response = await this.Integrationservice.change_status_userIntegration_service(id, status);
        return { message: "user Integration status change success", response };
    }
    async update_userIntegration_lastSync(id) {
        const response = await this.Integrationservice.update_lastsync_userIntegration_service(id);
        return { message: "userIntegration last sync updated", response };
    }
};
exports.UserIntegrationController = UserIntegrationController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserIntegrationController.prototype, "create_userIntegration", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserIntegrationController.prototype, "all_userIntegration", null);
__decorate([
    (0, common_1.Get)("single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserIntegrationController.prototype, "single_userIntegration", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserIntegrationController.prototype, "user_userIntegration", null);
__decorate([
    (0, common_1.Patch)("update/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserIntegrationController.prototype, "update_userIntegration", null);
__decorate([
    (0, common_1.Delete)("delete/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserIntegrationController.prototype, "delete_userIntegration", null);
__decorate([
    (0, common_1.Patch)("update_status/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserIntegrationController.prototype, "change_userIntegration_status", null);
__decorate([
    (0, common_1.Patch)("update_sync/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserIntegrationController.prototype, "update_userIntegration_lastSync", null);
exports.UserIntegrationController = UserIntegrationController = __decorate([
    (0, common_1.Controller)("user_integration"),
    (0, common_1.UseGuards)(auth_guard_1.JwtGuard),
    __metadata("design:paramtypes", [user_integration_service_1.UserIntegrationService])
], UserIntegrationController);
//# sourceMappingURL=user_integration.controller.js.map