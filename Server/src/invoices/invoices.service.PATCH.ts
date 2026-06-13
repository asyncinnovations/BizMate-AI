// src/invoices/invoices.service.PATCH.ts
// HOW TO APPLY:
// 1. Add NotificationsService and ResendService to InvoicesModule imports/providers
// 2. Inject them in InvoicesService constructor
// 3. Add notification calls inside update_invoice_status_service

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Update invoices.module.ts
// Add to imports array:  NotificationsModule
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: Add to InvoicesService constructor
// ─────────────────────────────────────────────────────────────────────────────
/*
import { NotificationsService } from "src/notifications/notifications.service";
import { ResendService, EmailTemplates } from "src/services/ResendService";
import { NotificationType }             from "src/notifications/notifications.entity";

// In constructor:
constructor(
  @InjectRepository(Invoice)
  private readonly invoicesRepo: Repository<Invoice>,
  private readonly pdfService:   PdfService,
  private readonly notificationsService: NotificationsService,
  private readonly resendService: ResendService,
) {}
*/

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3: Add notification calls in update_invoice_status_service
// After the UPDATE query, before the return statement:
// ─────────────────────────────────────────────────────────────────────────────
/*
    // ── NOTIFICATION: Invoice paid ────────────────────────────────────────
    if (new_status === "paid") {
      // Fetch user email + name for the email
      const [userRow] = (await this.invoicesRepo.query(
        `SELECT u.email, u.full_name FROM users u WHERE u.uuid = $1`,
        [invoice.user_id],
      )) ?? [];

      if (userRow?.email) {
        await this.notificationsService.create_and_send_service({
          user_id:           invoice.user_id,
          user_email:        userRow.email,
          user_full_name:    userRow.full_name,
          event_type:        "invoice_paid",
          notification_type: NotificationType.EMAIL,
          reference_id:      invoice.uuid,
          title:             `Invoice ${invoice.invoice_number} has been paid`,
          message:           `Payment of AED ${invoice.total} received from ${invoice.customer_name}`,
          email_subject:     `✅ Invoice ${invoice.invoice_number} Paid — AED ${invoice.total}`,
          email_html:        EmailTemplates.invoicePaid({
            invoice_number: invoice.invoice_number,
            customer_name:  invoice.customer_name,
            total:          invoice.total,
            full_name:      userRow.full_name,
          }),
        });
      }

      // Dashboard notification (always, no email check needed)
      await this.notificationsService.create_and_send_service({
        user_id:           invoice.user_id,
        user_email:        "",
        event_type:        "invoice_paid",
        notification_type: NotificationType.DASHBOARD,
        reference_id:      invoice.uuid,
        title:             `Invoice ${invoice.invoice_number} paid`,
        message:           `AED ${invoice.total} received from ${invoice.customer_name}`,
      });
    }

    // ── NOTIFICATION: Invoice sent to client ──────────────────────────────
    if (new_status === "sent") {
      await this.notificationsService.create_notification_service({
        user_id:           invoice.user_id,
        reference_id:      invoice.uuid,
        event_type:        "invoice_sent",
        notification_type: NotificationType.DASHBOARD,
        title:             `Invoice ${invoice.invoice_number} sent`,
        message:           `Invoice sent to ${invoice.customer_email}`,
      });
    }
*/

export const INVOICES_NOTIFICATION_PATCH = "See comments above for how to apply.";
