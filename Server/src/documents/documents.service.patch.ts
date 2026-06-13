// src/documents/documents.service.PATCH.ts
// Apply to update_document_status_service after status is updated.

/*
    // ── NOTIFICATION: Document finalised ─────────────────────────────────
    if (new_status === "finalised") {
      const [userRow] = (await this.docsRepo.query(
        `SELECT u.email, u.full_name FROM users u WHERE u.uuid = $1`,
        [doc.user_id],
      )) ?? [];

      if (userRow?.email) {
        await this.notificationsService.create_and_send_service({
          user_id:           doc.user_id,
          user_email:        userRow.email,
          user_full_name:    userRow.full_name,
          event_type:        "document_finalised",
          notification_type: NotificationType.EMAIL,
          document_id:       doc.uuid,
          reference_id:      doc.uuid,
          title:             `Document finalised: ${doc.document_name}`,
          message:           `Your document "${doc.document_name}" has been finalised`,
          email_subject:     `📄 Document finalised: ${doc.document_name}`,
          email_html:        EmailTemplates.documentFinalised({
            document_name: doc.document_name,
            document_type: doc.document_type,
            full_name:     userRow.full_name,
          }),
        });
      }

      await this.notificationsService.create_notification_service({
        user_id:           doc.user_id,
        document_id:       doc.uuid,
        event_type:        "document_finalised",
        notification_type: NotificationType.DASHBOARD,
        title:             `Document finalised`,
        message:           `"${doc.document_name}" has been finalised and locked`,
      });
    }
*/

export const DOCUMENTS_NOTIFICATION_PATCH = "See comments above.";
