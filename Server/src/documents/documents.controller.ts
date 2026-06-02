// src/documents/documents.controller.ts
// NEW CONTROLLER — all generated document endpoints.
// Postman collection in POSTMAN_COLLECTION.json covers every route.

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { PdfService }       from "src/services/PdfService";
import { join }             from "node:path";
import { DocumentSource }   from "./documents.entity";

@Controller("documents")
// @UseGuards(JwtGuard)  // un-comment when auth is wired
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly pdfService: PdfService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // CREATE DOCUMENT FROM TEMPLATE FORM
  // POST /documents/create
  // Body: { user_id, template_id?, document_name, category?, document_type?,
  //         field_values, content?, source? }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_document(@Body() body: any) {
    if (!body.user_id)        throw new BadRequestException("user_id is required.");
    if (!body.document_name)  throw new BadRequestException("document_name is required.");
    if (!body.field_values || typeof body.field_values !== "object") {
      throw new BadRequestException("field_values must be a valid JSON object.");
    }

    const doc = await this.documentsService.create_document_service({
      user_id:       body.user_id,
      template_id:   body.template_id   ?? null,
      document_name: body.document_name,
      category:      body.category       ?? null,
      document_type: body.document_type  ?? null,
      field_values:  body.field_values,
      content:       body.content        ?? null,
      source:        body.source         ?? DocumentSource.TEMPLATE,
    });

    return { message: "Document created successfully.", document: doc };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AI GENERATE DOCUMENT FROM PROMPT (does NOT save — returns draft for review)
  // POST /documents/ai-generate
  // Body: { user_id, prompt, document_type? }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("ai-generate")
  @HttpCode(HttpStatus.CREATED)
  async ai_generate_document(@Body() body: any) {
    if (!body.user_id) throw new BadRequestException("user_id is required.");
    if (!body.prompt)  throw new BadRequestException("prompt is required.");

    return await this.documentsService.ai_generate_document_service(
      body.user_id,
      body.prompt,
      body.document_type,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SAVE AI DOCUMENT AFTER USER REVIEW
  // POST /documents/ai-save
  // Body: { user_id, document_name, document_type?, category?,
  //         content, ai_prompt, field_values?, compliance_score?, compliance_notes? }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("ai-save")
  @HttpCode(HttpStatus.CREATED)
  async save_ai_document(@Body() body: any) {
    if (!body.user_id)       throw new BadRequestException("user_id is required.");
    if (!body.document_name) throw new BadRequestException("document_name is required.");
    if (!body.content)       throw new BadRequestException("content is required.");
    if (!body.ai_prompt)     throw new BadRequestException("ai_prompt is required.");

    const doc = await this.documentsService.save_ai_document_service(body);
    return { message: "AI document saved successfully.", document: doc };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET ALL DOCUMENTS FOR A USER (with optional filters)
  // GET /documents/user/:user_id?status=&category=&document_type=&search=
  // ─────────────────────────────────────────────────────────────────────────
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_documents(
    @Param("user_id")       user_id:       string,
    @Query("status")        status?:       string,
    @Query("category")      category?:     string,
    @Query("document_type") documentType?: string,
    @Query("search")        search?:       string,
  ) {
    if (!user_id) throw new BadRequestException("user_id is required.");

    const docs = await this.documentsService.user_documents_service(user_id, {
      status,
      category,
      document_type: documentType,
      search,
    });

    return {
      message: "Documents retrieved successfully.",
      count:   docs.length,
      data:    docs,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET RECENT DOCUMENTS (for dashboard sidebar — last 5 by default)
  // GET /documents/recent/:user_id?limit=5
  // ─────────────────────────────────────────────────────────────────────────
  @Get("recent/:user_id")
  @HttpCode(HttpStatus.OK)
  async recent_documents(
    @Param("user_id") user_id: string,
    @Query("limit")   limit?:  number,
  ) {
    if (!user_id) throw new BadRequestException("user_id is required.");
    const docs = await this.documentsService.recent_documents_service(
      user_id,
      Number(limit ?? 5),
    );
    return { message: "Recent documents retrieved.", data: docs };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET SINGLE DOCUMENT BY UUID
  // GET /documents/single/:uuid
  // ─────────────────────────────────────────────────────────────────────────
  @Get("single/:uuid")
  @HttpCode(HttpStatus.OK)
  async single_document(@Param("uuid") uuid: string) {
    if (!uuid) throw new BadRequestException("Document UUID is required.");
    const doc = await this.documentsService.single_document_service(uuid);
    return { message: "Document retrieved.", data: doc };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE DOCUMENT (field values, content, name, etc.)
  // PUT /documents/update/:uuid
  // ─────────────────────────────────────────────────────────────────────────
  @Put("update/:uuid")
  @HttpCode(HttpStatus.OK)
  async update_document(@Param("uuid") uuid: string, @Body() body: any) {
    if (!uuid) throw new BadRequestException("Document UUID is required.");
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException("No update data provided.");
    }
    const updated = await this.documentsService.update_document_service(uuid, body);
    return { message: "Document updated successfully.", data: updated };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE DOCUMENT STATUS — validates lifecycle + logs activity
  // PATCH /documents/status/:uuid
  // Body: { status: "draft"|"ai_generated"|"under_review"|"approved"|"finalised"|"archived" }
  // ─────────────────────────────────────────────────────────────────────────
  @Patch("status/:uuid")
  @HttpCode(HttpStatus.OK)
  async update_document_status(
    @Param("uuid")    uuid:   string,
    @Body("status")   status: string,
  ) {
    if (!uuid)   throw new BadRequestException("Document UUID is required.");
    if (!status) throw new BadRequestException("status is required.");

    return await this.documentsService.update_document_status_service(uuid, status);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DELETE DOCUMENT
  // DELETE /documents/delete/:uuid
  // ─────────────────────────────────────────────────────────────────────────
  @Delete("delete/:uuid")
  @HttpCode(HttpStatus.OK)
  async delete_document(@Param("uuid") uuid: string) {
    if (!uuid) throw new BadRequestException("Document UUID is required.");
    return await this.documentsService.delete_document_service(uuid);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DUPLICATE DOCUMENT — creates a draft copy
  // POST /documents/duplicate
  // Body: { document_uuid, user_id }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("duplicate")
  @HttpCode(HttpStatus.CREATED)
  async duplicate_document(@Body() body: { document_uuid: string; user_id: string }) {
    if (!body.document_uuid) throw new BadRequestException("document_uuid is required.");
    if (!body.user_id)       throw new BadRequestException("user_id is required.");

    return await this.documentsService.duplicate_document_service(
      body.document_uuid,
      body.user_id,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RUN AI COMPLIANCE CHECK ON A DOCUMENT (Pro/Enterprise)
  // POST /documents/compliance-check/:uuid
  // Returns: { compliance_score, compliance_notes[] }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("compliance-check/:uuid")
  @HttpCode(HttpStatus.OK)
  async run_compliance_check(@Param("uuid") uuid: string) {
    if (!uuid) throw new BadRequestException("Document UUID is required.");
    return await this.documentsService.run_compliance_check_service(uuid);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET AI DOCUMENT SUGGESTIONS for the sidebar (Pro/Enterprise)
  // GET /documents/ai-suggestions/:user_id
  // Returns: suggested next documents based on user's document history
  // ─────────────────────────────────────────────────────────────────────────
  @Get("ai-suggestions/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_ai_suggestions(@Param("user_id") user_id: string) {
    if (!user_id) throw new BadRequestException("user_id is required.");
    return await this.documentsService.get_ai_suggestions_service(user_id);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GENERATE PDF FOR A DOCUMENT
  // POST /documents/generate-pdf/:uuid
  // Generates the PDF, saves the path, returns the download URL
  // ─────────────────────────────────────────────────────────────────────────
  @Post("generate-pdf/:uuid")
  @HttpCode(HttpStatus.OK)
  async generate_pdf(@Param("uuid") uuid: string) {
    if (!uuid) throw new BadRequestException("Document UUID is required.");

    const doc      = await this.documentsService.single_document_service(uuid);
    const filename = `${Date.now()}-${uuid}-document.pdf`;
    const filePath = join(__dirname, `../../public/uploads/${filename}`);

    // Reuse the existing PdfService template PDF generator
    await this.pdfService.TemplatePDFGenerator(
      {
        template_name: doc.document_name,
        description:   doc.document_type ?? "",
        fields_schema: doc.field_values,
        content:       doc.content,
      },
      filePath,
    );

    const url = `/public/uploads/${filename}`;
    await this.documentsService.set_document_file_paths_service(uuid, { pdf_path: url });

    return { message: "PDF generated successfully.", url, uuid };
  }
}
