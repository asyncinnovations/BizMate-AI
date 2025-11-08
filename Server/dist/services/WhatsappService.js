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
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const twilio_1 = __importDefault(require("twilio"));
let WhatsappService = class WhatsappService {
    async send_whatsapp_reminder(reminder, user_phone) {
        const client = (0, twilio_1.default)(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
        try {
            const response = await client.messages.create({
                from: `whatsapp:${process.env.WHATSAPP_USER}`,
                to: `whatsapp:${user_phone}`,
                body: `Reminder: ${reminder.title}\n${reminder.description}\nDue: ${new Date(reminder.reminder_date).toDateString()}`,
            });
            console.log(`WhatsApp reminder sent for ${reminder.title}`);
            return { success: true, response };
        }
        catch (err) {
            console.error("WhatsApp failed:", err);
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)()
], WhatsappService);
//# sourceMappingURL=WhatsappService.js.map