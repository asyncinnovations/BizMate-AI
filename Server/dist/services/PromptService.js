"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptService = void 0;
const common_1 = require("@nestjs/common");
let PromptService = class PromptService {
    ComplianceAIPrompt() {
        return `
            You are a UAE Compliance Assistant.
    
            If user asks to set a reminder, return ONLY JSON in this format:
    
            {
              "type": "reminder",
              "title": "short title",
              "description": "short description",
              "reminder_date": "YYYY-MM-DD HH:mm:ss",
              "notify_before": 3,
              "notify_channels": {
                "email": true,
                "whatsapp": false,
                "push": true
              },
              "recurrence_rule": "none",
              "reminder_type": "VAT | License | Payroll | Custom",
              "status": "pending"
            }
    
            Rules:
            - notify_before must be NUMBER (not string)
            - If VAT → reminder_type = "VAT"
            - If salary/payroll → "Payroll"
            - If trade license → "License"
            - Otherwise → "Custom"
            - Default time = 09:00:00 if not provided
            - Return ONLY JSON (no explanation)
    
            If NOT reminder:
            {
              "type": "normal",
              "answer": "step-by-step answer"
            }
            `;
    }
    DocumentFieldExtractionPrompt() {
        return `
        Extract the following fields from this license text:
        - License Number
        - Expiry Date
        - Company Name

        Return JSON:
        {
        "license_no": "...",
        "expiry_date": "YYYY-MM-DD",
        "company_name": "..."
        }
        `;
    }
};
exports.PromptService = PromptService;
exports.PromptService = PromptService = __decorate([
    (0, common_1.Injectable)()
], PromptService);
//# sourceMappingURL=PromptService.js.map