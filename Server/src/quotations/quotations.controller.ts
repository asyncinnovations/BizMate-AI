// src/quotations/quotations.controller.ts

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
import { QuotationsService } from "./quotations.service";
import { InvoicesService }   from "src/invoices/invoices.service";
import { EmailService }      from "src/services/EmailService";
import { PdfService }        from "src/services/PdfService";
import { QuotationSource }   from "./quotations.entity";
import { join }              from "node:path";

@Controller("quotations")
// @UseGuards(JwtGuard)  // un-comment when auth is wired
export class QuotationsController {
  constructor(
    private readonly quotationsService: QuotationsService,
    private readonly invoicesService:   InvoicesService,
    private readonly emailService:      EmailService,
    private readonly pdfService:        PdfService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // CREATE QUOTATION (from form)
  // POST /quotations/create
  // Body: { user_id, client_name, line_items[], issue_date, expiry_date, ... }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_quotation(@Body() body: any) {
    if (!body.user_id)    throw new BadRequestException("user_id is required.");
    if (!body.client_name) throw new BadRequestException("client_name is required.");
    if (!body.issue_date)  throw new BadRequestException("issue_date is required.");
    if (!body.expiry_date) throw new BadRequestException("expiry_date is required.");
    if (!body.line_items || !Array.isArray(body.line_items) || body.line_items.length === 0) {
      throw new BadRequestException("line_items array is required and must not be empty.");
    }

    const quotation = await this.quotationsService.create_quotation_service({
      user_id:              body.user_id,
      project_title:        body.project_title,
      description:          body.description,
      client_id:            body.client_id,
      client_name:          body.client_name,
      client_email:         body.client_email,
      client_address:       body.client_address,
      client_phone:         body.client_phone,
      currency:             body.currency,
      line_items:           body.line_items,
      issue_date:           body.issue_date,
      expiry_date:          body.expiry_date,
      terms_and_conditions: body.terms_and_conditions,
      notes:                body.notes,
      source:               body.source as QuotationSource,
    });

    return { message: "Quotation created successfully.", quotation };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AI GENERATE QUOTATION (prompt → draft — does NOT save)
  // POST /quotations/ai-generate
  // Body: { user_id, prompt }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("ai-generate")
  @HttpCode(HttpStatus.CREATED)
  async ai_generate_quotation(@Body() body: { user_id: string; prompt: string }) {
    if (!body.user_id) throw new BadRequestException("user_id is required.");
    if (!body.prompt)  throw new BadRequestException("prompt is required.");

    return await this.quotationsService.ai_generate_quotation_service(
      body.user_id,
      body.prompt,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SAVE AI QUOTATION AFTER USER REVIEW
  // POST /quotations/ai-save
  // Body: same as create but with ai_prompt field
  // ─────────────────────────────────────────────────────────────────────────
  @Post("ai-save")
  @HttpCode(HttpStatus.CREATED)
  async ai_save_quotation(@Body() body: any) {
    if (!body.user_id)    throw new BadRequestException("user_id is required.");
    if (!body.client_name) throw new BadRequestException("client_name is required.");
    if (!body.ai_prompt)  throw new BadRequestException("ai_prompt is required.");
    if (!body.line_items || !Array.isArray(body.line_items) || body.line_items.length === 0) {
      throw new BadRequestException("line_items array is required.");
    }

    const quotation = await this.quotationsService.ai_save_quotation_service(body);
    return { message: "AI quotation saved successfully.", quotation };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET ALL QUOTATIONS FOR A USER
  // GET /quotations/user/:user_id?status=&search=&currency=
  // ─────────────────────────────────────────────────────────────────────────
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_quotations(
    @Param("user_id")  user_id:  string,
    @Query("status")   status?:  string,
    @Query("search")   search?:  string,
    @Query("currency") currency?: string,
  ) {
    if (!user_id) throw new BadRequestException("user_id is required.");

    const data = await this.quotationsService.user_quotations_service(user_id, {
      status, search, currency,
    });

    return { message: "Quotations retrieved successfully.", count: data.length, data };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET RECENT QUOTATIONS (lightweight — dashboard sidebar)
  // GET /quotations/recent/:user_id?limit=5
  // ─────────────────────────────────────────────────────────────────────────
  @Get("recent/:user_id")
  @HttpCode(HttpStatus.OK)
  async recent_quotations(
    @Param("user_id") user_id: string,
    @Query("limit")   limit?:  number,
  ) {
    if (!user_id) throw new BadRequestException("user_id is required.");
    const data = await this.quotationsService.recent_quotations_service(
      user_id,
      Number(limit ?? 5),
    );
    return { message: "Recent quotations retrieved.", data };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET SINGLE QUOTATION BY UUID
  // GET /quotations/single/:uuid
  // ─────────────────────────────────────────────────────────────────────────
  @Get("single/:uuid")
  @HttpCode(HttpStatus.OK)
  async single_quotation(@Param("uuid") uuid: string) {
    if (!uuid) throw new BadRequestException("Quotation UUID is required.");
    const data = await this.quotationsService.single_quotation_service(uuid);
    return { message: "Quotation retrieved.", data };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET QUOTATION VIA PUBLIC TOKEN (client-facing — no auth required)
  // GET /quotations/public/:token
  // Also auto-marks as "viewed" on first open.
  // ─────────────────────────────────────────────────────────────────────────
  @Get("public/:token")
  @HttpCode(HttpStatus.OK)
  async get_public_quotation(@Param("token") token: string) {
    if (!token) throw new BadRequestException("Token is required.");
    const data = await this.quotationsService.get_quotation_by_token_service(token);
    return { message: "Quotation retrieved.", data };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE QUOTATION (full update)
  // PUT /quotations/update/:uuid
  // ─────────────────────────────────────────────────────────────────────────
  @Put("update/:uuid")
  @HttpCode(HttpStatus.OK)
  async update_quotation(@Param("uuid") uuid: string, @Body() body: any) {
    if (!uuid) throw new BadRequestException("Quotation UUID is required.");
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException("No update data provided.");
    }
    const updated = await this.quotationsService.update_quotation_service(uuid, body);
    return { message: "Quotation updated successfully.", data: updated };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE QUOTATION STATUS
  // PATCH /quotations/status/:uuid
  // Body: { status: "draft"|"sent"|"viewed"|"accepted"|"rejected"|"expired"|"converted"|"archived" }
  // ─────────────────────────────────────────────────────────────────────────
  @Patch("status/:uuid")
  @HttpCode(HttpStatus.OK)
  async update_status(
    @Param("uuid")    uuid:    string,
    @Body("status")   status:  string,
    @Body("actor")    actor?:  string,
  ) {
    if (!uuid)   throw new BadRequestException("Quotation UUID is required.");
    if (!status) throw new BadRequestException("status is required.");
    return await this.quotationsService.update_quotation_status_service(uuid, status, actor);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SEND QUOTATION TO CLIENT (generates public token, sets status = "sent")
  // POST /quotations/send/:uuid
  // Body: { email_to?, email_subject?, email_message? } — all optional
  //       If email fields are provided, the quotation is also emailed.
  // ─────────────────────────────────────────────────────────────────────────
  @Post("send/:uuid")
  @HttpCode(HttpStatus.OK)
  async send_quotation(
    @Param("uuid") uuid: string,
    @Body() body: {
      email_to?:      string;
      email_subject?: string;
      email_message?: string;
    },
  ) {
    if (!uuid) throw new BadRequestException("Quotation UUID is required.");

    const result = await this.quotationsService.send_quotation_service(uuid);

    // Send email if recipient provided
    if (body?.email_to) {
      const q = await this.quotationsService.single_quotation_service(uuid);
      await this.emailService.send_email({
        to:      body.email_to,
        subject: body.email_subject ?? `Quotation ${q.quotation_number} from BizMate`,
        message: body.email_message
          ?? `Please review the attached quotation.\n\nView online: ${result.public_url}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
            <div style="background:#4f46e5;color:white;padding:16px;text-align:center">
              <h2 style="margin:0">Quotation ${q.quotation_number}</h2>
              <p style="margin:4px 0 0;font-size:14px;opacity:0.85">${q.project_title ?? ""}</p>
            </div>
            <div style="padding:20px">
              <p>Dear ${q.client_name},</p>
              <p>Please find your quotation for <strong>${q.project_title ?? "the project"}</strong>.</p>
              <p style="font-size:22px;font-weight:bold;color:#4f46e5">${q.currency} ${Number(q.grand_total).toLocaleString()}</p>
              <p>Valid until: ${new Date(q.expiry_date).toLocaleDateString("en-AE")}</p>
              <div style="text-align:center;margin:24px 0">
                <a href="${result.public_url}" style="background:#4f46e5;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold">View Quotation</a>
              </div>
              <p style="font-size:12px;color:#888">BizMate AI — Smart Business Operating System</p>
            </div>
          </div>
        `,
      });
    }

    return {
      ...result,
      email_sent: !!body?.email_to,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CLIENT ACTION — accept / reject / comment via public token
  // POST /quotations/client-action/:token
  // Body: { action: "accept"|"reject"|"comment", comment? }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("client-action/:token")
  @HttpCode(HttpStatus.OK)
  async client_action(
    @Param("token")  token:  string,
    @Body("action")  action: "accept" | "reject" | "comment",
    @Body("comment") comment?: string,
  ) {
    if (!token)  throw new BadRequestException("Token is required.");
    if (!action) throw new BadRequestException('action is required: "accept", "reject", or "comment".');
    if (!["accept", "reject", "comment"].includes(action)) {
      throw new BadRequestException('action must be "accept", "reject", or "comment".');
    }
    return await this.quotationsService.client_action_service(token, action, comment);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CONVERT QUOTATION TO INVOICE
  // POST /quotations/convert-to-invoice
  // Body: { quotation_uuid, user_id }
  // Flow: 1. Build invoice data from quotation
  //        2. Create invoice via invoices service
  //        3. Mark quotation as converted + link invoice UUID
  // ─────────────────────────────────────────────────────────────────────────
  @Post("convert-to-invoice")
  @HttpCode(HttpStatus.CREATED)
  async convert_to_invoice(
    @Body() body: { quotation_uuid: string; user_id: string },
  ) {
    if (!body.quotation_uuid) throw new BadRequestException("quotation_uuid is required.");
    if (!body.user_id)        throw new BadRequestException("user_id is required.");

    // Step 1: Get invoice data from the quotation
    const conversion = await this.quotationsService.convert_to_invoice_service(
      body.quotation_uuid,
      body.user_id,
    );

    // Step 2: Create the invoice using the existing invoices service
    const invoice = await this.invoicesService.create_invoice_service(
      conversion.invoice_data as any,
    );

    // Step 3: Mark the quotation as converted + store the new invoice UUID
    await this.quotationsService.mark_as_converted_service(
      body.quotation_uuid,
      invoice.uuid,
    );

    return {
      message:        "Quotation converted to invoice successfully.",
      quotation_uuid: body.quotation_uuid,
      invoice_uuid:   invoice.uuid,
      invoice_number: invoice.invoice_number,
      invoice,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GENERATE PDF FOR A QUOTATION
  // POST /quotations/generate-pdf/:uuid
  // ─────────────────────────────────────────────────────────────────────────
  @Post("generate-pdf/:uuid")
  @HttpCode(HttpStatus.OK)
  async generate_pdf(@Param("uuid") uuid: string) {
    if (!uuid) throw new BadRequestException("Quotation UUID is required.");

    const q        = await this.quotationsService.single_quotation_service(uuid);
    const filename = `${Date.now()}-${uuid}-quotation.pdf`;
    const filePath = join(__dirname, `../../public/uploads/${filename}`);

    await this.pdfService.TemplatePDFGenerator(
      {
        template_name: q.quotation_number,
        description:   q.project_title ?? "",
        fields_schema: {
          client_name:   q.client_name,
          grand_total:   `${q.currency} ${Number(q.grand_total).toLocaleString()}`,
          issue_date:    q.issue_date,
          expiry_date:   q.expiry_date,
        },
        items: q.line_items,
      },
      filePath,
    );

    const url = `/public/uploads/${filename}`;
    await this.quotationsService.set_pdf_path_service(uuid, url);

    return { message: "PDF generated successfully.", url, uuid };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DUPLICATE QUOTATION
  // POST /quotations/duplicate
  // Body: { quotation_uuid, user_id }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("duplicate")
  @HttpCode(HttpStatus.CREATED)
  async duplicate_quotation(
    @Body() body: { quotation_uuid: string; user_id: string },
  ) {
    if (!body.quotation_uuid) throw new BadRequestException("quotation_uuid is required.");
    if (!body.user_id)        throw new BadRequestException("user_id is required.");

    return await this.quotationsService.duplicate_quotation_service(
      body.quotation_uuid,
      body.user_id,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LINK DOCUMENT to a quotation
  // POST /quotations/link-document
  // Body: { quotation_uuid, document_uuid, document_type, document_name }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("link-document")
  @HttpCode(HttpStatus.OK)
  async link_document(@Body() body: {
    quotation_uuid: string;
    document_uuid:  string;
    document_type:  string;
    document_name:  string;
  }) {
    if (!body.quotation_uuid) throw new BadRequestException("quotation_uuid is required.");
    if (!body.document_uuid)  throw new BadRequestException("document_uuid is required.");
    if (!body.document_type)  throw new BadRequestException("document_type is required.");
    if (!body.document_name)  throw new BadRequestException("document_name is required.");

    return await this.quotationsService.link_document_service(body.quotation_uuid, {
      document_uuid: body.document_uuid,
      document_type: body.document_type,
      document_name: body.document_name,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UNLINK DOCUMENT from a quotation
  // DELETE /quotations/unlink-document
  // Body: { quotation_uuid, document_uuid }
  // ─────────────────────────────────────────────────────────────────────────
  @Delete("unlink-document")
  @HttpCode(HttpStatus.OK)
  async unlink_document(@Body() body: {
    quotation_uuid: string;
    document_uuid:  string;
  }) {
    if (!body.quotation_uuid) throw new BadRequestException("quotation_uuid is required.");
    if (!body.document_uuid)  throw new BadRequestException("document_uuid is required.");

    return await this.quotationsService.unlink_document_service(
      body.quotation_uuid,
      body.document_uuid,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET AI SUGGESTIONS for the Pro sidebar
  // GET /quotations/ai-suggestions/:user_id
  // ─────────────────────────────────────────────────────────────────────────
  @Get("ai-suggestions/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_ai_suggestions(@Param("user_id") user_id: string) {
    if (!user_id) throw new BadRequestException("user_id is required.");
    return await this.quotationsService.get_ai_suggestions_service(user_id);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DELETE QUOTATION
  // DELETE /quotations/delete/:uuid
  // ─────────────────────────────────────────────────────────────────────────
  @Delete("delete/:uuid")
  @HttpCode(HttpStatus.OK)
  async delete_quotation(@Param("uuid") uuid: string) {
    if (!uuid) throw new BadRequestException("Quotation UUID is required.");
    return await this.quotationsService.delete_quotation_service(uuid);
  }
}
