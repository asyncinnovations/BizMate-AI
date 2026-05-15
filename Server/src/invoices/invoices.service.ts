import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike, IsNull } from "typeorm";
import { InvoiceEntity } from "./invoices.entity";
import { PromptService } from "src/services/PromptService";
import { GPTService } from "src/services/GPTService";

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoicesRepo: Repository<InvoiceEntity>,
    private readonly openAIService: GPTService,
    private readonly promptservice: PromptService,
  ) {}

  ///////////////////////////////////////////
  // CREATE INVOICE
  ///////////////////////////////////////////
  async create_invoice_service(data: Partial<InvoiceEntity>) {
    const invoice = this.invoicesRepo.create(data);
    return await this.invoicesRepo.save(invoice);
  }
  //============================
  // UPDATE INVOICE PDF PATH
  //============================
  async set_invoice_pdf_path_service(path: string, uuid: string) {
    const RESULT = this.invoicesRepo.update(uuid, { invoice_pdf: path });
    return RESULT;
  }

  //==========================
  // GENERATE AI  INVOICE
  //==========================
  async generate_ai_invoice_service(prompt: string) {
    const system_prompt = this.promptservice.InvoiceGenerator();
    const response = await this.openAIService.GPTChat(prompt, system_prompt);
    return { message: "invoice generated", response };
  }

  //=============================
  // GET PREBUILD TEMPLATE
  //=============================
  async get_prebuild_invoice_template_service() {
    return await this.invoicesRepo.find({
      where: {
        user_id: IsNull(),
      },
    });
  }

  ///////////////////////////////////////////
  // FIND ALL INVOICES
  ///////////////////////////////////////////
  async all_invoices_service(query?: {
    search?: string;
    status?: string;
    user_id?: string;
  }) {
    const where: any = {};

    if (query?.status) where.status = query.status;
    if (query?.user_id) where.user_id = query.user_id;

    // Search by customer name or invoice number
    if (query?.search) {
      where.customer_name = ILike(`%${query.search}%`);
    }

    return await this.invoicesRepo.find({
      where,
      order: { created_at: "DESC" },
    });
  }

  /////////////////////////////////////////////////////////////////////////
  // USER INVOICE BY USER ID
  /////////////////////////////////////////////////////////////////////////
  async user_invoices_service(user_id: string) {
    const response = await this.invoicesRepo.query(
      `SELECT i.*, u.full_name as primary_owner
FROM invoices i
JOIN users u ON i.user_id::UUID = u.uuid
WHERE i.user_id = $1
GROUP BY i.uuid, u.full_name
`,
      [user_id],
    );
    return response;
  }

  /////////////////////////////////////////////////////////////////////////
  // FIND SINGLE INVOICE BY ID or UUID
  /////////////////////////////////////////////////////////////////////////
  async single_invoice_service(idOrUuid: number | string) {
    const invoice = await this.invoicesRepo.query(
      ` SELECT * FROM invoices WHERE uuid=$1`,
      [idOrUuid],
    );
    if (!invoice || invoice.length === 0)
      throw new NotFoundException("Invoice not found");
    return invoice[0];
  }

  ///////////////////////////////////////////////////
  // UPDATE INVOICE
  ///////////////////////////////////////////////////
  async update_invoice_service(
    idOrUuid: number | string,
    data: Partial<InvoiceEntity>,
  ) {
    const invoice = await this.single_invoice_service(idOrUuid);
    Object.assign(invoice, data);
    return await this.invoicesRepo.save(invoice);
  }

  //////////////////////////////////////////////////////////////
  // UPDATE ONLY CUSTOM FIELDS
  //////////////////////////////////////////////////////////////
  async update_custom_field_service(
    idOrUuid: number | string,
    customFields: Record<string, any>,
  ) {
    const invoice = await this.single_invoice_service(idOrUuid);
    invoice.custom_fields = { ...invoice.custom_fields, ...customFields };
    return await this.invoicesRepo.save(invoice);
  }

  ///////////////////////////////////
  // DELETE INVOICE
  ///////////////////////////////////
  async delete_invoices_service(idOrUuid: number | string) {
    const invoice = await this.single_invoice_service(idOrUuid);
    await this.invoicesRepo.remove(invoice);
    return { message: "Invoice deleted successfully" };
  }

  ////////////////////////////////////////////////////////
  // CHANGE INVOICE STATUS
  ////////////////////////////////////////////////////////
  async update_invoice_status_service(
    idOrUuid: number | string,
    status: string,
  ) {
    const invoice = await this.single_invoice_service(idOrUuid);
    invoice.status = status;
    return await this.invoicesRepo.save(invoice);
  }

  /////////////////////////////////////////////
  // COMPUTE TOTALS
  /////////////////////////////////////////////
  async total_inovices_service(
    subtotal: number,
    vatRate: number,
  ): Promise<{ vat: number; total: number }> {
    let vat = parseFloat(((subtotal * vatRate) / 100).toFixed(2));
    let total = parseFloat((subtotal + vat).toFixed(2));
    return { vat, total };
  }
}
