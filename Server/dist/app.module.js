"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const user_entity_1 = require("./auth/user.entity");
const chatgpt_module_1 = require("./chatgpt/chatgpt.module");
const templates_module_1 = require("./templates/templates.module");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const templates_entity_1 = require("./templates/templates.entity");
const template_field_module_1 = require("./template_field/template_field.module");
const template_field_entity_1 = require("./template_field/template_field.entity");
const invoices_module_1 = require("./invoices/invoices.module");
const invoices_entity_1 = require("./invoices/invoices.entity");
const user_payment_gateway_module_1 = require("./user_payment_gateway/user_payment_gateway.module");
const user_payment_gateway_entity_1 = require("./user_payment_gateway/user_payment_gateway.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [],
        exports: [],
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || "BizMateAI",
                signOptions: { expiresIn: "1d" },
            }),
            templates_module_1.TemplatesModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: process.env.DB_HOST,
                port: 5432,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [
                    user_entity_1.AuthUsers,
                    templates_entity_1.TemplateEntity,
                    template_field_entity_1.TemplateFieldEntity,
                    invoices_entity_1.InvoiceEntity,
                    user_payment_gateway_entity_1.UserPaymentGatewayEntity,
                ],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            chatgpt_module_1.ChatgptModule,
            templates_module_1.TemplatesModule,
            template_field_module_1.TemplateFieldModule,
            invoices_module_1.InvoicesModule,
            user_payment_gateway_module_1.UserPaymentGatewayModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map