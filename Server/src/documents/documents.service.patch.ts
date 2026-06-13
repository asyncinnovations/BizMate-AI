// src/documents/documents.service.ts — PATCH FILE
// Shows only the two changed methods. Replace these exact methods in the full service.
//
// CHANGES:
// 1. update_document_status_service — adds server-side transition validation
//    so a finalised doc cannot be set back to draft via direct API call
// 2. generate_docx_service — new method for DOCX export via docx npm package

// ─────────────────────────────────────────────────────────────────────────────
// REPLACE update_document_status_service WITH THIS:
// ─────────────────────────────────────────────────────────────────────────────

/*
  // Valid transitions map — defines what statuses a document can move TO
  // from each current status. Prevents illegal backward transitions.
  private readonly ALLOWED_TRANSITIONS: Record<string, string[]> = {
    draft:        ["ai_generated", "under_review", "archived"],
    ai_generated: ["under_review", "draft", "archived"],
    under_review: ["approved", "draft", "archived"],
    approved:     ["finalised", "under_review", "archived"],
    finalised:    ["archived"],          // finalised can ONLY be archived — not reverted
    archived:     [],                    // archived is terminal — no transitions out
  };

  async update_document_status_service(uuid: string, new_status: string) {
    const valid = Object.values(DocumentStatus) as string[];
    if (!valid.includes(new_status)) {
      throw new BadRequestException(
        `Invalid status "${new_status}". Allowed: ${valid.join(", ")}`,
      );
    }

    const doc = await this.single_document_service(uuid);

    // FIX: Enforce transition rules server-side.
    // Previously any status was accepted regardless of current state.
    const allowed = this.ALLOWED_TRANSITIONS[doc.status] ?? [];
    if (!allowed.includes(new_status)) {
      throw new BadRequestException(
        `Cannot transition from "${doc.status}" to "${new_status}". ` +
        `Allowed transitions: ${allowed.length ? allowed.join(", ") : "none (terminal state)"}.`
      );
    }

    const updated_log = this.append_log(doc.activity_log ?? [], new_status);

    await this.docsRepo.query(
      `UPDATE generated_documents
       SET status = $1, activity_log = $2::jsonb, updated_at = NOW()
       WHERE uuid = $3`,
      [new_status, JSON.stringify(updated_log), uuid],
    );

    return {
      message:      `Document status updated to "${new_status}"`,
      uuid,
      status:       new_status,
      activity_log: updated_log,
    };
  }
*/

// ─────────────────────────────────────────────────────────────────────────────
// ADD generate_docx_service as a new method at the bottom of the service:
// ─────────────────────────────────────────────────────────────────────────────

/*
  // ADD THIS IMPORT at top of documents.service.ts:
  // import { Document, Paragraph, TextRun, Packer, HeadingLevel } from "docx";
  // import * as fs from "fs";
  // import { join } from "path";
  //
  // ADD "docx" to package.json dependencies:
  // npm install docx

  async generate_docx_service(uuid: string) {
    const doc = await this.single_document_service(uuid);

    if (!doc.content && !doc.field_values) {
      throw new BadRequestException("Document has no content to export.");
    }

    // Build paragraphs from content or field_values
    const paragraphs: Paragraph[] = [];

    // Document title
    paragraphs.push(
      new Paragraph({
        text:    doc.document_name,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 },
      })
    );

    // Add metadata line
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Type: ${doc.document_type ?? "—"}  |  Category: ${doc.category ?? "—"}`, color: "888888", size: 18 }),
        ],
        spacing: { after: 200 },
      })
    );

    // If AI-generated content is available, render it as body text
    if (doc.content) {
      const lines = doc.content.split("\n").filter(Boolean);
      for (const line of lines) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line, size: 22 })],
            spacing: { after: 160 },
          })
        );
      }
    } else if (doc.field_values) {
      // Render key-value pairs for template-based documents
      const flatten = (obj: any, prefix = "") => {
        const rows: [string, string][] = [];
        for (const [k, v] of Object.entries(obj)) {
          const label = prefix ? `${prefix} — ${k}` : k;
          if (v && typeof v === "object") rows.push(...flatten(v as any, label));
          else rows.push([label, String(v ?? "")]);
        }
        return rows;
      };
      for (const [label, value] of flatten(doc.field_values)) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${label}: `, bold: true, size: 22 }),
              new TextRun({ text: value, size: 22 }),
            ],
            spacing: { after: 120 },
          })
        );
      }
    }

    // Signature block
    paragraphs.push(
      new Paragraph({ text: "", spacing: { before: 600 } }),
      new Paragraph({ children: [new TextRun({ text: "________________________", size: 22 })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "Authorised Signature", size: 18, color: "666666" })] }),
    );

    const wordDoc = new Document({ sections: [{ properties: {}, children: paragraphs }] });

    const filename = `${Date.now()}-${uuid}-document.docx`;
    const filePath = join(__dirname, `../../public/uploads/${filename}`);

    const buffer = await Packer.toBuffer(wordDoc);
    fs.writeFileSync(filePath, buffer);

    const url = `/public/uploads/${filename}`;
    await this.set_document_file_paths_service(uuid, { docx_path: url });

    return {
      message:   "DOCX generated successfully.",
      url,
      uuid,
      docx_path: url,
    };
  }
*/

export const DOCUMENTS_SERVICE_PATCH_NOTES = `
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
