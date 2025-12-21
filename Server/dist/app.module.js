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
const jwt_1 = require("@nestjs/jwt");
const templates_entity_1 = require("./templates/templates.entity");
const template_field_module_1 = require("./template_field/template_field.module");
const template_field_entity_1 = require("./template_field/template_field.entity");
const invoices_module_1 = require("./invoices/invoices.module");
const invoices_entity_1 = require("./invoices/invoices.entity");
const user_payment_gateway_module_1 = require("./user_payment_gateway/user_payment_gateway.module");
const user_payment_gateway_entity_1 = require("./user_payment_gateway/user_payment_gateway.entity");
const ai_reminder_module_1 = require("./ai_reminder/ai_reminder.module");
const ai_reminder_entity_1 = require("./ai_reminder/ai_reminder.entity");
const client_lists_module_1 = require("./client_lists/client_lists.module");
const client_lists_entity_1 = require("./client_lists/client_lists.entity");
const user_integration_module_1 = require("./user_integration/user_integration.module");
const ai_reply_hub_chat_module_1 = require("./ai_reply_hub_chat/ai_reply_hub_chat.module");
const ai_reply_hub_chat_entity_1 = require("./ai_reply_hub_chat/ai_reply_hub_chat.entity");
const config_1 = require("@nestjs/config");
const user_business_info_module_1 = require("./user_business_info/user_business_info.module");
const user_business_info_entity_1 = require("./user_business_info/user_business_info.entity");
const user_integration_entity_1 = require("./user_integration/user_integration.entity");
const compliance_assistant_chat_module_1 = require("./compliance_assistant_chat/compliance_assistant_chat.module");
const compliance_history_module_1 = require("./compliance_history/compliance_history.module");
const compliance_documents_module_1 = require("./compliance_documents/compliance_documents.module");
const compliance_licensing_module_1 = require("./compliance_licensing/compliance_licensing.module");
const compliance_assistant_chat_entity_1 = require("./compliance_assistant_chat/compliance_assistant_chat.entity");
const compliance_documents_entity_1 = require("./compliance_documents/compliance_documents.entity");
const notifications_module_1 = require("./notifications/notifications.module");
const notification_preferences_module_1 = require("./notification_preferences/notification_preferences.module");
const compliance_licensing_entity_1 = require("./compliance_licensing/compliance_licensing.entity");
const notifications_entity_1 = require("./notifications/notifications.entity");
const notification_preferences_entity_1 = require("./notification_preferences/notification_preferences.entity");
const user_two_factor_settings_module_1 = require("./user_two_factor_settings/user_two_factor_settings.module");
const two_factor_otps_module_1 = require("./two_factor_otps/two_factor_otps.module");
const two_factor_recovery_codes_module_1 = require("./two_factor_recovery_codes/two_factor_recovery_codes.module");
const subscription_plans_module_1 = require("./subscription_plans/subscription_plans.module");
const user_subscription_module_1 = require("./user_subscription/user_subscription.module");
const subscription_payments_module_1 = require("./subscription_payments/subscription_payments.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [],
        exports: [],
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || "BizMateAI",
                signOptions: { expiresIn: "1d" },
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: process.env.DB_HOST,
                port: 5432,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                synchronize: true,
                entities: [
                    user_entity_1.AuthUsers,
                    templates_entity_1.TemplateEntity,
                    template_field_entity_1.TemplateFieldEntity,
                    invoices_entity_1.InvoiceEntity,
                    user_payment_gateway_entity_1.UserPaymentGatewayEntity,
                    ai_reminder_entity_1.AiReminder,
                    client_lists_entity_1.ClientList,
                    ai_reply_hub_chat_entity_1.AiReplyHubChat,
                    user_business_info_entity_1.UserBusinessInfo,
                    user_integration_entity_1.UserIntegration,
                    compliance_assistant_chat_entity_1.ComplianceAssistantChat,
                    compliance_documents_entity_1.ComplianceDocument,
                    compliance_licensing_entity_1.ComplianceLicense,
                    notifications_entity_1.Notification,
                    notification_preferences_entity_1.NotificationPreference,
                ],
            }),
            auth_module_1.AuthModule,
            chatgpt_module_1.ChatgptModule,
            templates_module_1.TemplatesModule,
            template_field_module_1.TemplateFieldModule,
            invoices_module_1.InvoicesModule,
            user_payment_gateway_module_1.UserPaymentGatewayModule,
            ai_reminder_module_1.AiReminderModule,
            client_lists_module_1.ClientListsModule,
            user_integration_module_1.UserIntegrationModule,
            ai_reply_hub_chat_module_1.AiReplyHubChatModule,
            user_business_info_module_1.UserBusinessInfoModule,
            compliance_assistant_chat_module_1.ComplianceAssistantModule,
            compliance_history_module_1.ComplianceHistoryModule,
            compliance_documents_module_1.ComplianceDocumentsModule,
            compliance_licensing_module_1.ComplianceLicensingModule,
            notifications_module_1.NotificationsModule,
            notification_preferences_module_1.NotificationPreferencesModule,
            user_two_factor_settings_module_1.UserTwoFactorSettingsModule,
            two_factor_otps_module_1.TwoFactorOtpsModule,
            two_factor_recovery_codes_module_1.TwoFactorRecoveryCodesModule,
            subscription_plans_module_1.SubscriptionModule,
            user_subscription_module_1.UserSubscriptionModule,
            subscription_payments_module_1.SubscriptionPaymentsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map