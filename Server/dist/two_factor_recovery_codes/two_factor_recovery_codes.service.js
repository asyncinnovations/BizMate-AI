"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorRecoveryCodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const two_factor_recovery_codes_entity_1 = require("./two_factor_recovery_codes.entity");
const user_entity_1 = require("../auth/user.entity");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcrypt"));
let TwoFactorRecoveryCodesService = class TwoFactorRecoveryCodesService {
    recoveryRepo;
    userRepo;
    constructor(recoveryRepo, userRepo) {
        this.recoveryRepo = recoveryRepo;
        this.userRepo = userRepo;
    }
    async generateRecoveryCodes(userId, count = 10) {
        const user = await this.userRepo.findOne({ where: { uuid: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const codes = [];
        for (let i = 0; i < count; i++) {
            const code = crypto.randomBytes(4).toString("hex");
            codes.push(code);
            const hashedCode = await bcrypt.hash(code, 10);
            const recoveryCode = this.recoveryRepo.create({
                user_id: userId,
                code: hashedCode,
                is_used: false,
            });
            await this.recoveryRepo.save(recoveryCode);
        }
        return codes;
    }
    async verifyRecoveryCode(userId, code) {
        const user = await this.userRepo.findOne({ where: { uuid: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const recoveryCodes = await this.recoveryRepo.find({
            where: { user_id: userId, is_used: false },
        });
        for (const rc of recoveryCodes) {
            const isMatch = await bcrypt.compare(code, rc.code);
            if (isMatch) {
                rc.is_used = true;
                await this.recoveryRepo.save(rc);
                return true;
            }
        }
        return false;
    }
    async expireAllRecoveryCodes(userId) {
        const user = await this.userRepo.findOne({ where: { uuid: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const codes = await this.recoveryRepo.find({
            where: { user_id: userId, is_used: false },
        });
        for (const code of codes) {
            code.is_used = true;
            await this.recoveryRepo.save(code);
        }
    }
    async getActiveRecoveryCodes(userId) {
        const user = await this.userRepo.findOne({ where: { uuid: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        return this.recoveryRepo.find({
            where: { user_id: userId, is_used: false },
        });
    }
};
exports.TwoFactorRecoveryCodesService = TwoFactorRecoveryCodesService;
exports.TwoFactorRecoveryCodesService = TwoFactorRecoveryCodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(two_factor_recovery_codes_entity_1.TwoFactorRecoveryCode)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.AuthUsers)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], TwoFactorRecoveryCodesService);
//# sourceMappingURL=two_factor_recovery_codes.service.js.map