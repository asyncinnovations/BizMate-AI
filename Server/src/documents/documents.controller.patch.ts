// src/documents/documents.controller.ts — ADD THIS ENDPOINT
//
// Add this method to the DocumentsController class in documents.controller.ts.
// Place it after the existing generate_pdf method.
//
// REQUIRES: generate_docx_service added to documents.service.ts (see documents.service.patch.ts)

/*
  // ─────────────────────────────────────────────────────────────────────────
  // POST /documents/generate-docx/:uuid
  // Generates a .docx file from the document content/fields.
  // Saves the path to docx_path column. Returns download URL.
  // ─────────────────────────────────────────────────────────────────────────
  @Post("generate-docx/:uuid")
  @HttpCode(HttpStatus.OK)
  async generate_docx(@Param("uuid") uuid: string) {
    if (!uuid) throw new BadRequestException("Document UUID is required.");
    return await this.documentsService.generate_docx_service(uuid);
  }
*/

export const CONTROLLER_PATCH_NOTES = `
ADD the generate_docx endpoint to DocumentsController.
Full method is shown in the comment block above.
Place it after the existing generate_pdf method (around line 155).
`;
