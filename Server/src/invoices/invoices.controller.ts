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
} from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { InvoiceEntity } from "./invoices.entity";
import { JwtGuard } from "src/guards/auth/auth.guard";

@Controller("invoices")
@UseGuards(JwtGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}
  ///////////////////////////////////////////
  // CREATE INVOICE
  ///////////////////////////////////////////
  @Post("/create")
  async create_invoice(
    @Body() data: Partial<InvoiceEntity> & { items?: any[] }
  ) {
    // validation
    if (!data.customer_name || typeof data.customer_name !== "string") {
      throw new BadRequestException(
        "Customer name is required and must be a string."
      );
    }
    if (!data.user_id) throw new BadRequestException("User ID is required.");
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new BadRequestException("Invoice items are required.");
    }

    const invoiceData = {
      user_id: data.user_id,
      invoice_number: data.invoice_number,
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
    return { message: "Invoice created successfully", invoice: response };
  }

  ///////////////////////////////////////////
  // GET ALL USER INVOICES
  ///////////////////////////////////////////
  @Get("/user/:user_id")
  async user_invoices(@Param("user_id") user_id: string) {
    if (!user_id) {
      throw new BadRequestException("Invoice user id is required.");
    }
    return await this.invoicesService.user_invoices_service(user_id);
  }

  ///////////////////////////////////////////
  // GET ALL INVOICES
  ///////////////////////////////////////////
  @Get("/all")
  async all_invoices(
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("user_id") user_id?: string
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
  @Get("/single/:id")
  async single_invoice(@Param("id") id: string) {
    if (!id) throw new BadRequestException("Invoice identifier is required.");
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.single_invoice_service(parsedId);
  }

  ///////////////////////////////////////////
  // UPDATE INVOICE
  ///////////////////////////////////////////
  @Put("/update/:id")
  async update_invoice(
    @Param("id") id: string,
    @Body() data: Partial<InvoiceEntity>
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
  @Patch("/update/:id/custom-fields")
  async update_custom_fields(
    @Param("id") id: string,
    @Body() customFields: Record<string, any>
  ) {
    if (!customFields || typeof customFields !== "object") {
      throw new BadRequestException("Custom fields must be a valid object.");
    }

    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.update_custom_field_service(
      parsedId,
      customFields
    );
  }

  ///////////////////////////////////////////
  // DELETE INVOICE
  ///////////////////////////////////////////
  @Delete("/delete/:id")
  async delete_invoice(@Param("id") id: string) {
    if (!id) throw new BadRequestException("Invoice ID or UUID is required.");
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.delete_invoices_service(parsedId);
  }

  ///////////////////////////////////////////
  // CHANGE INVOICE STATUS
  ///////////////////////////////////////////
  @Patch("/update/status/:id")
  async update_status(@Param("id") id: string, @Body("status") status: string) {
    if (!status || typeof status !== "string") {
      throw new BadRequestException("Status is required and must be a string.");
    }

    const parsedId = isNaN(Number(id)) ? id : Number(id);
    return await this.invoicesService.update_invoice_status_service(
      parsedId,
      status
    );
  }

  ///////////////////////////////////////////
  // COMPUTE TOTALS
  ///////////////////////////////////////////
  @Post("/compute-totals")
  async compute_totals(
    @Body("subtotal") subtotal: number,
    @Body("vatRate") vatRate: number
  ) {
    if (subtotal === undefined || isNaN(Number(subtotal))) {
      throw new BadRequestException(
        "Subtotal is required and must be numeric."
      );
    }

    if (vatRate === undefined || isNaN(Number(vatRate))) {
      throw new BadRequestException(
        "VAT rate is required and must be numeric."
      );
    }

    return await this.invoicesService.total_inovices_service(subtotal, vatRate);
  }
}
