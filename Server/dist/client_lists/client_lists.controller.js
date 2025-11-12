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
exports.ClientListsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../guards/auth/auth.guard");
const client_lists_service_1 = require("./client_lists.service");
const client_lists_entity_1 = require("./client_lists.entity");
let ClientListsController = class ClientListsController {
    clientListService;
    constructor(clientListService) {
        this.clientListService = clientListService;
    }
    async create_client(req, body) {
        const { name, email, whatsapp_number, instagram_id, user_id } = body;
        if (!user_id)
            throw new common_1.BadRequestException("Invalid user ID");
        if (!name)
            throw new common_1.BadRequestException("Client name is required");
        if (!email && !whatsapp_number && !instagram_id)
            throw new common_1.BadRequestException("At least one contact (email, WhatsApp, or Instagram) is required");
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            throw new common_1.BadRequestException("Invalid email format");
        if (whatsapp_number && !/^\+?\d{8,15}$/.test(whatsapp_number))
            throw new common_1.BadRequestException("Invalid WhatsApp number");
        const data = { ...body, user_id };
        const response = await this.clientListService.create_client_service(data);
        return { message: "Client created successfully", response };
    }
    async get_all_clients(user_id) {
        if (!user_id)
            throw new common_1.BadRequestException("Invalid user ID");
        const response = await this.clientListService.get_all_clients_service(user_id);
        return { message: "Clients fetched successfully", response };
    }
    async get_client(id) {
        if (!id)
            throw new common_1.BadRequestException("Client ID is required");
        const response = await this.clientListService.get_client_by_id_service(id);
        if (!response)
            throw new common_1.BadRequestException("Client not found");
        return { message: "Client fetched successfully", response };
    }
    async search_clients(user_id, query) {
        if (!user_id)
            throw new common_1.BadRequestException("Invalid user ID");
        if (!query || query.trim().length < 2)
            throw new common_1.BadRequestException("Search query must be at least 2 characters");
        const response = await this.clientListService.search_clients_service(user_id, query);
        return { message: "Search results", response };
    }
    async update_client(id, body) {
        if (!id)
            throw new common_1.BadRequestException("Client ID is required");
        if (!Object.keys(body).length)
            throw new common_1.BadRequestException("No data provided to update");
        const response = await this.clientListService.update_client_service(id, body);
        return { message: "Client updated successfully", response };
    }
    async bulk_import_clients(user_id, body) {
        if (!user_id)
            throw new common_1.BadRequestException("Invalid user ID");
        if (!Array.isArray(body) || body.length === 0)
            throw new common_1.BadRequestException("Client list must be a non-empty array");
        for (const client of body) {
            if (!client.name)
                throw new common_1.BadRequestException("Each client must have a name");
        }
        const response = await this.clientListService.bulk_import_clients_service(user_id, body);
        return { message: "Clients imported successfully", count: response.length };
    }
    async check_client_exists(user_id, body) {
        if (!user_id)
            throw new common_1.BadRequestException("Invalid user ID");
        const { email, whatsapp_number } = body;
        if (!email && !whatsapp_number)
            throw new common_1.BadRequestException("Please provide either email or WhatsApp number");
        const response = await this.clientListService.client_exists_service(user_id, email, whatsapp_number);
        return {
            exists: !!response,
            message: response ? "Client already exists" : "Client not found",
            data: response,
        };
    }
    async delete_client(id) {
        if (!id)
            throw new common_1.BadRequestException("Client ID is required");
        const response = await this.clientListService.delete_client_service(id);
        return response;
    }
};
exports.ClientListsController = ClientListsController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, client_lists_entity_1.ClientList]),
    __metadata("design:returntype", Promise)
], ClientListsController.prototype, "create_client", null);
__decorate([
    (0, common_1.Get)("user/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientListsController.prototype, "get_all_clients", null);
__decorate([
    (0, common_1.Get)("single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientListsController.prototype, "get_client", null);
__decorate([
    (0, common_1.Get)("search/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClientListsController.prototype, "search_clients", null);
__decorate([
    (0, common_1.Patch)("update/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientListsController.prototype, "update_client", null);
__decorate([
    (0, common_1.Post)("bulk_import/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ClientListsController.prototype, "bulk_import_clients", null);
__decorate([
    (0, common_1.Post)("client_exists/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientListsController.prototype, "check_client_exists", null);
__decorate([
    (0, common_1.Delete)("delete/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientListsController.prototype, "delete_client", null);
exports.ClientListsController = ClientListsController = __decorate([
    (0, common_1.Controller)("client_lists"),
    (0, common_1.UseGuards)(auth_guard_1.JwtGuard),
    __metadata("design:paramtypes", [client_lists_service_1.ClientListsService])
], ClientListsController);
//# sourceMappingURL=client_lists.controller.js.map