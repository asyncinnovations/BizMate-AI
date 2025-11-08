import cron from "node-cron";
import { pool } from "src/config/db";
import { EmailService } from "src/services/EmailService";
import { WhatsappService } from "src/services/WhatsappService";
const email_service = new EmailService();
const whatsap_service = new WhatsappService();
const db = pool;
// runs every 10 minutes
cron.schedule("*/10 * * * * *", async () => {
  console.log("Checking for upcoming reminders...");

  const now = new Date();
  const next24h = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const result = await db.query(
  `SELECT 
  ar.*,u.full_name,u.email 
  FROM ai_reminders as ar 
  JOIN users as u ON ar.user_id=u.uuid 
  WHERE notified = false
  AND reminder_date - (notify_before * interval '1 day') <= $1
  AND reminder_date > $2
  `,
    [next24h, now]
  );

  for (const reminder of result.rows) {
    console.log(`Sending reminder for: ${reminder.title}`);

    // send remidner to Email
    if (reminder.notify_channels.email) {
      await email_service.send_email_reminder(reminder);
    }

    // // send reminder to WhatsApp
    // if (reminder.notify_channels.whatsapp) {
    //   await whatsap_service.send_whatsapp_reminder(reminder, "");
    // }

    // Mark as notified
    await db.query(`UPDATE ai_reminders SET notified = true WHERE uuid = $1`, [
      reminder.uuid,
    ]);
  }
});
