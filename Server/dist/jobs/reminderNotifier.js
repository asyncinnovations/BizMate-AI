"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../config/db");
const EmailService_1 = require("../services/EmailService");
const WhatsappService_1 = require("../services/WhatsappService");
const email_service = new EmailService_1.EmailService();
const whatsap_service = new WhatsappService_1.WhatsappService();
const db = db_1.pool;
node_cron_1.default.schedule("*/10 * * * * *", async () => {
    console.log("Checking for upcoming reminders...");
    const now = new Date();
    const next24h = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const result = await db.query(`SELECT 
  ar.*,u.full_name,u.email 
  FROM ai_reminders as ar 
  JOIN users as u ON ar.user_id=u.uuid 
  WHERE notified = false
  AND reminder_date - (notify_before * interval '1 day') <= $1
  AND reminder_date > $2
  `, [next24h, now]);
    for (const reminder of result.rows) {
        console.log(`Sending reminder for: ${reminder.title}`);
        if (reminder.notify_channels.email) {
            await email_service.send_email_reminder(reminder);
        }
        await db.query(`UPDATE ai_reminders SET notified = true WHERE uuid = $1`, [
            reminder.uuid,
        ]);
    }
});
//# sourceMappingURL=reminderNotifier.js.map