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
exports.TwoFactorRecoveryCodesController = void 0;
const common_1 = require("@nestjs/common");
const two_factor_recovery_codes_service_1 = require("./two_factor_recovery_codes.service");
let TwoFactorRecoveryCodesController = class TwoFactorRecoveryCodesController {
    recoveryService;
    constructor(recoveryService) {
        this.recoveryService = recoveryService;
    }
    async generateRecoveryCodes(user_id) {
        const codes = await this.recoveryService.generateRecoveryCodes(user_id);
        return { success: true, codes };
    }
    async verifyRecoveryCode(user_id, code) {
        const isValid = await this.recoveryService.verifyRecoveryCode(user_id, code);
        return { success: isValid };
    }
    async expireAllRecoveryCodes(user_id) {
        await this.recoveryService.expireAllRecoveryCodes(user_id);
        return { success: true };
    }
};
exports.TwoFactorRecoveryCodesController = TwoFactorRecoveryCodesController;
__decorate([
    (0, common_1.Post)("generate/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwoFactorRecoveryCodesController.prototype, "generateRecoveryCodes", null);
__decorate([
    (0, common_1.Post)("verify/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Body)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TwoFactorRecoveryCodesController.prototype, "verifyRecoveryCode", null);
__decorate([
    (0, common_1.Post)("expire/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwoFactorRecoveryCodesController.prototype, "expireAllRecoveryCodes", null);
exports.TwoFactorRecoveryCodesController = TwoFactorRecoveryCodesController = __decorate([
    (0, common_1.Controller)("two-factor-recovery-codes"),
    __metadata("design:paramtypes", [two_factor_recovery_codes_service_1.TwoFactorRecoveryCodesService])
], TwoFactorRecoveryCodesController);
//# sourceMappingURL=two_factor_recovery_codes.controller.js.map