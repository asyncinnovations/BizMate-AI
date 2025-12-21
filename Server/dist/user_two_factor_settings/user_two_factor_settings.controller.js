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
exports.UserTwoFactorSettingsController = void 0;
const common_1 = require("@nestjs/common");
const user_two_factor_settings_service_1 = require("./user-two-factor-settings.service");
let UserTwoFactorSettingsController = class UserTwoFactorSettingsController {
    twoFactorService;
    constructor(twoFactorService) {
        this.twoFactorService = twoFactorService;
    }
    async getSettings(userId) {
        return this.twoFactorService.getSettings(userId);
    }
    async enableTOTP(userId) {
        return this.twoFactorService.enableTOTP(userId);
    }
    async verifyTOTP(userId, code) {
        const isValid = await this.twoFactorService.verifyTOTP(userId, code);
        if (isValid) {
            return this.twoFactorService.enable2FA(userId);
        }
        return { success: false, message: 'Invalid TOTP code' };
    }
    async disable2FA(userId) {
        return this.twoFactorService.disable2FA(userId);
    }
    async setMethod(userId, method, value) {
        return this.twoFactorService.setMethod(userId, method, value);
    }
    async generateRecoveryCodes(userId) {
        return this.twoFactorService.generateRecoveryCodes(userId);
    }
    async verifyRecoveryCode(userId, code) {
        const isValid = await this.twoFactorService.verifyRecoveryCode(userId, code);
        return { success: isValid };
    }
};
exports.UserTwoFactorSettingsController = UserTwoFactorSettingsController;
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)(':userId/totp/setup'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "enableTOTP", null);
__decorate([
    (0, common_1.Post)(':userId/totp/verify'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "verifyTOTP", null);
__decorate([
    (0, common_1.Patch)(':userId/disable'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "disable2FA", null);
__decorate([
    (0, common_1.Post)(':userId/method'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)('method')),
    __param(2, (0, common_1.Body)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "setMethod", null);
__decorate([
    (0, common_1.Post)(':userId/recovery-codes'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "generateRecoveryCodes", null);
__decorate([
    (0, common_1.Post)(':userId/recovery-codes/verify'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "verifyRecoveryCode", null);
exports.UserTwoFactorSettingsController = UserTwoFactorSettingsController = __decorate([
    (0, common_1.Controller)('user-two-factor-settings'),
    __metadata("design:paramtypes", [typeof (_a = typeof user_two_factor_settings_service_1.UserTwoFactorSettingsService !== "undefined" && user_two_factor_settings_service_1.UserTwoFactorSettingsService) === "function" ? _a : Object])
], UserTwoFactorSettingsController);
//# sourceMappingURL=user_two_factor_settings.controller.js.map