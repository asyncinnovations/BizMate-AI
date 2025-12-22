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
exports.UserSessionsController = void 0;
const common_1 = require("@nestjs/common");
const user_sessions_service_1 = require("./user_sessions.service");
let UserSessionsController = class UserSessionsController {
    userSessionsService;
    constructor(userSessionsService) {
        this.userSessionsService = userSessionsService;
    }
    async create_user_session_service(body) {
        try {
            const session = await this.userSessionsService.create_user_session_service(body);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: "User session created successfully",
                data: session,
            };
        }
        catch (error) {
            throw new common_1.HttpException({ statusCode: common_1.HttpStatus.BAD_REQUEST, message: error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_all_sessions_service() {
        try {
            const sessions = await this.userSessionsService.get_all_sessions_service();
            return {
                statusCode: common_1.HttpStatus.OK,
                message: "All user sessions fetched successfully",
                data: sessions,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async get_user_sessions_service(userId) {
        try {
            const sessions = await this.userSessionsService.get_user_sessions_service(userId);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: "User sessions fetched successfully",
                data: sessions,
            };
        }
        catch (error) {
            throw new common_1.HttpException({ statusCode: common_1.HttpStatus.NOT_FOUND, message: error.message }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update_user_session_service(uuid) {
        try {
            const session = await this.userSessionsService.update_user_session_service(uuid);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: "User session updated successfully",
                data: session,
            };
        }
        catch (error) {
            throw new common_1.HttpException({ statusCode: common_1.HttpStatus.BAD_REQUEST, message: error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deactivate_user_session_service(uuid) {
        try {
            const session = await this.userSessionsService.deactivate_user_session_service(uuid);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: "User session deactivated successfully",
                data: session,
            };
        }
        catch (error) {
            throw new common_1.HttpException({ statusCode: common_1.HttpStatus.NOT_FOUND, message: error.message }, common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.UserSessionsController = UserSessionsController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSessionsController.prototype, "create_user_session_service", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserSessionsController.prototype, "get_all_sessions_service", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserSessionsController.prototype, "get_user_sessions_service", null);
__decorate([
    (0, common_1.Patch)("update_last_active/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserSessionsController.prototype, "update_user_session_service", null);
__decorate([
    (0, common_1.Delete)("logout/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserSessionsController.prototype, "deactivate_user_session_service", null);
exports.UserSessionsController = UserSessionsController = __decorate([
    (0, common_1.Controller)("user-sessions"),
    __metadata("design:paramtypes", [user_sessions_service_1.UserSessionsService])
], UserSessionsController);
//# sourceMappingURL=user_sessions.controller.js.map