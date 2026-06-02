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
    InvoiceGenerator() {
        return `
        Act as a JSON Data Architect. Your goal is to convert a natural language user request into a structured Invoice JSON. 

        ### TARGET SCHEMA:
        {
          "invoice_name": "string (e.g., 'Modern Corporate')",
          "invoice_type": "string (e.g., 'Business')",
          "user_id": null,
          "invoice_number": "string (format: INV-YYYY-XXXX)",
          "customer_name": "string",
          "customer_email": "string",
          "customer_address": "string",
          "invoice_date": "string (YYYY-MM-DD)",
          "due_date": "string (YYYY-MM-DD)",
          "payment_terms": "string",
          "subtotal": number,
          "vat": number,
          "total": number,
          "notes": "string",
          "status": "unpaid",
          "custom_fields": [{ "label": "string", "value": "string" }],
          "invoice_items": [{ "id": "string", "name": "string", "price": number, "quantity": number, "amount": number, "description": "string" }]
        }

        ### EXTRACTION RULES:
        1. **Invoice Number**: Generate a unique sequence based on the current year 2026.
        2. **Items**: Identify products/services, their quantities, and unit prices. 
        3. **Calculations**: 
          - item.amount = quantity * price
          - subtotal = sum of all item.amounts
          - vat = subtotal * 0.05 (Default to 5% for UAE/Nogorsheba standard)
          - total = subtotal + vat
        4. **Dates**: If not mentioned, set 'invoice_date' to today (${new Date().toISOString().split("T")[0]}) and 'due_date' to 15 days from now.
        5. **Custom Fields**: Place information like 'Project Name', 'PO Number', or 'Reference' here.

        RETURN ONLY RAW JSON. NO EXPLANATION.
    `;
    }
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
    InvoiceInsightsAnalyser() {
        return `
      You are a financial intelligence engine for a business invoicing platform.
      You will receive a JSON object containing an invoice and the customer's past payment history.

      Your job is to analyse this data and return a JSON object with the following fields:

      {
        "payment_prediction_days": number,        // How many days from now you predict payment will arrive
        "late_payment_risk_percent": number,       // A 0-100 risk score. 0 = no risk, 100 = almost certain late
        "suggested_action": "string",              // One clear, human-friendly action the business should take
        "client_payment_pattern": "string",        // One sentence describing how this client typically pays
        "reminder_date": "YYYY-MM-DD"              // Recommended date to send a payment reminder
      }

      RULES:
      1. If there is no payment history, use conservative defaults (30% risk, 14 days, generic advice).
      2. Keep suggested_action short — one sentence, professional, no jargon.
      3. Keep client_payment_pattern under 20 words.
      4. RETURN ONLY RAW JSON. No explanation, no markdown, no code blocks.
    `;
    }
};
exports.PromptService = PromptService;
exports.PromptService = PromptService = __decorate([
    (0, common_1.Injectable)()
], PromptService);
//# sourceMappingURL=PromptService.js.map