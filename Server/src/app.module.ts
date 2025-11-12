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

@Module({
  controllers: [],
  providers: [],
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
  ],
})
export class AppModule {}
