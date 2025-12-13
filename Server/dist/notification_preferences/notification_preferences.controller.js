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
    async createPreference(body) {
        return this.preferencesService.createPreference(body);
    }
    async updatePreference(preference_id, updates) {
        return this.preferencesService.updatePreference(preference_id, updates);
    }
    async getPreferenceById(preference_id) {
        return this.preferencesService.getPreferenceById(preference_id);
    }
    async getPreferencesByUser(user_id, company_id) {
        return this.preferencesService.getPreferencesByUser(user_id, company_id);
    }
    async deletePreference(preference_id) {
        return this.preferencesService.deletePreference(preference_id);
    }
    async toggleChannel(preference_id, body) {
        const { channel, enabled } = body;
        return this.preferencesService.toggleChannel(preference_id, channel, enabled);
    }
};
exports.NotificationPreferencesController = NotificationPreferencesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "createPreference", null);
__decorate([
    (0, common_1.Put)(":preference_id"),
    __param(0, (0, common_1.Param)("preference_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "updatePreference", null);
__decorate([
    (0, common_1.Get)(":preference_id"),
    __param(0, (0, common_1.Param)("preference_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "getPreferenceById", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("company_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "getPreferencesByUser", null);
__decorate([
    (0, common_1.Delete)(":preference_id"),
    __param(0, (0, common_1.Param)("preference_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "deletePreference", null);
__decorate([
    (0, common_1.Put)(":preference_id/toggle-channel"),
    __param(0, (0, common_1.Param)("preference_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationPreferencesController.prototype, "toggleChannel", null);
exports.NotificationPreferencesController = NotificationPreferencesController = __decorate([
    (0, common_1.Controller)("notification-preferences"),
    __metadata("design:paramtypes", [notification_preferences_service_1.NotificationPreferencesService])
], NotificationPreferencesController);
//# sourceMappingURL=notification_preferences.controller.js.map