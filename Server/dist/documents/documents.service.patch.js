"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCUMENTS_SERVICE_PATCH_NOTES = void 0;
exports.DOCUMENTS_SERVICE_PATCH_NOTES = `
WHAT TO DO:

1. INSTALL docx package (for DOCX export):
   npm install docx
   (in your server/ directory)

2. ADD import at top of src/documents/documents.service.ts:
   import { Document, Paragraph, TextRun, Packer, HeadingLevel } from "docx";
   import * as fs from "fs";
   import { join } from "path";

3. ADD the ALLOWED_TRANSITIONS map as a private property of DocumentsService class.

4. REPLACE update_document_status_service with the version above that
   checks ALLOWED_TRANSITIONS before applying the status change.

5. ADD generate_docx_service as a new method at the bottom of DocumentsService.

6. ADD the DOCX endpoint to documents.controller.ts (see documents.controller.patch.ts).

STATUS TRANSITION RULES (what is allowed):
  draft         → ai_generated | under_review | archived
  ai_generated  → under_review | draft | archived
  under_review  → approved | draft | archived
  approved      → finalised | under_review | archived
  finalised     → archived only (TERMINAL — cannot revert to any active status)
  archived      → nothing (TERMINAL)

WHY: Previously PATCH /documents/status/:uuid accepted any valid status string
regardless of the current state. A finalised document could be moved back to
draft by a direct API call, bypassing the approval workflow entirely.
`;
//# sourceMappingURL=documents.service.patch.js.map