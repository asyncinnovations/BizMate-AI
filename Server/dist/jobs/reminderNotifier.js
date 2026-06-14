"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../config/db");
const ResendService_1 = require("../services/ResendService");
const resend = new ResendService_1.ResendService();
const db = db_1.pool;
function nextOccurrence(date, rule) {
    const d = new Date(date);
    switch (rule) {
        case "monthly":
            d.setMonth(d.getMonth() + 1);
            return d;
        case "quarterly":
            d.setMonth(d.getMonth() + 3);
            return d;
        case "yearly":
            d.setFullYear(d.getFullYear() + 1);
            return d;
        default: return null;
    }
}
node_cron_1.default.schedule("*/10 * * * *", async () => {
    console.log("[reminderNotifier] Checking for due reminders…");
    const now = new Date();
    const window = new Date(Date.now() + 24 * 60 * 60 * 1000);
    try {
        const { rows: reminders } = await db.query(`SELECT ar.*, u.full_name, u.email, u.phone
       FROM ai_reminders ar
       JOIN users u ON ar.user_id = u.uuid
       WHERE ar.notified = false
         AND ar.status = 'pending'
         AND ar.reminder_date - (ar.notify_before * interval '1 day') <= $1
         AND ar.reminder_date > $2`, [window, now]);
        console.log(`[reminderNotifier] Found ${reminders.length} reminder(s) to dispatch`);
        for (const r of reminders) {
            let emailSent = false;
            if (r.notify_channels?.email && r.email) {
                const result = await resend.sendReminderEmail({
                    email: r.email,
                    full_name: r.full_name,
                    title: r.title,
                    description: r.description,
                    reminder_date: r.reminder_date,
                });
                emailSent = result.success;
                await db.query(`INSERT INTO notifications
             (uuid, user_id, reminder_id, event_type, notification_type,
              title, message, status, sent_at, is_read, created_at, updated_at)
           VALUES
             (gen_random_uuid(), $1, $2, 'reminder', 'email',
              $3, $4, $5, $6, false, NOW(), NOW())`, [
                    r.user_id,
                    r.uuid,
                    r.title,
                    r.description || r.title,
                    emailSent ? "sent" : "failed",
                    emailSent ? new Date() : null,
                ]);
                await db.query(`INSERT INTO notifications
             (uuid, user_id, reminder_id, event_type, notification_type,
              title, message, status, sent_at, is_read, created_at, updated_at)
           VALUES
             (gen_random_uuid(), $1, $2, 'reminder', 'dashboard',
              $3, $4, 'sent', NOW(), false, NOW(), NOW())`, [r.user_id, r.uuid, r.title, r.description || r.title]);
            }
            await db.query(`UPDATE ai_reminders
         SET notified = true, status = 'sent', updated_at = NOW()
         WHERE uuid = $1`, [r.uuid]);
            if (r.recurrence_rule && r.recurrence_rule !== "none") {
                const next = nextOccurrence(new Date(r.reminder_date), r.recurrence_rule);
                if (next) {
                    await db.query(`INSERT INTO ai_reminders
               (uuid, user_id, title, description, type, source,
                reference_id, reference_type, reminder_date, notify_before,
                notify_channels, recurrence_rule, status, notified,
                created_at, updated_at)
             VALUES
               (gen_random_uuid(), $1, $2, $3, $4, $5,
                $6, $7, $8, $9,
                $10::jsonb, $11, 'pending', false,
                NOW(), NOW())`, [
                        r.user_id, r.title, r.description,
                        r.type ?? "Custom", r.source ?? "manual",
                        r.reference_id ?? null, r.reference_type ?? null,
                        next, r.notify_before,
                        JSON.stringify(r.notify_channels),
                        r.recurrence_rule,
                    ]);
                    console.log(`[reminderNotifier] Recurring: created next occurrence for "${r.title}" on ${next.toDateString()}`);
                }
            }
            console.log(`[reminderNotifier] ✓ Processed "${r.title}" for ${r.email}`);
        }
    }
    catch (err) {
        console.error("[reminderNotifier] Cron error:", err.message);
    }
});
console.log("[reminderNotifier] Cron registered — runs every 10 minutes");
//# sourceMappingURL=reminderNotifier.js.map