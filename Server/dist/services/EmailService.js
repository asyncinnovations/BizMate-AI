"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = __importDefault(require("nodemailer"));
let EmailService = class EmailService {
    transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    async send_email_reminder(reminder) {
        const formattedDate = new Date(reminder.reminder_date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f7f9fc; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
        <div style="background-color: #007bff; color: white; padding: 16px; text-align: center;">
          <h2 style="margin: 0;">📅 Reminder Notification</h2>
        </div>
        <div style="padding: 20px;">
          <h3 style="color: #333;">${reminder.title}</h3>
          <p style="color: #555; line-height: 1.6;">${reminder.description || "You have an upcoming reminder."}</p>
          <p style="font-size: 14px; color: #333; margin-top: 20px;">
            <strong>Due Date:</strong> ${formattedDate}
          </p>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.APP_URL || "#"}" 
              style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
              Open Dashboard
            </a>
          </div>
        </div>
        <div style="background-color: #f1f1f1; padding: 12px; text-align: center; font-size: 12px; color: #777;">
          This is an automated reminder from <strong>BizMate AI</strong>. Please do not reply to this email.
        </div>
      </div>
    `;
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: reminder?.email,
            subject: `Reminder: ${reminder.title}`,
            html: htmlContent,
        };
        try {
            const response = await this.transporter.sendMail(mailOptions);
            console.log(` Email sent for ${reminder.title}`);
            return { success: true, response };
        }
        catch (err) {
            console.error("Email failed:", err);
        }
    }
    async send_email(data) {
        const mailOptions = {
            from: `"BizMate AI" <${process.env.SMTP_USER}>`,
            to: data.to,
            subject: data.subject,
            html: data.html || "<p>No message content</p>",
        };
        try {
            const response = await this.transporter.sendMail(mailOptions);
            console.log("Generic email sent");
            return { success: true, response };
        }
        catch (err) {
            console.error("Generic email failed:", err.message);
            return { success: false, error: err.message };
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=EmailService.js.map