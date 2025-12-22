"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const user_sessions_service_1 = require("./user_sessions.service");
const user_sessions_controller_1 = require("./user_sessions.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_sessions_entity_1 = require("./user_sessions.entity");
const user_entity_1 = require("../auth/user.entity");
let UserSessionsModule = class UserSessionsModule {
};
exports.UserSessionsModule = UserSessionsModule;
exports.UserSessionsModule = UserSessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_sessions_entity_1.UserSession, user_entity_1.AuthUsers])],
        providers: [user_sessions_service_1.UserSessionsService],
        controllers: [user_sessions_controller_1.UserSessionsController],
    })
], UserSessionsModule);
//# sourceMappingURL=user_sessions.module.js.map