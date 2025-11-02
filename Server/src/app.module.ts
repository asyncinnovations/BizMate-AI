import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { AuthUsers } from "./auth/user.entity";
import { DocumentGenModule } from "./_document_gen/document_gen.module";
import { ChatgptModule } from "./chatgpt/chatgpt.module";
import { PrebuiltTemplatesModule } from "./_prebuilt_templates/prebuilt_templates.module";
import { PrebuiltTemplatesController } from "./_prebuilt_templates/prebuilt_templates.controller";
import { PrebuiltTemplatesService } from "./_prebuilt_templates/prebuilt_templates.service";
import { TemplatesModule } from "./templates/templates.module";
import { JwtStrategy } from "./auth/_jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TemplateEntity } from "./templates/templates.entity";
import { TemplateFieldModule } from "./template_field/template_field.module";
import { TemplateFieldEntity } from "./template_field/template_field.entity";

@Module({
  controllers: [PrebuiltTemplatesController],
  providers: [PrebuiltTemplatesService],
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
      entities: [AuthUsers, TemplateEntity, TemplateFieldEntity],
      synchronize: true,
    }),
    AuthModule,
    DocumentGenModule,
    ChatgptModule,
    PrebuiltTemplatesModule,
    TemplatesModule,
    TemplateFieldModule,
  ],
})
export class AppModule {}
