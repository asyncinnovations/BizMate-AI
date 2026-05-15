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
  UseGuards,
  BadRequestException,
  HttpStatus,
  HttpCode,
  HttpException,
} from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { InvoiceEntity } from "./invoices.entity";
import { JwtGuard } from "src/guards/auth/auth.guard";
import { join } from "node:path";
import { PdfService } from "src/services/PdfService";
import { EmailService } from "src/services/EmailService";
import { UserPaymentGatewayService } from "src/user_payment_gateway/user_payment_gateway.service";

@Controller("invoices")
// @UseGuards(JwtGuard)
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService,
    private readonly upgService: UserPaymentGatewayService,
  ) {}
  ///////////////////////////////////////////
  // CREATE INVOICE
  ///////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_invoice(
    @Body() data: Partial<InvoiceEntity> | (any & { items?: any[] }),
  ) {
    // validation
    if (!data.customer_name || typeof data.customer_name !== "string") {
      throw new BadRequestException(
        "Customer name is required and must be a string.",
      );
    }
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new BadRequestException("Invoice items are required.");
    }
    ////////////////////////////////////////////////////////
    // GATEWAY CHECKING
    ////////////////////////////////////////////////////////
    await this.upgService.user_active_gateway_service(
      data.user_id,
      data.gateway_name,
    );

    const invoiceData = {
      user_id: data.user_id || null,
      invoice_number: data.invoice_number,
      invoice_name: data.invoice_name || null,
      invoice_type: data.invoice_type || null,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_address: data.customer_address,
      invoice_date: data.invoice_date,
      due_date: data.due_date,
      payment_terms: data.payment_terms,
      subtotal: data.subtotal,
      vat: data.vat,
      total: data.total,
      notes: data.notes,
      status: data.status,
      custom_fields: data.custom_fields,
      invoice_items: data.invoice_items || data?.items,
    };
    const response =
      await this.invoicesService.create_invoice_service(invoiceData);
    // generate invoice pdf at creation time
    const filename = `${Math.floor(Number(new Date()) * Math.random())}-invoice_preview.pdf`;
    const filePath = join(__dirname, `../../public/uploads/${filename}`);
    const result: any = await this.pdfService.InvoicePDFGenerator(
      invoiceData,
      filePath,
    );
    const url = `/public/uploads/${filename}`;
    this.invoicesService.set_invoice_pdf_path_service(url, response.uuid);
    // return { response: "Invoice PDF Generated", success: true, url, result };
    return {
      message: "Invoice created successfully",
      invoice: { ...response, invoice_pdf: url },
    };
  }

  //================================
  // GENERATE AI INVOICES
  //================================
  @Post("generate_invoice")
  @HttpCode(HttpStatus.CREATED)
  async generate_ai_invoice(@Body() body: { prompt: string }) {
    if (!body.prompt) {
      throw new BadRequestException("Invoice prompt is required.");
    }
    return await this.invoicesService.generate_ai_invoice_service(body.prompt);
  }
  ///////////////////////////////////////////
  // GET ALL USER INVOICES
  ///////////////////////////////////////////
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_invoices(@Param("user_id") user_id: string) {
    if (!user_id) {
      throw new BadRequestException("Invoice user id is required.");
    }
    return await this.invoicesService.user_invoices_service(user_id);
  }
  // //================================
  // // UPDATE INVOICE PDF PATH
  // //================================
  // @Put("invoice_pdf")
  // @HttpCode(HttpStatus.OK)
  // async set_invoice_pdf_path(@Param("user_id") user_id: string) {
  //   if (!user_id) {
  //     throw new BadRequestException("Invoice user id is required.");
  //   }
  //   return await this.invoicesService.user_invoices_service(user_id);
  // }

  //====================
  // GET ALL INVOICES
  //====================
  @Get("prebuild")
  @HttpCode(HttpStatus.OK)
  async get_prebuild_invoice_template() {
    try {
      const response =
        await this.invoicesService.get_prebuild_invoice_template_service();
      return { message: "notification send success", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  ///////////////////////////////////////////
  // GET ALL INVOICES
  ///////////////////////////////////////////
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_invoices(
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("user_id") user_id?: string,
  ) {
    // at least one filter or allow all
    if (status && typeof status !== "string") {
      throw new BadRequestException("Invalid status value.");
    }

    return await this.invoicesService.all_invoices_service({
      search,
      status,
      user_id,
    });
  }

  /////////////////////////////////////////////////////////////////////////
  // GET SINGLE INVOICE BY ID OR UUID
  /////////////////////////////////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async single_invoice(@Param("id") id: string) {
    if (!id) throw new BadRequestException("Invoice identifier is required.");
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.single_invoice_service(parsedId);
  }

  ///////////////////////////////////////////
  // UPDATE INVOICE
  ///////////////////////////////////////////
  @Put("update/:id")
  @HttpCode(HttpStatus.OK)
  async update_invoice(
    @Param("id") id: string,
    @Body() data: Partial<InvoiceEntity>,
  ) {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException("No data provided to update invoice.");
    }

    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.update_invoice_service(parsedId, data);
  }

  //////////////////////////////////////////////////
  // UPDATE CUSTOM FIELDS
  //////////////////////////////////////////////////
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
    return await this.invoicesService.update_custom_field_service(
      parsedId,
      customFields,
    );
  }

  ///////////////////////////////////////////
  // DELETE INVOICE
  ///////////////////////////////////////////
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_invoice(@Param("id") id: string) {
    if (!id) throw new BadRequestException("Invoice ID or UUID is required.");
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.delete_invoices_service(parsedId);
  }

  ///////////////////////////////////////////
  // CHANGE INVOICE STATUS
  ///////////////////////////////////////////
  @Patch("update/status/:id")
  @HttpCode(HttpStatus.OK)
  async update_status(@Param("id") id: string, @Body("status") status: string) {
    if (!status || typeof status !== "string") {
      throw new BadRequestException("Status is required and must be a string.");
    }

    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.update_invoice_status_service(
      parsedId,
      status,
    );
  }

  ///////////////////////////////////////////
  // COMPUTE TOTALS
  ///////////////////////////////////////////
  @Post("compute-totals")
  @HttpCode(HttpStatus.OK)
  async compute_totals(
    @Body("subtotal") subtotal: number,
    @Body("vatRate") vatRate: number,
  ) {
    if (subtotal === undefined || isNaN(Number(subtotal))) {
      throw new BadRequestException(
        "Subtotal is required and must be numeric.",
      );
    }

    if (vatRate === undefined || isNaN(Number(vatRate))) {
      throw new BadRequestException(
        "VAT rate is required and must be numeric.",
      );
    }

    return await this.invoicesService.total_inovices_service(subtotal, vatRate);
  }

  //////////////////////////////////////////////
  // PREVIEW DOCUMENT
  //////////////////////////////////////////////
  @Post("preview")
  @HttpCode(HttpStatus.OK)
  async preview_invoice(@Body() body: any) {
    const filename = `${Math.floor(Number(new Date()) * Math.random())}-invoice_preview.pdf`;
    const filePath = join(__dirname, `../../public/uploads/${filename}`);
    const result: any = await this.pdfService.InvoicePDFGenerator(
      body,
      filePath,
    );
    const url = `/public/uploads/${filename}`;
    return { response: "Invoice PDF Generated", success: true, url, result };
  }

  //////////////////////////////////////////////////
  // SEND INVOICE TO EMAIL
  //////////////////////////////////////////////////
  @Post("send_to_email")
  @HttpCode(HttpStatus.OK)
  async send_invoice_to_email(
    @Body()
    body: {
      invoiceId: string;
      to: string;
      cc: string;
      subject: string;
      message: string;
      send_at: string;
    },
  ) {
    const response = await this.emailService.send_email(body);
    return { message: "email send success", response };
  }
}
