"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendService = exports.EmailTemplates = void 0;
const common_1 = require("@nestjs/common");
const BRAND_DARK = "#1B2A49";
const BRAND_BLUE = "#2E69A4";
const ACCENT = "#E8690A";
function layout(title, body, cta) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 0">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;max-width:600px;width:100%">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND_DARK};padding:20px 28px;text-align:left">
            <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">
              Biz<span style="color:${ACCENT}">Mate</span> AI
            </span>
            <span style="display:block;font-size:11px;color:#94A3B8;margin-top:2px">
              Your AI-powered business operating system
            </span>
          </td>
        </tr>

        <!-- Accent bar -->
        <tr><td style="height:3px;background:${ACCENT}"></td></tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 28px 20px">
            ${body}
          </td>
        </tr>

        <!-- CTA -->
        ${cta ? `<tr><td style="padding:0 28px 28px;text-align:center">
          <a href="${cta.url}"
            style="display:inline-block;background:${ACCENT};color:#ffffff;font-weight:700;
                   font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;
                   letter-spacing:0.2px">
            ${cta.label}
          </a>
        </td></tr>` : ""}

        <!-- Footer -->
        <tr>
          <td style="background:#F8FAFC;padding:16px 28px;border-top:1px solid #E2E8F0;text-align:center">
            <p style="margin:0;font-size:11px;color:#94A3B8">
              You're receiving this because you have an account at BizMate AI.<br/>
              © ${new Date().getFullYear()} Async Innovations FZ-LLC · UAE
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
exports.EmailTemplates = {
    reminder(reminder) {
        const date = new Date(reminder.reminder_date).toLocaleDateString("en-AE", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        });
        return layout(`Reminder: ${reminder.title}`, `<h2 style="margin:0 0 8px;font-size:20px;color:#0F172A">
        📅 You have a reminder
      </h2>
      <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6">
        Hi ${reminder.full_name ?? "there"},
      </p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#0F172A">${reminder.title}</p>
        ${reminder.description
            ? `<p style="margin:0;font-size:13px;color:#64748B;line-height:1.5">${reminder.description}</p>`
            : ""}
      </div>
      <p style="margin:0;font-size:13px;color:#64748B">
        <strong style="color:#0F172A">Due date:</strong> ${date}
      </p>`, { label: "View in Dashboard →", url: `${process.env.APP_URL || "https://app.bizmate.ai"}/dashboard/reminders` });
    },
    invoicePaid(data) {
        return layout(`Invoice ${data.invoice_number} Paid`, `<h2 style="margin:0 0 12px;font-size:20px;color:#0F172A">
        ✅ Invoice payment received
      </h2>
      <p style="color:#475569;font-size:14px;line-height:1.6">
        Hi ${data.full_name ?? "there"}, your invoice has been marked as paid.
      </p>
      <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:8px;padding:16px 20px;margin:16px 0">
        <p style="margin:0 0 6px;font-size:13px;color:#065F46;font-weight:600">Payment Details</p>
        <p style="margin:0 0 4px;font-size:14px;color:#0F172A">
          <strong>Invoice:</strong> ${data.invoice_number}
        </p>
        <p style="margin:0 0 4px;font-size:14px;color:#0F172A">
          <strong>Client:</strong> ${data.customer_name}
        </p>
        <p style="margin:0;font-size:16px;font-weight:700;color:#059669">
          AED ${Number(data.total).toFixed(2)}
        </p>
      </div>`, { label: "View Invoice →", url: `${process.env.APP_URL || "https://app.bizmate.ai"}/dashboard/invoicing` });
    },
    quotationAccepted(data) {
        return layout(`Quotation ${data.quotation_number} Accepted`, `<h2 style="margin:0 0 12px;font-size:20px;color:#0F172A">
        🎉 Your quotation was accepted!
      </h2>
      <p style="color:#475569;font-size:14px;line-height:1.6">
        Hi ${data.full_name ?? "there"}, great news!
      </p>
      <div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:8px;padding:16px 20px;margin:16px 0">
        <p style="margin:0 0 6px;font-size:14px;color:#0F172A">
          <strong>${data.quotation_number}</strong>${data.project_title ? ` — ${data.project_title}` : ""}
        </p>
        <p style="margin:0;font-size:13px;color:#4338CA">
          Accepted by <strong>${data.client_name}</strong>
        </p>
      </div>
      <p style="font-size:13px;color:#64748B">
        You can now convert this quotation to an invoice directly from the dashboard.
      </p>`, { label: "View Quotation →", url: `${process.env.APP_URL || "https://app.bizmate.ai"}/dashboard/quotations` });
    },
    quotationRejected(data) {
        return layout(`Quotation ${data.quotation_number} Rejected`, `<h2 style="margin:0 0 12px;font-size:20px;color:#0F172A">
        Quotation ${data.quotation_number} was declined
      </h2>
      <p style="color:#475569;font-size:14px;line-height:1.6">
        Hi ${data.full_name ?? "there"}, <strong>${data.client_name}</strong> has rejected your quotation.
      </p>
      ${data.client_comment ? `
      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:14px 18px;margin:16px 0">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#991B1B">Client Feedback</p>
        <p style="margin:0;font-size:13px;color:#7F1D1D">${data.client_comment}</p>
      </div>` : ""}
      <p style="font-size:13px;color:#64748B">
        You can revise and resend a new quotation from the dashboard.
      </p>`, { label: "View Quotation →", url: `${process.env.APP_URL || "https://app.bizmate.ai"}/dashboard/quotations` });
    },
    documentFinalised(data) {
        return layout(`Document Finalised: ${data.document_name}`, `<h2 style="margin:0 0 12px;font-size:20px;color:#0F172A">
        📄 Document finalised
      </h2>
      <p style="color:#475569;font-size:14px;line-height:1.6">
        Hi ${data.full_name ?? "there"}, your document has been finalised and is now locked.
      </p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px 20px;margin:16px 0">
        <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#0F172A">${data.document_name}</p>
        ${data.document_type ? `<p style="margin:0;font-size:12px;color:#64748B">${data.document_type}</p>` : ""}
      </div>
      <p style="font-size:13px;color:#64748B">
        Download a PDF copy or archive the document from the Documents section.
      </p>`, { label: "View Document →", url: `${process.env.APP_URL || "https://app.bizmate.ai"}/dashboard/documents` });
    },
    welcome(data) {
        return layout("Welcome to BizMate AI", `<h2 style="margin:0 0 12px;font-size:22px;color:#0F172A">
        Welcome to BizMate AI, ${data.full_name}! 🚀
      </h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin-bottom:16px">
        Your account is ready. BizMate AI helps UAE and GCC businesses manage invoices,
        quotations, documents, and compliance — all powered by AI.
      </p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 8px;font-weight:700;color:#0F172A;font-size:13px">Get started in 3 steps:</p>
        <p style="margin:0 0 6px;color:#475569;font-size:13px">1. Complete your Business Profile</p>
        <p style="margin:0 0 6px;color:#475569;font-size:13px">2. Create your first invoice or quotation</p>
        <p style="margin:0;color:#475569;font-size:13px">3. Set up AI reminders for your key deadlines</p>
      </div>`, { label: "Go to Dashboard →", url: `${process.env.APP_URL || "https://app.bizmate.ai"}/dashboard` });
    },
    subscriptionExpiring(data) {
        const urgent = data.days_left <= 3;
        return layout(`Your ${data.plan_name} plan expires in ${data.days_left} day${data.days_left !== 1 ? "s" : ""}`, `<h2 style="margin:0 0 12px;font-size:20px;color:#0F172A">
        ${urgent ? "⚠️" : "📅"} Your subscription is expiring soon
      </h2>
      <p style="color:#475569;font-size:14px;line-height:1.6">
        Hi ${data.full_name ?? "there"}, your <strong>${data.plan_name}</strong> plan expires
        in <strong>${data.days_left} day${data.days_left !== 1 ? "s" : ""}</strong>.
      </p>
      <div style="background:${urgent ? "#FEF2F2" : "#FFFBEB"};border:1px solid ${urgent ? "#FECACA" : "#FDE68A"};border-radius:8px;padding:14px 18px;margin:16px 0">
        <p style="margin:0;font-size:13px;color:${urgent ? "#991B1B" : "#92400E"}">
          ${urgent
            ? "Access to your paid features will end soon. Renew now to avoid any disruption."
            : "Renew your subscription to keep access to all your features."}
        </p>
      </div>`, { label: "Renew Now →", url: `${process.env.APP_URL || "https://app.bizmate.ai"}/dashboard/pricing` });
    },
    passwordReset(data) {
        return layout("Reset your BizMate AI password", `<h2 style="margin:0 0 12px;font-size:20px;color:#0F172A">Reset your password</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6">
        Hi ${data.full_name}, we received a request to reset your BizMate AI password.
        Click the button below to set a new password. This link expires in 1 hour.
      </p>
      <p style="font-size:12px;color:#94A3B8;margin-top:16px">
        If you did not request a password reset, you can safely ignore this email.
      </p>`, { label: "Reset Password →", url: data.reset_link });
    },
};
let ResendService = class ResendService {
    apiKey;
    from;
    constructor() {
        this.apiKey = process.env.RESEND_API_KEY || "";
        this.from = process.env.RESEND_FROM || "BizMate AI <onboarding@resend.dev>";
    }
    async send(params) {
        if (!this.apiKey) {
            console.warn("[ResendService] RESEND_API_KEY not set — email not sent");
            return { success: false, error: "RESEND_API_KEY not configured" };
        }
        try {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: this.from,
                    to: Array.isArray(params.to) ? params.to : [params.to],
                    subject: params.subject,
                    html: params.html,
                    reply_to: params.reply_to,
                    tags: params.tags,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error("[ResendService] Send failed:", data);
                return { success: false, error: data.message ?? "Send failed" };
            }
            console.log(`[ResendService] ✓ Sent to ${params.to} — id: ${data.id}`);
            return { success: true, id: data.id };
        }
        catch (err) {
            console.error("[ResendService] Network error:", err.message);
            return { success: false, error: err.message };
        }
    }
    async sendReminderEmail(reminder) {
        return this.send({
            to: reminder.email,
            subject: `⏰ Reminder: ${reminder.title}`,
            html: exports.EmailTemplates.reminder(reminder),
            tags: [{ name: "type", value: "reminder" }],
        });
    }
    async sendInvoicePaidEmail(to, data) {
        return this.send({
            to, subject: `✅ Invoice ${data.invoice_number} Paid — AED ${Number(data.total).toFixed(2)}`,
            html: exports.EmailTemplates.invoicePaid(data),
            tags: [{ name: "type", value: "invoice_paid" }],
        });
    }
    async sendQuotationAcceptedEmail(to, data) {
        return this.send({
            to, subject: `🎉 Quotation ${data.quotation_number} Accepted by ${data.client_name}`,
            html: exports.EmailTemplates.quotationAccepted(data),
            tags: [{ name: "type", value: "quotation_accepted" }],
        });
    }
    async sendQuotationRejectedEmail(to, data) {
        return this.send({
            to, subject: `Quotation ${data.quotation_number} Rejected`,
            html: exports.EmailTemplates.quotationRejected(data),
            tags: [{ name: "type", value: "quotation_rejected" }],
        });
    }
    async sendDocumentFinalisedEmail(to, data) {
        return this.send({
            to, subject: `📄 Document finalised: ${data.document_name}`,
            html: exports.EmailTemplates.documentFinalised(data),
            tags: [{ name: "type", value: "document_finalised" }],
        });
    }
    async sendWelcomeEmail(data) {
        return this.send({
            to: data.email, subject: `Welcome to BizMate AI, ${data.full_name}! 🚀`,
            html: exports.EmailTemplates.welcome(data),
            tags: [{ name: "type", value: "welcome" }],
        });
    }
    async sendSubscriptionExpiringEmail(to, data) {
        return this.send({
            to,
            subject: `⚠️ Your ${data.plan_name} plan expires in ${data.days_left} day${data.days_left !== 1 ? "s" : ""}`,
            html: exports.EmailTemplates.subscriptionExpiring(data),
            tags: [{ name: "type", value: "subscription_expiring" }],
        });
    }
    async sendPasswordResetEmail(data) {
        return this.send({
            to: data.email,
            subject: "Reset your BizMate AI password",
            html: exports.EmailTemplates.passwordReset(data),
            tags: [{ name: "type", value: "password_reset" }],
        });
    }
};
exports.ResendService = ResendService;
exports.ResendService = ResendService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ResendService);
//# sourceMappingURL=ResendService.js.map