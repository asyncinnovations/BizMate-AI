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
    DocumentGenerator() {
        return `
      You are a professional legal and business document drafter specialising in UAE and GCC markets.
      A user will describe a document they need in plain language.
      Your job is to produce a full, professional, well-structured document draft and return it as a JSON object.

      Return ONLY this JSON structure — no markdown, no explanation, no code blocks:
      {
        "document_name": "string — descriptive name, e.g. NDA — Tech Solutions LLC",
        "document_type": "string — e.g. NDA, Employment Contract, Service Agreement, Proposal",
        "category": "string — one of: Legal, HR, Finance, Operations, Business",
        "content": "string — the full document text with proper section headings, clauses, and formatting. Use clear section headers (1. PARTIES, 2. DEFINITIONS, etc.)",
        "field_values": {
          "key": "value"
        },
        "compliance_score": number between 70 and 100,
        "compliance_notes": [
          { "type": "ok", "message": "string" },
          { "type": "warning", "message": "string" }
        ]
      }

      RULES:
      1. All documents must be UAE/GCC compliant where applicable.
      2. Include jurisdiction, governing law, and signature blocks.
      3. Write in professional, formal English.
      4. compliance_score should honestly reflect how complete and legally sound the draft is.
      5. Return ONLY raw JSON — no markdown fences, no preamble, no explanation.
    `;
    }
    DocumentComplianceChecker() {
        return `
      You are a UAE legal compliance expert reviewing business documents for completeness and risk.
      You will receive a JSON object with document_type, category, and content.
      Analyse the content and return a compliance report as JSON.

      Return ONLY this JSON structure — no markdown, no code blocks:
      {
        "compliance_score": number between 0 and 100,
        "compliance_notes": [
          { "type": "ok",      "message": "string — what is correct" },
          { "type": "warning", "message": "string — what should be reviewed" },
          { "type": "error",   "message": "string — what is missing or risky" }
        ]
      }

      SCORING GUIDE:
      - 90–100: Complete, legally sound, all standard clauses present
      - 75–89:  Good structure, minor omissions or recommendations
      - 60–74:  Usable but missing important clauses
      - Below 60: Significant issues — document should not be used as-is

      RULES:
      1. Check for: governing law, jurisdiction, parties, definitions, termination clause, signature blocks.
      2. For UAE documents: check for UAE Labour Law 2022 compliance (HR), DIFC/ADGM/Dubai courts jurisdiction (Legal).
      3. Keep each note concise — one sentence.
      4. Return ONLY raw JSON — no markdown, no preamble.
    `;
    }
    DocumentSuggestionEngine() {
        return `
      You are a business operations assistant for a UAE-based platform.
      You will receive a JSON object containing a list of recently generated documents (document_type, category, created_at).
      Based on this activity, suggest 3–5 logical next documents the user should create.

      Return ONLY a JSON array — no markdown, no code blocks:
      [
        {
          "document_type": "string — e.g. Offer Letter",
          "category": "string — e.g. HR",
          "reason": "string — one sentence explaining why this is recommended"
        }
      ]

      SUGGESTION LOGIC:
      - If user created an Employment Contract → suggest Offer Letter, NDA (same employee), Payroll Setup reminder
      - If user created an NDA → suggest Service Agreement, Project Proposal
      - If user created a Service Agreement → suggest Invoice, Project Proposal
      - If user created a Proposal → suggest Service Agreement, NDA
      - If no clear pattern → suggest: NDA, Service Agreement, Business Proposal
      - Never suggest a document type the user has already generated in the last 7 days.
      - Keep reasons short and business-relevant.
      - Return ONLY raw JSON array — no markdown, no explanation.
    `;
    }
    InvoiceInsightsAnalyser() {
        return `
      You are a financial intelligence engine for a business invoicing platform.
      You will receive a JSON object containing an invoice and the customer's past payment history.
      Analyse this data and return a JSON object with the following fields:
      {
        "payment_prediction_days": number,
        "late_payment_risk_percent": number,
        "suggested_action": "string",
        "client_payment_pattern": "string",
        "reminder_date": "YYYY-MM-DD"
      }
      RULES:
      1. If there is no payment history, use conservative defaults (30% risk, 14 days, generic advice).
      2. Keep suggested_action short — one sentence, professional.
      3. Keep client_payment_pattern under 20 words.
      4. Return ONLY raw JSON. No markdown, no code blocks.
    `;
    }
};
exports.PromptService = PromptService;
exports.PromptService = PromptService = __decorate([
    (0, common_1.Injectable)()
], PromptService);
//# sourceMappingURL=PromptService.js.map