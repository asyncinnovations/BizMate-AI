# BizMate Smart Invoicing — API Changes

## Files Changed

| File | Action |
|---|---|
| `invoices/invoices.entity.ts` | Updated |
| `invoices/invoices.service.ts` | Updated |
| `invoices/invoices.controller.ts` | Updated |
| `invoices/invoices.module.ts` | Cleaned up (no logic changes) |
| `services/PromptService.ts` | New method added |
| `migrations/20260601000001-invoices-add-source-activity-log.js` | New migration |
| `POSTMAN_COLLECTION.json` | New — import into Postman |

---

## Entity changes (`invoices.entity.ts`)

Two new columns added to the `invoices` table:

| Column | Type | Default | Purpose |
|---|---|---|---|
| `source` | varchar(50) | `"manual"` | Where the invoice came from: manual / ai / duplicate / template / recurring |
| `activity_log` | jsonb | `[]` | Array of `{ status, timestamp }` — powers the status timeline in the frontend |

Also added:
- `InvoiceStatus` enum — all valid status values in one place
- `InvoiceSource` enum — all valid source values

**Run the migration** before testing:
```
npx sequelize-cli db:migrate
```

---

## Updated endpoints

### `PATCH /invoices/update/status/:id`
**What changed:** Now validates that the status is a recognised lifecycle value before saving.
Returns 400 if an invalid status is passed.
Appends the transition to `activity_log` automatically — no extra call needed.

**Valid statuses:** `draft | saved | sent | viewed | paid | unpaid | overdue | archived`

**Response now includes:**
```json
{
  "message": "Invoice status updated to \"sent\"",
  "uuid": "...",
  "status": "sent",
  "activity_log": [
    { "status": "draft", "timestamp": "2026-06-01T10:00:00Z" },
    { "status": "sent",  "timestamp": "2026-06-01T11:30:00Z" }
  ]
}
```

### `POST /invoices/send_to_email`
**What changed:** Now auto-updates the invoice status to `"sent"` after the email is dispatched.
No extra PATCH call needed from the frontend.

### `POST /invoices/create`
**What changed:** Accepts two new optional fields: `source` and `status`.
`activity_log` is initialised automatically on creation.

---

## New endpoints

### `POST /invoices/duplicate`
Creates a clean copy of an existing invoice.

**Body:**
```json
{
  "invoice_id": "uuid-of-original",
  "user_id":    "uuid-of-requesting-user"
}
```

**Returns:** The new invoice object with:
- Auto-generated invoice number (INV-YYYY-XXXX)
- `status: "draft"`
- `source: "duplicate"`
- Fresh `activity_log`
- `invoice_pdf: null`

---

### `GET /invoices/ai-insights/:invoice_id`
Returns AI-generated payment intelligence for a specific invoice. **Pro/Enterprise only** (enforce on frontend via plan check).

**Returns:**
```json
{
  "message": "AI insights generated",
  "insights": {
    "payment_prediction_days":   4,
    "late_payment_risk_percent": 18,
    "suggested_action":          "Send a reminder on the due date if unpaid.",
    "client_payment_pattern":    "Acme typically pays within 8 days.",
    "reminder_date":             "2026-06-14",
    "invoice_uuid":              "...",
    "customer_name":             "Acme Corporation"
  }
}
```

---

### `GET /invoices/ai-suggestions?user_id=&customer_name=`
Returns contextual suggestions for the create-form sidebar. **Pro/Enterprise only.**

**Query params:**
- `user_id` — required
- `customer_name` — required, partial match supported

**Returns:**
```json
{
  "message":         "Suggestions generated",
  "suggestions": [
    { "name": "SEO Service", "suggested_price": 2500, "times_used": 6 },
    { "name": "Logo Design", "suggested_price": 1200, "times_used": 3 }
  ],
  "payment_pattern":    "Acme typically pays within 8 days. 90% on-time.",
  "overdue_count":      1,
  "payment_rate":       90,
  "pricing_tip":        "Services range from AED 1,200 to AED 2,500 with this client.",
  "professional_notes": "Thank you for your continued business..."
}
```

---

## Postman testing order

1. **Create an invoice** → copy the `uuid` from the response
2. **Set `invoice_id` variable** in Postman to that uuid
3. **Update status to "sent"** → verify `activity_log` has 2 entries
4. **Update status to "viewed"** → verify `activity_log` has 3 entries
5. **Update status to "banana"** → verify 400 response
6. **Duplicate invoice** → verify new invoice number and `source: "duplicate"`
7. **Get AI Insights** → verify response shape (will call GPT — needs API key)
8. **Get AI Suggestions** → use your real user_id and a customer name from existing invoices
