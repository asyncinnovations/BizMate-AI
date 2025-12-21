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
exports.TwoFactorOtpsController = void 0;
const common_1 = require("@nestjs/common");
const two_factor_otps_service_1 = require("./two_factor_otps.service");
let TwoFactorOtpsController = class TwoFactorOtpsController {
    otpService;
    constructor(otpService) {
        this.otpService = otpService;
    }
    async generateOtp(user_id, length, ttlMinutes) {
        const otp = await this.otpService.generateOtp(user_id, length || 6, ttlMinutes || 5);
        return { success: true, otp };
    }
    async verifyOtp(user_id, otpCode) {
        const isValid = await this.otpService.verifyOtp(user_id, otpCode);
        return { success: isValid };
    }
    async expireOtps(user_id) {
        await this.otpService.expireOtps(user_id);
        return { success: true };
    }
};
exports.TwoFactorOtpsController = TwoFactorOtpsController;
__decorate([
    (0, common_1.Post)("generate/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Body)("length")),
    __param(2, (0, common_1.Body)("ttlMinutes")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], TwoFactorOtpsController.prototype, "generateOtp", null);
__decorate([
    (0, common_1.Post)("verify/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Body)("otpCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TwoFactorOtpsController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)("expire/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwoFactorOtpsController.prototype, "expireOtps", null);
exports.TwoFactorOtpsController = TwoFactorOtpsController = __decorate([
    (0, common_1.Controller)("two-factor-otps"),
    __metadata("design:paramtypes", [two_factor_otps_service_1.TwoFactorOtpsService])
], TwoFactorOtpsController);
//# sourceMappingURL=two_factor_otps.controller.js.map