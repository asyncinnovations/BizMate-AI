import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike, IsNull } from "typeorm";
import { InvoiceEntity, InvoiceStatus, InvoiceSource } from "./invoices.entity";
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

  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Appends a status transition to the activity_log array.
   * Every status change is timestamped and stored for the timeline UI.
   */
  private append_activity_log(
    existing_log: { status: string; timestamp: string }[],
    new_status: string,
  ): { status: string; timestamp: string }[] {
    const log = Array.isArray(existing_log) ? existing_log : [];
    return [...log, { status: new_status, timestamp: new Date().toISOString() }];
  }

  /**
   * Auto-generates the next invoice number in the format INV-YYYY-XXXX.
   * Reads the highest existing number for the current year and increments it.
   */
  private async generate_invoice_number(): Promise<string> {
    const year   = new Date().getFullYear();
    const prefix = `INV-${year}-`;

    const latest = await this.invoicesRepo
      .createQueryBuilder("invoice")
      .where("invoice.invoice_number LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("invoice.invoice_number", "DESC")
      .getOne();

    if (!latest) return `${prefix}0001`;

    const lastSeq = parseInt(latest.invoice_number.split("-")[2] ?? "0", 10);
    const nextSeq = String(lastSeq + 1).padStart(4, "0");
    return `${prefix}${nextSeq}`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CREATE INVOICE
  // ─────────────────────────────────────────────────────────────────────────
  async create_invoice_service(data: Partial<InvoiceEntity>) {
    const invoice = this.invoicesRepo.create({
      ...data,
      activity_log: this.append_activity_log([], data.status ?? InvoiceStatus.DRAFT),
    });
    return await this.invoicesRepo.save(invoice);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE PDF PATH
  // ─────────────────────────────────────────────────────────────────────────
  async set_invoice_pdf_path_service(path: string, uuid: string) {
    return await this.invoicesRepo.update({ uuid }, { invoice_pdf: path });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GENERATE AI INVOICE FROM NATURAL LANGUAGE PROMPT
  // ─────────────────────────────────────────────────────────────────────────
  async generate_ai_invoice_service(prompt: string) {
    const system_prompt = this.promptservice.InvoiceGenerator();
    const response      = await this.openAIService.GPTChat(prompt, system_prompt);
    return { message: "invoice generated", response };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET PREBUILD TEMPLATES (system invoices — no user_id)
  // ─────────────────────────────────────────────────────────────────────────
  async get_prebuild_invoice_template_service() {
    return await this.invoicesRepo.find({ where: { user_id: IsNull() } });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET ALL INVOICES (admin / search with optional filters)
  // ─────────────────────────────────────────────────────────────────────────
  async all_invoices_service(query?: {
    search?: string;
    status?: string;
    user_id?: string;
  }) {
    const where: any = {};
    if (query?.status)  where.status  = query.status;
    if (query?.user_id) where.user_id = query.user_id;
    if (query?.search)  where.customer_name = ILike(`%${query.search}%`);

    return await this.invoicesRepo.find({
      where,
      order: { created_at: "DESC" },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET ALL INVOICES FOR A USER
  // Returns source + activity_log so the frontend can display source badges
  // and the status timeline without extra round-trips.
  // ─────────────────────────────────────────────────────────────────────────
  async user_invoices_service(user_id: string) {
    return await this.invoicesRepo.query(
      `SELECT i.*, u.full_name AS primary_owner
       FROM invoices i
       JOIN users u ON i.user_id::UUID = u.uuid
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`,
      [user_id],
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET SINGLE INVOICE BY UUID
  // ─────────────────────────────────────────────────────────────────────────
  async single_invoice_service(idOrUuid: number | string) {
    const invoices = await this.invoicesRepo.query(
      `SELECT * FROM invoices WHERE uuid = $1`,
      [idOrUuid],
    );
    if (!invoices || invoices.length === 0) {
      throw new NotFoundException("Invoice not found");
    }
    return invoices[0];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE INVOICE (full update)
  // ─────────────────────────────────────────────────────────────────────────
  async update_invoice_service(
    idOrUuid: number | string,
    data: Partial<InvoiceEntity>,
  ) {
    const invoice = await this.single_invoice_service(idOrUuid);
    Object.assign(invoice, data);
    return await this.invoicesRepo.save(invoice);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE CUSTOM FIELDS ONLY
  // ─────────────────────────────────────────────────────────────────────────
  async update_custom_field_service(
    idOrUuid: number | string,
    customFields: Record<string, any>,
  ) {
    const invoice = await this.single_invoice_service(idOrUuid);
    invoice.custom_fields = { ...invoice.custom_fields, ...customFields };
    return await this.invoicesRepo.save(invoice);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DELETE INVOICE
  // ─────────────────────────────────────────────────────────────────────────
  async delete_invoices_service(idOrUuid: number | string) {
    const invoice = await this.single_invoice_service(idOrUuid);
    await this.invoicesRepo.remove(invoice);
    return { message: "Invoice deleted successfully" };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE INVOICE STATUS — validates + appends to activity_log
  // The activity_log is what powers the status timeline in the frontend.
  // ─────────────────────────────────────────────────────────────────────────
  async update_invoice_status_service(
    idOrUuid: number | string,
    new_status: string,
  ) {
    const valid_statuses = Object.values(InvoiceStatus) as string[];
    if (!valid_statuses.includes(new_status)) {
      throw new BadRequestException(
        `Invalid status "${new_status}". Allowed: ${valid_statuses.join(", ")}`,
      );
    }

    const invoice     = await this.single_invoice_service(idOrUuid);
    const updated_log = this.append_activity_log(invoice.activity_log ?? [], new_status);

    await this.invoicesRepo.query(
      `UPDATE invoices
       SET status = $1, activity_log = $2::jsonb, updated_at = NOW()
       WHERE uuid = $3`,
      [new_status, JSON.stringify(updated_log), invoice.uuid],
    );

    return {
      message:      `Invoice status updated to "${new_status}"`,
      uuid:         invoice.uuid,
      status:       new_status,
      activity_log: updated_log,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTE TOTALS
  // ─────────────────────────────────────────────────────────────────────────
  async total_inovices_service(
    subtotal: number,
    vatRate: number,
  ): Promise<{ vat: number; total: number }> {
    const vat   = parseFloat(((subtotal * vatRate) / 100).toFixed(2));
    const total = parseFloat((subtotal + vat).toFixed(2));
    return { vat, total };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NEW — DUPLICATE INVOICE
  // Creates a clean copy of an existing invoice:
  //   • New auto-sequenced invoice number (INV-YYYY-XXXX)
  //   • Status reset to "draft"
  //   • Source set to "duplicate"
  //   • Fresh activity_log (only the draft creation entry)
  //   • PDF cleared — will be generated when user saves
  // ─────────────────────────────────────────────────────────────────────────
  async duplicate_invoice_service(invoice_uuid: string, requesting_user_id: string) {
    const original = await this.single_invoice_service(invoice_uuid);

    if (original.user_id && original.user_id !== requesting_user_id) {
      throw new BadRequestException(
        "You do not have permission to duplicate this invoice.",
      );
    }

    const new_invoice_number = await this.generate_invoice_number();

    const duplicate = this.invoicesRepo.create({
      user_id:          original.user_id,
      invoice_name:     original.invoice_name,
      invoice_type:     original.invoice_type,
      invoice_number:   new_invoice_number,
      customer_name:    original.customer_name,
      customer_email:   original.customer_email,
      customer_address: original.customer_address,
      invoice_date:     new Date(),
      due_date:         original.due_date,
      payment_terms:    original.payment_terms,
      subtotal:         original.subtotal,
      vat:              original.vat,
      total:            original.total,
      notes:            original.notes,
      custom_fields:    original.custom_fields,
      invoice_items:    original.invoice_items,
      status:           InvoiceStatus.DRAFT,
      source:           InvoiceSource.DUPLICATE,
      activity_log:     this.append_activity_log([], InvoiceStatus.DRAFT),
      invoice_pdf:      null,
    });

    const saved = await this.invoicesRepo.save(duplicate);
    return {
      message: "Invoice duplicated successfully",
      invoice: saved,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NEW — AI INSIGHTS FOR AN INVOICE (Pro/Enterprise only)
  // Uses GPT to analyse the invoice + customer payment history and return:
  //   • payment_prediction_days
  //   • late_payment_risk_percent
  //   • suggested_action
  //   • client_payment_pattern
  // ─────────────────────────────────────────────────────────────────────────
  async get_ai_insights_service(invoice_uuid: string) {
    const invoice = await this.single_invoice_service(invoice_uuid);

    // Pull last 10 resolved invoices for this customer as context
    const customer_history: any[] = await this.invoicesRepo.query(
      `SELECT invoice_date, due_date, status, total
       FROM invoices
       WHERE customer_email = $1
         AND status IN ('paid', 'overdue', 'unpaid')
         AND uuid != $2
       ORDER BY created_at DESC
       LIMIT 10`,
      [invoice.customer_email, invoice_uuid],
    );

    const context = {
      invoice: {
        invoice_number: invoice.invoice_number,
        customer_name:  invoice.customer_name,
        total:          invoice.total,
        invoice_date:   invoice.invoice_date,
        due_date:       invoice.due_date,
        status:         invoice.status,
      },
      customer_history: customer_history.map((h) => ({
        total:        h.total,
        status:       h.status,
        invoice_date: h.invoice_date,
        due_date:     h.due_date,
      })),
    };

    const system_prompt = this.promptservice.InvoiceInsightsAnalyser();
    const gpt_response  = await this.openAIService.GPTChat(
      JSON.stringify(context),
      system_prompt,
    );

    // Parse the GPT JSON response — fall back to safe defaults if it fails
    let insights: any = {};
    try {
      const raw     = gpt_response?.data?.content ?? "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      insights      = JSON.parse(cleaned);
    } catch {
      insights = {
        payment_prediction_days:   7,
        late_payment_risk_percent: 25,
        suggested_action:
          "Send a payment reminder if this invoice is unpaid after the due date.",
        client_payment_pattern:
          "Insufficient history to make a reliable prediction.",
      };
    }

    return {
      message: "AI insights generated",
      insights: {
        ...insights,
        invoice_uuid,
        customer_name: invoice.customer_name,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NEW — AI SUGGESTIONS FOR THE CREATE FORM SIDEBAR (Pro/Enterprise only)
  // Analyses past invoices for a given customer name and returns:
  //   • suggestions: top repeated services with average prices
  //   • payment_pattern: plain text summary
  //   • pricing_tip: AED range based on history
  //   • professional_notes: ready-to-use invoice note text
  // ─────────────────────────────────────────────────────────────────────────
  async get_ai_suggestions_service(user_id: string, customer_name: string) {
    if (!customer_name || customer_name.trim().length < 2) {
      throw new BadRequestException(
        "Customer name must be at least 2 characters.",
      );
    }

    // Find recent invoices for this customer from this user
    const past_invoices: any[] = await this.invoicesRepo.query(
      `SELECT invoice_items, payment_terms, total, status, invoice_date, due_date
       FROM invoices
       WHERE user_id = $1
         AND LOWER(customer_name) LIKE LOWER($2)
       ORDER BY created_at DESC
       LIMIT 20`,
      [user_id, `%${customer_name.trim()}%`],
    );

    // No history — return helpful empty state
    if (past_invoices.length === 0) {
      return {
        message:            "No history found for this customer",
        suggestions:        [],
        payment_pattern:    "No payment history available for this customer yet.",
        pricing_tip:        "Consider researching market rates for your services.",
        professional_notes: `Thank you for your business. Payment is due within the specified terms. For any questions, please contact us directly.`,
      };
    }

    // Flatten all items from past invoices into a single array
    const all_items: any[] = [];
    for (const inv of past_invoices) {
      if (Array.isArray(inv.invoice_items)) {
        all_items.push(...inv.invoice_items);
      }
    }

    // Aggregate by service name — count usage + average price
    const service_map: Record<string, { total_price: number; count: number }> = {};
    for (const item of all_items) {
      const name = item.name?.trim();
      if (!name) continue;
      if (!service_map[name]) service_map[name] = { total_price: 0, count: 0 };
      service_map[name].total_price += Number(item.price ?? 0);
      service_map[name].count       += 1;
    }

    // Top 5 most-used services
    const suggestions = Object.entries(service_map)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        suggested_price: Math.round(data.total_price / data.count),
        times_used:      data.count,
      }));

    // Average days-to-pay from paid invoices
    const paid_invoices = past_invoices.filter((i) => i.status === "paid");
    let avg_days = 0;
    if (paid_invoices.length > 0) {
      const total_days = paid_invoices.reduce((sum, inv) => {
        const diff = new Date(inv.due_date).getTime() - new Date(inv.invoice_date).getTime();
        return sum + Math.ceil(diff / (1000 * 60 * 60 * 24));
      }, 0);
      avg_days = Math.round(total_days / paid_invoices.length);
    }

    const overdue_count = past_invoices.filter((i) => i.status === "overdue").length;
    const payment_rate  = Math.round((paid_invoices.length / past_invoices.length) * 100);

    const payment_pattern = paid_invoices.length > 0
      ? `${customer_name} typically pays within ${avg_days} days. ${payment_rate}% on-time payment rate.`
      : `No paid invoices on record for ${customer_name} yet.`;

    const prices = suggestions.map((s) => s.suggested_price).filter(Boolean);
    const pricing_tip = prices.length > 0
      ? `Based on your history with ${customer_name}, services typically range from AED ${Math.min(...prices).toLocaleString()} to AED ${Math.max(...prices).toLocaleString()}.`
      : "Set pricing based on your standard rates.";

    return {
      message: "Suggestions generated",
      suggestions,
      payment_pattern,
      overdue_count,
      payment_rate,
      pricing_tip,
      professional_notes: `Thank you for your continued business, ${customer_name}. Payment is due within the agreed terms. Please contact us for any queries regarding this invoice.`,
    };
  }
}
