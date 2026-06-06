// src/templates/templates.module.ts
// FIXED — added GPTService, PromptService, and ChatgptService to providers.
//
// Root cause: TemplatesController injects GPTService (index [3]) and
// PromptService (index [4]) in its constructor, but neither was listed
// in the module's providers array. NestJS cannot resolve a dependency
// that isn't declared as a provider (or imported from another module).
//
// Rule: every class injected via the constructor must appear in providers.

import { Module }            from "@nestjs/common";
import { TypeOrmModule }     from "@nestjs/typeorm";
import { TemplatesService }  from "./templates.service";
import { TemplatesController } from "./templates.controller";
import { TemplateEntity }    from "./templates.entity";
import { PdfService }        from "src/services/PdfService";
import { EmailService }      from "src/services/EmailService";
import { GPTService }        from "src/services/GPTService";        // ADDED
import { PromptService }     from "src/services/PromptService";     // ADDED
import { ChatgptService }    from "src/chatgpt/chatgpt.service";    // ADDED — GPTService depends on this

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [
    TemplatesService,
    PdfService,
    EmailService,
    GPTService,        // ADDED — required by TemplatesController constructor index [3]
    PromptService,     // ADDED — required by TemplatesController constructor index [4]
    ChatgptService,    // ADDED — GPTService internally depends on ChatgptService
  ],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
