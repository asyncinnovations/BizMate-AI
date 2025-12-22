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
exports.NotificationPreferencesController = void 0;
const common_1 = require("@nestjs/common");
const notification_preferences_service_1 = require("./notification_preferences.service");
let NotificationPreferencesController = class NotificationPreferencesController {
    preferencesService;
    constructor(preferencesService) {
        this.preferencesService = preferencesService;
    }
    async create_preference(body) {
        try {
            const response = await this.preferencesService.create_preference_service(body);
            return { message: "preference created", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update_preference(preference_id, updates) {
        try {
            const response = await this.preferencesService.update_preference_service(preference_id, updates);
            return { message: "preference updated", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async single_preference(preference_id) {
        try {
            const response = await this.preferencesService.single_preference_service(preference_id);
            return { message: "single preference", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async user_preference(user_id, company_id) {
        try {
            const response = await this.preferencesService.user_preference_service(user_id, company_id);
            return { message: "user preference", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async toggle_channel(preference_id, body) {
        try {
            const { channel, enabled } = body;
            const response = await this.preferencesService.toggle_channel_service(preference_id, channel, enabled);
            return { message: "toggle preference", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async delete_preference(preference_id) {
        try {
            const response = await this.preferencesService.delete_preference_service(preference_id);
            return { message: "preference deleted", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.NotificationPreferencesController = NotificationPreferencesController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "create_preference", null);
__decorate([
    (0, common_1.Put)("update/:preference_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("preference_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "update_preference", null);
__decorate([
    (0, common_1.Get)("single/:preference_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("preference_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "single_preference", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("company_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "user_preference", null);
__decorate([
    (0, common_1.Put)("toggle-channel/:preference_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("preference_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "toggle_channel", null);
__decorate([
    (0, common_1.Delete)("delete/:preference_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("preference_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "delete_preference", null);
exports.NotificationPreferencesController = NotificationPreferencesController = __decorate([
    (0, common_1.Controller)("notification-preferences"),
    __metadata("design:paramtypes", [notification_preferences_service_1.NotificationPreferencesService])
], NotificationPreferencesController);
//# sourceMappingURL=notification_preferences.controller.js.map