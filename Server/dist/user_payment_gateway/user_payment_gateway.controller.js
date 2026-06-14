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
exports.UserPaymentGatewayController = void 0;
const common_1 = require("@nestjs/common");
const user_payment_gateway_service_1 = require("./user_payment_gateway.service");
const auth_guard_1 = require("../guards/auth/auth.guard");
const PaymentService_1 = require("../services/PaymentService");
let UserPaymentGatewayController = class UserPaymentGatewayController {
    gatewayService;
    paymentService;
    constructor(gatewayService, paymentService) {
        this.gatewayService = gatewayService;
        this.paymentService = paymentService;
    }
    validate(data) {
        const errors = {};
        if (!data.user_id) {
            errors.user_id = "User ID is required";
        }
        if (!data.gateway_name) {
            errors.gateway_name = "Gateway name is required";
        }
        if (!data.credentials || typeof data.credentials !== "object") {
            errors.credentials = "Credentials are required and must be an object";
        }
        return {
            valid: Object.keys(errors).length === 0,
            errors,
        };
    }
    async connect_gateway(body) {
        const { valid, errors } = this.validate(body);
        if (!valid) {
            throw new common_1.BadRequestException(errors);
        }
        const data = {
            user_id: body.user_id,
            gateway_name: body.gateway_name || "stripe",
            credentials: body.credentials,
        };
        const response = await this.gatewayService.connect_gateway_service(data);
        return { message: "gateway connected successfully", response };
    }
    async all_gateway() {
        const response = await this.gatewayService.all_gateway_service();
        return { message: "all gateway retrived", response };
    }
    async single_gateway(id) {
        const response = await this.gatewayService.single_gateway_service(id);
        return { message: "single gateway retrived", response };
    }
    async user_gateways(user_id) {
        const response = await this.gatewayService.user_gateway_service(user_id);
        return { message: "user gateway retrived", response };
    }
    async user_active_gateway(user_id, gateway_name) {
        const response = await this.gatewayService.user_active_gateway_service(user_id, gateway_name);
        return { message: "active gateway retrived", response };
    }
    async deactivate_gateway(user_id, gateway_name) {
        const response = await this.gatewayService.deactivate_gateway_service(user_id, gateway_name);
        return { message: "gateway deactived", response };
    }
    async delete_user_gateway(user_id) {
        const response = await this.gatewayService.delete_user_gateway_service(user_id);
        return { message: "user gateway deleted", response };
    }
    async payment_link(body) {
        const { user_id, amount, gateway_name } = body;
        if (!user_id || !amount || !gateway_name) {
            throw new Error("Missing required fields: user_id, amount, gateway_name");
        }
        const userGateway = await this.gatewayService.user_active_gateway_service(user_id, gateway_name);
        if (!userGateway) {
            throw new Error("No active payment gateway found for this user.");
        }
        let response;
        switch (gateway_name.toLowerCase()) {
            case "stripe":
                response = await this.paymentService.generateStripeLink({
                    amount,
                    description: "Invoice Payment",
                    order_ref: `INV-${Date.now()}`,
                });
                break;
            case "paypal":
                response = await this.paymentService.generatePayPalLink({
                    amount,
                    currency: "USD",
                    description: "Invoice Payment",
                    order_ref: `INV-${Date.now()}`,
                });
                break;
            case "telr":
                response = await this.paymentService.generateTelrLink({
                    amount,
                    description: "Invoice Payment",
                    order_ref: `INV-${Date.now()}`,
                });
                break;
            default:
                throw new Error("Unsupported payment gateway.");
        }
        return {
            message: "Payment link generated successfully",
            gateway: gateway_name,
            data: response,
        };
    }
};
exports.UserPaymentGatewayController = UserPaymentGatewayController;
__decorate([
    (0, common_1.Post)("connect"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserPaymentGatewayController.prototype, "connect_gateway", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserPaymentGatewayController.prototype, "all_gateway", null);
__decorate([
    (0, common_1.Get)("single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserPaymentGatewayController.prototype, "single_gateway", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserPaymentGatewayController.prototype, "user_gateways", null);
__decorate([
    (0, common_1.Get)("active/:user_id/:name"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Param)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserPaymentGatewayController.prototype, "user_active_gateway", null);
__decorate([
    (0, common_1.Patch)("deactivate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)("user_id")),
    __param(1, (0, common_1.Body)("gateway_name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserPaymentGatewayController.prototype, "deactivate_gateway", null);
__decorate([
    (0, common_1.Delete)("delete/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserPaymentGatewayController.prototype, "delete_user_gateway", null);
__decorate([
    (0, common_1.Post)("payment_link"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserPaymentGatewayController.prototype, "payment_link", null);
exports.UserPaymentGatewayController = UserPaymentGatewayController = __decorate([
    (0, common_1.Controller)("user_payment_gateway"),
    (0, common_1.UseGuards)(auth_guard_1.JwtGuard),
    __metadata("design:paramtypes", [user_payment_gateway_service_1.UserPaymentGatewayService,
        PaymentService_1.PaymentService])
], UserPaymentGatewayController);
//# sourceMappingURL=user_payment_gateway.controller.js.map