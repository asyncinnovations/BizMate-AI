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
  BadRequestException,
  HttpStatus,
  HttpCode,
  HttpException,
} from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { InvoiceEntity } from "./invoices.entity";
import { join } from "node:path";
import { PdfService } from "src/services/PdfService";
import { EmailService } from "src/services/EmailService";
import { UserPaymentGatewayService } from "src/user_payment_gateway/user_payment_gateway.service";

@Controller("invoices")
// @UseGuards(JwtGuard)  // un-comment when auth is wired
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService,
    private readonly upgService: UserPaymentGatewayService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // CREATE INVOICE
  // POST /invoices/create
  // ─────────────────────────────────────────────────────────────────────────
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_invoice(
    @Body() data: Partial<InvoiceEntity> & { items?: any[]; gateway_name?: string },
  ) {
    if (!data.customer_name || typeof data.customer_name !== "string") {
      throw new BadRequestException("customer_name is required.");
    }
    if (!data.invoice_items && (!data.items || !Array.isArray(data.items) || data.items.length === 0)) {
      throw new BadRequestException("invoice_items are required.");
    }

    // Validate payment gateway if provided
    if (data.user_id && data.gateway_name) {
      await this.upgService.user_active_gateway_service(data.user_id, data.gateway_name);
    }

    const invoiceData = {
      user_id:          data.user_id || null,
      invoice_number:   data.invoice_number,
      invoice_name:     data.invoice_name || null,
      invoice_type:     data.invoice_type || null,
      customer_name:    data.customer_name,
      customer_email:   data.customer_email,
      customer_address: data.customer_address,
      invoice_date:     data.invoice_date,
      due_date:         data.due_date,
      payment_terms:    data.payment_terms,
      subtotal:         data.subtotal,
      vat:              data.vat,
      total:            data.total,
      notes:            data.notes,
      status:           data.status,
      source:           data.source,
      custom_fields:    data.custom_fields,
      invoice_items:    data.invoice_items || data.items,
    };

    const response = await this.invoicesService.create_invoice_service(invoiceData);

    // Generate PDF immediately on creation
    const filename = `${Math.floor(Number(new Date()) * Math.random())}-invoice.pdf`;
    const filePath = join(__dirname, `../../public/uploads/${filename}`);
    await this.pdfService.InvoicePDFGenerator(invoiceData, filePath);
    const url = `/public/uploads/${filename}`;
    await this.invoicesService.set_invoice_pdf_path_service(url, response.uuid);

    return {
      message: "Invoice created successfully",
      invoice: { ...response, invoice_pdf: url },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GENERATE AI INVOICE FROM PROMPT
  // POST /invoices/generate_invoice
  // Body: { prompt: string }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("generate_invoice")
  @HttpCode(HttpStatus.CREATED)
  async generate_ai_invoice(@Body() body: { prompt: string }) {
    if (!body.prompt || typeof body.prompt !== "string") {
      throw new BadRequestException("prompt is required.");
    }
    return await this.invoicesService.generate_ai_invoice_service(body.prompt);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET ALL INVOICES FOR A USER
  // GET /invoices/user/:user_id
  // ─────────────────────────────────────────────────────────────────────────
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_invoices(@Param("user_id") user_id: string) {
    if (!user_id) throw new BadRequestException("user_id is required.");
    return await this.invoicesService.user_invoices_service(user_id);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET PREBUILD TEMPLATES
  // GET /invoices/prebuild
  // ─────────────────────────────────────────────────────────────────────────
  @Get("prebuild")
  @HttpCode(HttpStatus.OK)
  async get_prebuild_invoice_template() {
    try {
      const response = await this.invoicesService.get_prebuild_invoice_template_service();
      return { message: "Templates retrieved successfully", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET ALL INVOICES (admin / search)
  // GET /invoices/all?search=&status=&user_id=
  // ─────────────────────────────────────────────────────────────────────────
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_invoices(
    @Query("search")  search?: string,
    @Query("status")  status?: string,
    @Query("user_id") user_id?: string,
  ) {
    if (status && typeof status !== "string") {
      throw new BadRequestException("Invalid status value.");
    }
    return await this.invoicesService.all_invoices_service({ search, status, user_id });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET SINGLE INVOICE
  // GET /invoices/single/:id
  // :id can be a UUID
  // ─────────────────────────────────────────────────────────────────────────
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async single_invoice(@Param("id") id: string) {
    if (!id) throw new BadRequestException("Invoice identifier is required.");
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.single_invoice_service(parsedId);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE INVOICE (full update)
  // PUT /invoices/update/:id
  // ─────────────────────────────────────────────────────────────────────────
  @Put("update/:id")
  @HttpCode(HttpStatus.OK)
  async update_invoice(
    @Param("id") id: string,
    @Body() data: Partial<InvoiceEntity>,
  ) {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException("No data provided to update.");
    }
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.update_invoice_service(parsedId, data);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE CUSTOM FIELDS ONLY
  // PATCH /invoices/update/:id/custom-fields
  // ─────────────────────────────────────────────────────────────────────────
  @Patch("update/:id/custom-fields")
  @HttpCode(HttpStatus.OK)
  async update_custom_fields(
    @Param("id") id: string,
    @Body() customFields: Record<string, any>,
  ) {
    if (!customFields || typeof customFields !== "object") {
      throw new BadRequestException("Custom fields must be a valid object.");
    }
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.update_custom_field_service(parsedId, customFields);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DELETE INVOICE
  // DELETE /invoices/delete/:id
  // ─────────────────────────────────────────────────────────────────────────
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_invoice(@Param("id") id: string) {
    if (!id) throw new BadRequestException("Invoice ID is required.");
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.delete_invoices_service(parsedId);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE STATUS — now supports full lifecycle
  // PATCH /invoices/update/status/:id
  // Body: { status: "draft" | "saved" | "sent" | "viewed" | "paid" | "unpaid" | "overdue" | "archived" }
  // Records the transition in activity_log automatically.
  // ─────────────────────────────────────────────────────────────────────────
  @Patch("update/status/:id")
  @HttpCode(HttpStatus.OK)
  async update_status(
    @Param("id") id: string,
    @Body("status") status: string,
  ) {
    if (!status || typeof status !== "string") {
      throw new BadRequestException("status is required.");
    }
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.update_invoice_status_service(parsedId, status);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTE TOTALS
  // POST /invoices/compute-totals
  // Body: { subtotal: number, vatRate: number }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("compute-totals")
  @HttpCode(HttpStatus.OK)
  async compute_totals(
    @Body("subtotal") subtotal: number,
    @Body("vatRate")  vatRate: number,
  ) {
    if (subtotal === undefined || isNaN(Number(subtotal))) {
      throw new BadRequestException("subtotal is required and must be numeric.");
    }
    if (vatRate === undefined || isNaN(Number(vatRate))) {
      throw new BadRequestException("vatRate is required and must be numeric.");
    }
    return await this.invoicesService.total_inovices_service(subtotal, vatRate);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PREVIEW / DOWNLOAD PDF
  // POST /invoices/preview
  // Body: invoice data object
  // ─────────────────────────────────────────────────────────────────────────
  @Post("preview")
  @HttpCode(HttpStatus.OK)
  async preview_invoice(@Body() body: any) {
    const filename = `${Math.floor(Number(new Date()) * Math.random())}-invoice_preview.pdf`;
    const filePath = join(__dirname, `../../public/uploads/${filename}`);
    const result: any = await this.pdfService.InvoicePDFGenerator(body, filePath);
    const url = `/public/uploads/${filename}`;
    return { response: "Invoice PDF Generated", success: true, url, result };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SEND INVOICE BY EMAIL
  // POST /invoices/send_to_email
  // Body: { invoiceId, to, cc, subject, message, send_at? }
  // ─────────────────────────────────────────────────────────────────────────
  @Post("send_to_email")
  @HttpCode(HttpStatus.OK)
  async send_invoice_to_email(
    @Body()
    body: {
      invoiceId: string;
      to: string;
      cc?: string;
      subject: string;
      message: string;
      send_at?: string;
    },
  ) {
    if (!body.invoiceId) throw new BadRequestException("invoiceId is required.");
    if (!body.to)        throw new BadRequestException("Recipient email is required.");

    const response = await this.emailService.send_email(body);

    // Auto-update invoice status to "sent" when email is dispatched
    try {
      await this.invoicesService.update_invoice_status_service(body.invoiceId, "sent");
    } catch {
      // Non-fatal — do not block the email response if status update fails
    }

    return { message: "Email sent successfully", response };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NEW — DUPLICATE INVOICE
  // POST /invoices/duplicate
  // Body: { invoice_id: string, user_id: string }
  // Creates a copy with a new number, draft status, and duplicate source tag.
  // ─────────────────────────────────────────────────────────────────────────
  @Post("duplicate")
  @HttpCode(HttpStatus.CREATED)
  async duplicate_invoice(
    @Body() body: { invoice_id: string; user_id: string },
  ) {
    if (!body.invoice_id) throw new BadRequestException("invoice_id is required.");
    if (!body.user_id)    throw new BadRequestException("user_id is required.");

    return await this.invoicesService.duplicate_invoice_service(
      body.invoice_id,
      body.user_id,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NEW — AI INSIGHTS FOR AN INVOICE (Pro / Enterprise plan)
  // GET /invoices/ai-insights/:invoice_id
  // Returns payment prediction, late payment risk, and suggested action.
  // Uses customer payment history from past invoices as context.
  // ─────────────────────────────────────────────────────────────────────────
  @Get("ai-insights/:invoice_id")
  @HttpCode(HttpStatus.OK)
  async get_ai_insights(@Param("invoice_id") invoice_id: string) {
    if (!invoice_id) throw new BadRequestException("invoice_id is required.");
    return await this.invoicesService.get_ai_insights_service(invoice_id);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NEW — AI SUGGESTIONS FOR THE CREATE FORM SIDEBAR (Pro / Enterprise plan)
  // GET /invoices/ai-suggestions?user_id=&customer_name=
  // Returns top services used for this customer + payment pattern + pricing tip.
  // ─────────────────────────────────────────────────────────────────────────
  @Get("ai-suggestions")
  @HttpCode(HttpStatus.OK)
  async get_ai_suggestions(
    @Query("user_id")       user_id: string,
    @Query("customer_name") customer_name: string,
  ) {
    if (!user_id)       throw new BadRequestException("user_id is required.");
    if (!customer_name) throw new BadRequestException("customer_name is required.");

    return await this.invoicesService.get_ai_suggestions_service(user_id, customer_name);
  }
}
