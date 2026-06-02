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
exports.UserPaymentGatewayService = void 0;
const common_1 = require("@nestjs/common");
const user_payment_gateway_entity_1 = require("./user_payment_gateway.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let UserPaymentGatewayService = class UserPaymentGatewayService {
    gatewayRepo;
    constructor(gatewayRepo) {
        this.gatewayRepo = gatewayRepo;
    }
    async connect_gateway_service(data) {
        let existing = await this.gatewayRepo.findOne({
            where: { user_id: data.user_id, gateway_name: data.gateway_name },
        });
        if (existing) {
            existing.credentials = data.credentials;
            return await this.gatewayRepo.save(existing);
        }
        else {
            const newGateway = this.gatewayRepo.create({
                user_id: data.user_id,
                gateway_name: data.gateway_name,
                credentials: data.credentials,
                is_active: true,
            });
            return await this.gatewayRepo.save(newGateway);
        }
    }
    async all_gateway_service() {
        const response = await this.gatewayRepo.find();
        return response;
    }
    async user_gateway_service(user_id) {
        const response = await this.gatewayRepo.find({ where: { user_id } });
        return response;
    }
    async user_active_gateway_service(user_id, gateway_name) {
        const gateway = await this.gatewayRepo.findOne({
            where: { user_id, gateway_name, is_active: true },
        });
        if (!gateway)
            throw new common_1.NotFoundException("Payment gateway not found");
        return gateway;
    }
    async deactivate_gateway_service(user_id, gateway_name) {
        const gateway = await this.gatewayRepo.findOne({
            where: { user_id, gateway_name },
        });
        if (!gateway)
            throw new common_1.NotFoundException("Gateway not found");
        gateway.is_active = false;
        return await this.gatewayRepo.save(gateway);
    }
    async single_gateway_service(id) {
        const response = await this.gatewayRepo.find({ where: { uuid: id } });
        return response;
    }
    async delete_user_gateway_service(user_id) {
        const response = await this.gatewayRepo.delete({ user_id: user_id });
        return response;
    }
};
exports.UserPaymentGatewayService = UserPaymentGatewayService;
exports.UserPaymentGatewayService = UserPaymentGatewayService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_payment_gateway_entity_1.UserPaymentGatewayEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UserPaymentGatewayService);
//# sourceMappingURL=user_payment_gateway.service.js.map