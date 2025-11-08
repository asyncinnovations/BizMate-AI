import { Injectable } from "@nestjs/common";
import twilio from "twilio";
@Injectable()
export class WhatsappService {
  ////////////////////////////////////////////////////////
  // SEND WHATSAPP REMINDER
  ////////////////////////////////////////////////////////
  async send_whatsapp_reminder(reminder: any, user_phone: any) {
    const client: any = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    try {
      const response = await client.messages.create({
        from: `whatsapp:${process.env.WHATSAPP_USER}`, // Twilio sandbox sender +14155238886
        to: `whatsapp:${user_phone}`, // user’s WhatsApp number
        body: `Reminder: ${reminder.title}\n${reminder.description}\nDue: ${new Date(reminder.reminder_date).toDateString()}`,
      });
      console.log(`WhatsApp reminder sent for ${reminder.title}`);
      return { success: true, response };
    } catch (err) {
      console.error("WhatsApp failed:", err);
    }
  }
}
