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
exports.UserTwoFactorSettingsController = void 0;
const common_1 = require("@nestjs/common");
const user_two_factor_settings_service_1 = require("./user_two_factor_settings.service");
const QrcodeGenerator_1 = require("./../services/QrcodeGenerator");
let UserTwoFactorSettingsController = class UserTwoFactorSettingsController {
    twoFactorService;
    constructor(twoFactorService) {
        this.twoFactorService = twoFactorService;
    }
    async getSettings(userId) {
        try {
            const response = await this.twoFactorService.getSettings(userId);
            return response;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async enableTOTP(user_id) {
        try {
            const response = await this.twoFactorService.enableTOTP(user_id);
            return { response, qrcode: await (0, QrcodeGenerator_1.QrcodeGenerator)(response.otpauthUrl) };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verifyTOTP(userId, code) {
        try {
            const isValid = await this.twoFactorService.verifyTOTP(userId, code);
            if (isValid) {
                return this.twoFactorService.enable2FA(userId);
            }
            return { success: false, message: "Invalid TOTP code" };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async disable2FA(userId) {
        try {
            const response = await this.twoFactorService.disable2FA(userId);
            return { message: "2fa disabled", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setMethod(userId, method, value) {
        try {
            const response = await this.twoFactorService.setMethod(userId, method, value);
            return { message: "method saved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async generateRecoveryCodes(userId) {
        try {
            const response = await this.twoFactorService.generateRecoveryCodes(userId);
            return { message: "recovery code verified", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verifyRecoveryCode(userId, code) {
        try {
            const isValid = await this.twoFactorService.verifyRecoveryCode(userId, code);
            return { success: isValid };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UserTwoFactorSettingsController = UserTwoFactorSettingsController;
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)("user_totp_setup"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "enableTOTP", null);
__decorate([
    (0, common_1.Post)("verify_user_totp/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "verifyTOTP", null);
__decorate([
    (0, common_1.Patch)("disable/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "disable2FA", null);
__decorate([
    (0, common_1.Post)("method/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("method")),
    __param(2, (0, common_1.Body)("value")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "setMethod", null);
__decorate([
    (0, common_1.Post)("recovery_codes/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "generateRecoveryCodes", null);
__decorate([
    (0, common_1.Post)("verify_recovery_codes/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserTwoFactorSettingsController.prototype, "verifyRecoveryCode", null);
exports.UserTwoFactorSettingsController = UserTwoFactorSettingsController = __decorate([
    (0, common_1.Controller)("user-two-factor-settings"),
    __metadata("design:paramtypes", [user_two_factor_settings_service_1.UserTwoFactorSettingsService])
], UserTwoFactorSettingsController);
//# sourceMappingURL=user_two_factor_settings.controller.js.map