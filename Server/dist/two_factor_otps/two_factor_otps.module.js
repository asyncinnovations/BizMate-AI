"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorOtpsModule = void 0;
const common_1 = require("@nestjs/common");
const two_factor_otps_service_1 = require("./two_factor_otps.service");
const two_factor_otps_controller_1 = require("./two_factor_otps.controller");
const typeorm_1 = require("@nestjs/typeorm");
const two_factor_otps_entity_1 = require("./two_factor_otps.entity");
const user_entity_1 = require("../auth/user.entity");
let TwoFactorOtpsModule = class TwoFactorOtpsModule {
};
exports.TwoFactorOtpsModule = TwoFactorOtpsModule;
exports.TwoFactorOtpsModule = TwoFactorOtpsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([two_factor_otps_entity_1.TwoFactorOTP, user_entity_1.AuthUsers])],
        providers: [two_factor_otps_service_1.TwoFactorOtpsService],
        controllers: [two_factor_otps_controller_1.TwoFactorOtpsController],
    })
], TwoFactorOtpsModule);
//# sourceMappingURL=two_factor_otps.module.js.map