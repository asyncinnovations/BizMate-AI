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
exports.WalletTransactionController = void 0;
const common_1 = require("@nestjs/common");
const wallet_transaction_service_1 = require("./wallet_transaction.service");
let WalletTransactionController = class WalletTransactionController {
    walletTransactionService;
    constructor(walletTransactionService) {
        this.walletTransactionService = walletTransactionService;
    }
    async create_wallet_transaction(data) {
        try {
            const response = await this.walletTransactionService.create_wallet_transaction_service(data);
            return { message: "wallet transaction created", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async all_wallet_transaction() {
        try {
            const response = await this.walletTransactionService.all_wallet_transaction_service();
            return { message: "all transaction retrived", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async single_wallet_transaction(uuid) {
        try {
            const response = await this.walletTransactionService.single_wallet_transaction_service(uuid);
            return { message: "single transaction retrived", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async user_wallet_transaction(userId) {
        try {
            const response = await this.walletTransactionService.user_wallet_transaction_service(userId);
            return { message: "user transaction retrived", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update_wallet_transaction_status(uuid, status) {
        try {
            const response = await this.walletTransactionService.update_wallet_transaction_status_service(uuid, status);
            return { message: "trnsaction status updated", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async refund_wallet_transaction(uuid) {
        try {
            const response = await this.walletTransactionService.refund_wallet_transaction_service(uuid);
            return { message: "transaction marked refund", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async delete_wallet_transaction(uuid) {
        try {
            const response = await this.walletTransactionService.delete_wallet_transaction_service(uuid);
            return { message: "trasaction deleted success", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async subscription_wallet_transaction(userId) {
        try {
            const response = await this.walletTransactionService.subscription_wallet_transaction_service(userId);
            return { message: "subscription transaction record retrived", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.WalletTransactionController = WalletTransactionController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletTransactionController.prototype, "create_wallet_transaction", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletTransactionController.prototype, "all_wallet_transaction", null);
__decorate([
    (0, common_1.Get)("single/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletTransactionController.prototype, "single_wallet_transaction", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletTransactionController.prototype, "user_wallet_transaction", null);
__decorate([
    (0, common_1.Put)("status/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WalletTransactionController.prototype, "update_wallet_transaction_status", null);
__decorate([
    (0, common_1.Put)("refund/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletTransactionController.prototype, "refund_wallet_transaction", null);
__decorate([
    (0, common_1.Delete)("delete/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletTransactionController.prototype, "delete_wallet_transaction", null);
__decorate([
    (0, common_1.Get)("user_subscription/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletTransactionController.prototype, "subscription_wallet_transaction", null);
exports.WalletTransactionController = WalletTransactionController = __decorate([
    (0, common_1.Controller)("wallet-transaction"),
    __metadata("design:paramtypes", [wallet_transaction_service_1.WalletTransactionService])
], WalletTransactionController);
//# sourceMappingURL=wallet_transaction.controller.js.map