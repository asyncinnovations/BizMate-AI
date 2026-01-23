import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { AuthUsers } from "./auth/user.entity";
import { ChatgptModule } from "./chatgpt/chatgpt.module";
import { TemplatesModule } from "./templates/templates.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TemplateEntity } from "./templates/templates.entity";
import { TemplateFieldModule } from "./template_field/template_field.module";
import { TemplateFieldEntity } from "./template_field/template_field.entity";
import { InvoicesModule } from "./invoices/invoices.module";
import { InvoiceEntity } from "./invoices/invoices.entity";
import { UserPaymentGatewayModule } from "./user_payment_gateway/user_payment_gateway.module";
import { UserPaymentGatewayEntity } from "./user_payment_gateway/user_payment_gateway.entity";
import { AiReminderModule } from "./ai_reminder/ai_reminder.module";
import { AiReminder } from "./ai_reminder/ai_reminder.entity";
import { ClientListsModule } from "./client_lists/client_lists.module";
import { ClientList } from "./client_lists/client_lists.entity";
import { UserIntegrationModule } from "./user_integration/user_integration.module";
import { AiReplyHubChatModule } from "./ai_reply_hub_chat/ai_reply_hub_chat.module";
import { AiReplyHubChat } from "./ai_reply_hub_chat/ai_reply_hub_chat.entity";
import { ConfigModule } from "@nestjs/config";
import { UserBusinessInfoModule } from "./user_business_info/user_business_info.module";
import { UserBusinessInfo } from "./user_business_info/user_business_info.entity";
import { UserIntegration } from "./user_integration/user_integration.entity";
import { ComplianceAssistantModule } from "./compliance_assistant_chat/compliance_assistant_chat.module";
import { ComplianceHistoryModule } from "./compliance_history/compliance_history.module";
import { ComplianceDocumentsModule } from "./compliance_documents/compliance_documents.module";
import { ComplianceLicensingModule } from "./compliance_licensing/compliance_licensing.module";
import { ComplianceAssistantChat } from "./compliance_assistant_chat/compliance_assistant_chat.entity";
import { ComplianceDocument } from "./compliance_documents/compliance_documents.entity";
import { NotificationsModule } from "./notifications/notifications.module";
import { NotificationPreferencesModule } from "./notification_preferences/notification_preferences.module";
import { ComplianceLicense } from "./compliance_licensing/compliance_licensing.entity";
import { Notification } from "./notifications/notifications.entity";
import { NotificationPreference } from "./notification_preferences/notification_preferences.entity";
import { UserTwoFactorSettingsModule } from "./user_two_factor_settings/user_two_factor_settings.module";
import { TwoFactorOtpsModule } from "./two_factor_otps/two_factor_otps.module";
import { TwoFactorRecoveryCodesModule } from "./two_factor_recovery_codes/two_factor_recovery_codes.module";
import { SubscriptionModule } from "./subscription_plans/subscription_plans.module";
import { UserSubscriptionModule } from "./user_subscription/user_subscription.module";
import { SubscriptionPaymentsModule } from "./subscription_payments/subscription_payments.module";
import { WalletTransactionModule } from "./wallet_transaction/wallet_transaction.module";
import { UserTwoFactorSettings } from "./user_two_factor_settings/user_two_factor_settings.entity";
import { TwoFactorOTP } from "./two_factor_otps/two_factor_otps.entity";
import { TwoFactorRecoveryCode } from "./two_factor_recovery_codes/two_factor_recovery_codes.entity";
import { WalletTransaction } from "./wallet_transaction/wallet_transaction.entity";
import { SubscriptionPlan } from "./subscription_plans/subscription_plans.entity";
import { UserSubscription } from "./user_subscription/user_subscription.entity";
import { SubscriptionPayment } from "./subscription_payments/subscription_payments.entity";
import { UserSessionsModule } from './user_sessions/user_sessions.module';
import { UserSession } from "./user_sessions/user_sessions.entity";
import { SubscriptionUsageModule } from './subscription_usage/subscription_usage.module';
import { ImportService } from './import/import.service';

@Module({
  controllers: [],
  providers: [ImportService],
  exports: [],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "BizMateAI",
      signOptions: { expiresIn: "1d" },
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [
        AuthUsers,
        TemplateEntity,
        TemplateFieldEntity,
        InvoiceEntity,
        UserPaymentGatewayEntity,
        AiReminder,
        ClientList,
        AiReplyHubChat,
        UserBusinessInfo,
        UserIntegration,
        ComplianceAssistantChat,
        ComplianceDocument,
        ComplianceLicense,
        Notification,
        NotificationPreference,
        UserTwoFactorSettings,
        TwoFactorOTP,
        TwoFactorRecoveryCode,
        WalletTransaction,
        SubscriptionPlan,
        UserSubscription,
        SubscriptionPayment,UserSession
      ],
    }),
    AuthModule,
    ChatgptModule,
    TemplatesModule,
    TemplateFieldModule,
    InvoicesModule,
    UserPaymentGatewayModule,
    AiReminderModule,
    ClientListsModule,
    UserIntegrationModule,
    AiReplyHubChatModule,
    UserBusinessInfoModule,
    ComplianceAssistantModule,
    ComplianceHistoryModule,
    ComplianceDocumentsModule,
    ComplianceLicensingModule,
    NotificationsModule,
    NotificationPreferencesModule,
    UserTwoFactorSettingsModule,
    TwoFactorOtpsModule,
    TwoFactorRecoveryCodesModule,
    SubscriptionModule,
    UserSubscriptionModule,
    SubscriptionPaymentsModule,
    WalletTransactionModule,
    UserSessionsModule,
    SubscriptionUsageModule,
  ],
})
export class AppModule {}
