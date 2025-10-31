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

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "BizMateAI",
      signOptions: { expiresIn: "1d" },
    }),
    TemplatesModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "monabbirhasan",
      database: "bizmate",
      entities: [
        AuthUsers,
        TemplateEntity,
        TemplateFieldEntity,
        InvoiceEntity,
      ],
      synchronize: true,
    }),
    AuthModule,
    ChatgptModule,
    TemplatesModule,
    TemplateFieldModule,
    InvoicesModule,
  ],
})
export class AppModule {}
