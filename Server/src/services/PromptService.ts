import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptService {
  // ==================================
  // INVOICE GENERATOR PROMPOT
  // ==================================
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
  // ==================================
  // Prompts for AI Assistent Chat
  // ==================================
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
  // ==================================
  // Prompts for Field extraction
  // ==================================
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
  // ==================================
  // QUOTATION GENERATOR PROMPT
  // ==================================
  QuotationGenerator() {
    return `
      Act as a JSON Data Architect. Your task is to convert a natural language project description
      into a structured Quotation JSON that is ready for review.

      ### TARGET SCHEMA:
      {
        "project_title": "string — short project name",
        "description": "string — 1-2 sentence project summary",
        "client_name": "string — extract from prompt or use 'Client'",
        "client_email": "string | null",
        "currency": "AED",
        "issue_date": "YYYY-MM-DD (today: ${new Date().toISOString().split('T')[0]})",
        "expiry_date": "YYYY-MM-DD (30 days from today if not specified)",
        "line_items": [
          {
            "id": "string (uuid-style)",
            "name": "string — service or product name",
            "description": "string — brief description",
            "quantity": number,
            "unit": "string — e.g. hours, days, items, pages",
            "unit_price": number,
            "discount_pct": 0,
            "tax_pct": 5,
            "line_total": number
          }
        ],
        "subtotal": number,
        "total_discount": 0,
        "total_tax": number,
        "grand_total": number,
        "terms_and_conditions": "string — professional UAE business terms",
        "notes": "string — optional scope notes"
      }

      ### CALCULATION RULES:
      1. line_total = (quantity * unit_price * (1 - discount_pct/100)) * (1 + tax_pct/100)
      2. subtotal = sum of (quantity * unit_price) for all items
      3. total_tax = sum of tax amounts per line (default 5% UAE VAT)
      4. grand_total = subtotal - total_discount + total_tax
      5. Default currency is AED for UAE market.
      6. Break the scope into realistic line items — do not lump everything into one line.

      RETURN ONLY RAW JSON. NO EXPLANATION. NO MARKDOWN.
    `;
  }

  // ==================================
  // QUOTATION SUGGESTION ENGINE PROMPT
  // ==================================
  QuotationSuggestionEngine() {
    return `
      You are a sales intelligence assistant for a UAE-based business platform.
      You will receive a JSON object with recent_quotations (quotation_number, project_title,
      status, client_name, grand_total, expiry_date, viewed_at) and today's date.

      Analyse the data and return a JSON array of up to 5 actionable suggestions.

      Return ONLY this JSON array — no markdown, no explanation:
      [
        {
          "type": "follow_up | expiry_warning | pricing | duplicate | general",
          "quotation_number": "string | null",
          "client_name": "string | null",
          "message": "string — one sentence, specific and actionable",
          "priority": "high | medium | low"
        }
      ]

      SUGGESTION LOGIC:
      - If a quotation status is "viewed" and viewed_at was > 2 days ago → suggest follow-up (high priority)
      - If a quotation expires within 7 days and status is "sent" or "viewed" → expiry_warning (high)
      - If a quotation was rejected → suggest creating a revised version (medium)
      - If no quotations in the last 14 days → suggest creating a new one (low)
      - Keep messages professional, short, and specific (mention quotation number and client name).

      Return ONLY raw JSON array — no preamble, no markdown fences.
    `;
  }

}
