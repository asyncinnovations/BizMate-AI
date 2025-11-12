"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBusinessInfoModule = void 0;
const common_1 = require("@nestjs/common");
const user_business_info_service_1 = require("./user_business_info.service");
const user_business_info_controller_1 = require("./user_business_info.controller");
const user_business_info_entity_1 = require("./user_business_info.entity");
const typeorm_1 = require("@nestjs/typeorm");
let UserBusinessInfoModule = class UserBusinessInfoModule {
};
exports.UserBusinessInfoModule = UserBusinessInfoModule;
exports.UserBusinessInfoModule = UserBusinessInfoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_business_info_entity_1.UserBusinessInfo])],
        providers: [user_business_info_service_1.UserBusinessInfoService],
        controllers: [user_business_info_controller_1.UserBusinessInfoController],
        exports: [user_business_info_service_1.UserBusinessInfoService],
    })
], UserBusinessInfoModule);
//# sourceMappingURL=user_business_info.module.js.map