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
exports.ClientListsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_lists_entity_1 = require("./client_lists.entity");
let ClientListsService = class ClientListsService {
    clientListRepo;
    constructor(clientListRepo) {
        this.clientListRepo = clientListRepo;
    }
    async create_client_service(data) {
        const client = this.clientListRepo.create(data);
        return await this.clientListRepo.save(client);
    }
    async get_all_clients_service(user_id) {
        return await this.clientListRepo.find({
            where: { user_id },
            order: { added_at: "DESC" },
        });
    }
    async get_client_by_id_service(id) {
        const client = typeof id === "number"
            ? await this.clientListRepo.findOne({ where: { id } })
            : await this.clientListRepo.findOne({ where: { uuid: id } });
        if (!client)
            throw new common_1.NotFoundException("Client not found");
        return client;
    }
    async update_client_service(id, updateData) {
        const client = await this.clientListRepo.findOne({ where: { uuid: id } });
        if (!client)
            throw new common_1.NotFoundException("Client not found");
        Object.assign(client, updateData);
        return await this.clientListRepo.save(client);
    }
    async delete_client_service(id) {
        const client = await this.clientListRepo.findOne({ where: { uuid: id } });
        if (!client)
            throw new common_1.NotFoundException("Client not found");
        await this.clientListRepo.remove(client);
        return { success: true, message: "Client deleted successfully" };
    }
    async search_clients_service(user_id, query) {
        return await this.clientListRepo
            .createQueryBuilder("client")
            .where("client.user_id = :user_id", { user_id })
            .andWhere("(client.name ILIKE :q OR client.email ILIKE :q OR client.whatsapp_number ILIKE :q)", { q: `%${query}%` })
            .orderBy("client.added_at", "DESC")
            .getMany();
    }
    async client_exists_service(user_id, email, whatsapp) {
        return await this.clientListRepo.findOne({
            where: [
                { user_id, email },
                { user_id, whatsapp_number: whatsapp },
            ],
        });
    }
    async bulk_import_clients_service(user_id, clients) {
        const clientEntities = clients.map((c) => this.clientListRepo.create({ ...c, user_id }));
        return await this.clientListRepo.save(clientEntities);
    }
};
exports.ClientListsService = ClientListsService;
exports.ClientListsService = ClientListsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_lists_entity_1.ClientList)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ClientListsService);
//# sourceMappingURL=client_lists.service.js.map