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
exports.WalletTransactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_transaction_entity_1 = require("./wallet_transaction.entity");
let WalletTransactionService = class WalletTransactionService {
    walletTransactionRepo;
    constructor(walletTransactionRepo) {
        this.walletTransactionRepo = walletTransactionRepo;
    }
    async create_wallet_transaction_service(data) {
        const transaction = this.walletTransactionRepo.create(data);
        return await this.walletTransactionRepo.save(transaction);
    }
    async all_wallet_transaction_service() {
        const result = await this.walletTransactionRepo.find();
        return result;
    }
    async single_wallet_transaction_service(uuid) {
        const result = await this.walletTransactionRepo.findOne({
            where: { uuid },
        });
        return result;
    }
    async user_wallet_transaction_service(userId) {
        const result = await this.walletTransactionRepo.find({
            where: { user_id: userId },
        });
        return result;
    }
    async update_wallet_transaction_status_service(uuid, status) {
        const transaction = await this.single_wallet_transaction_service(uuid);
        if (!transaction)
            return null;
        transaction.status = status;
        const result = await this.walletTransactionRepo.save(transaction);
        return result;
    }
    async refund_wallet_transaction_service(uuid) {
        const result = await this.update_wallet_transaction_status_service(uuid, "refunded");
        return result;
    }
    async delete_wallet_transaction_service(uuid) {
        const result = await this.walletTransactionRepo.delete({ uuid: uuid });
        return result.affected > 0;
    }
    async subscription_wallet_transaction_service(userId) {
        const result = await this.walletTransactionRepo.find({
            where: { user_id: userId, transaction_type: "subscription_purchase" },
        });
        return result;
    }
};
exports.WalletTransactionService = WalletTransactionService;
exports.WalletTransactionService = WalletTransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_transaction_entity_1.WalletTransaction)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], WalletTransactionService);
//# sourceMappingURL=wallet_transaction.service.js.map