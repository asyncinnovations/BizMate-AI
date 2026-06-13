// src/jobs/reminderNotifier.ts
// UPDATED:
// 1. Uses ResendService instead of nodemailer EmailService
// 2. Writes to notifications table after each send (delivery log)
// 3. WhatsApp stub ready — uncomment + add env vars to enable
// 4. Recurring: auto-creates next occurrence when a recurring reminder fires
// 5. Updates reminder status to "sent" after delivery
//
// ENABLE: Uncomment the import in src/main.ts:
//   import "./jobs/reminderNotifier";

import cron        from "node-cron";
import { pool }    from "src/config/db";
import { ResendService, EmailTemplates } from "src/services/ResendService";
// import { WhatsappService } from "src/services/WhatsappService";

const resend   = new ResendService();
// const whatsapp = new WhatsappService();
const db       = pool;

// ── Helper: calculate next occurrence date ──────────────────────────────────
function nextOccurrence(date: Date, rule: string): Date | null {
  const d = new Date(date);
  switch (rule) {
    case "monthly":   d.setMonth(d.getMonth() + 1);   return d;
    case "quarterly": d.setMonth(d.getMonth() + 3);   return d;
    case "yearly":    d.setFullYear(d.getFullYear() + 1); return d;
    default:          return null;
  }
}

// ── Cron: runs every 10 minutes ─────────────────────────────────────────────
cron.schedule("*/10 * * * *", async () => {
  console.log("[reminderNotifier] Checking for due reminders…");

  const now    = new Date();
  const window = new Date(Date.now() + 24 * 60 * 60 * 1000); // next 24h

  try {
    const { rows: reminders } = await db.query<{
      uuid:             string;
      user_id:          string;
      title:            string;
      description:      string;
      reminder_date:    Date;
      notify_channels:  { email: boolean; whatsapp: boolean; push: boolean };
      recurrence_rule:  string;
      notify_before:    number;
      status:           string;
      full_name:        string;
      email:            string;
      phone:            string | null;
    }>(
      `SELECT ar.*, u.full_name, u.email, u.phone
       FROM ai_reminders ar
       JOIN users u ON ar.user_id = u.uuid
       WHERE ar.notified = false
         AND ar.status = 'pending'
         AND ar.reminder_date - (ar.notify_before * interval '1 day') <= $1
         AND ar.reminder_date > $2`,
      [window, now],
    );

    console.log(`[reminderNotifier] Found ${reminders.length} reminder(s) to dispatch`);

    for (const r of reminders) {
      let emailSent = false;

      // ── EMAIL ───────────────────────────────────────────────────────────
      if (r.notify_channels?.email && r.email) {
        const result = await resend.sendReminderEmail({
          email:         r.email,
          full_name:     r.full_name,
          title:         r.title,
          description:   r.description,
          reminder_date: r.reminder_date,
        });
        emailSent = result.success;

        // Write to notifications table (delivery log)
        await db.query(
          `INSERT INTO notifications
             (uuid, user_id, reminder_id, event_type, notification_type,
              title, message, status, sent_at, is_read, created_at, updated_at)
           VALUES
             (gen_random_uuid(), $1, $2, 'reminder', 'email',
              $3, $4, $5, $6, false, NOW(), NOW())`,
          [
            r.user_id,
            r.uuid,
            r.title,
            r.description || r.title,
            emailSent ? "sent" : "failed",
            emailSent ? new Date() : null,
          ],
        );

        // Also create a DASHBOARD notification so bell shows it
        await db.query(
          `INSERT INTO notifications
             (uuid, user_id, reminder_id, event_type, notification_type,
              title, message, status, sent_at, is_read, created_at, updated_at)
           VALUES
             (gen_random_uuid(), $1, $2, 'reminder', 'dashboard',
              $3, $4, 'sent', NOW(), false, NOW(), NOW())`,
          [r.user_id, r.uuid, r.title, r.description || r.title],
        );
      }

      // ── WHATSAPP (uncomment + add env vars to enable) ───────────────────
      // if (r.notify_channels?.whatsapp && r.phone) {
      //   await whatsapp.send_whatsapp_reminder(r, r.phone);
      // }

      // ── Mark reminder as notified + sent ───────────────────────────────
      await db.query(
        `UPDATE ai_reminders
         SET notified = true, status = 'sent', updated_at = NOW()
         WHERE uuid = $1`,
        [r.uuid],
      );

      // ── Recurring: create next occurrence ──────────────────────────────
      if (r.recurrence_rule && r.recurrence_rule !== "none") {
        const next = nextOccurrence(new Date(r.reminder_date), r.recurrence_rule);
        if (next) {
          await db.query(
            `INSERT INTO ai_reminders
               (uuid, user_id, title, description, type, source,
                reference_id, reference_type, reminder_date, notify_before,
                notify_channels, recurrence_rule, status, notified,
                created_at, updated_at)
             VALUES
               (gen_random_uuid(), $1, $2, $3, $4, $5,
                $6, $7, $8, $9,
                $10::jsonb, $11, 'pending', false,
                NOW(), NOW())`,
            [
              r.user_id, r.title, r.description,
              r.type ?? "Custom", r.source ?? "manual",
              r.reference_id ?? null, r.reference_type ?? null,
              next, r.notify_before,
              JSON.stringify(r.notify_channels),
              r.recurrence_rule,
            ],
          );
          console.log(`[reminderNotifier] Recurring: created next occurrence for "${r.title}" on ${next.toDateString()}`);
        }
      }

      console.log(`[reminderNotifier] ✓ Processed "${r.title}" for ${r.email}`);
    }
  } catch (err: any) {
    console.error("[reminderNotifier] Cron error:", err.message);
  }
});

console.log("[reminderNotifier] Cron registered — runs every 10 minutes");
