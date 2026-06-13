// src/quotations/quotations.service.PATCH.ts
// Apply these changes to QuotationsService.client_action_service
// after the UPDATE query, before the return statement.

/*
import { NotificationsService } from "src/notifications/notifications.service";
import { ResendService, EmailTemplates } from "src/services/ResendService";
import { NotificationType } from "src/notifications/notifications.entity";

// In client_action_service, after the UPDATE query:

    // Fetch user details
    const [userRow] = (await this.quotationsRepo.query(
      `SELECT u.email, u.full_name FROM users u WHERE u.uuid = $1`,
      [q.user_id],
    )) ?? [];

    if (action === "accept" && userRow?.email) {
      // EMAIL to the business owner
      await this.notificationsService.create_and_send_service({
        user_id:           q.user_id,
        user_email:        userRow.email,
        user_full_name:    userRow.full_name,
        event_type:        "quotation_accepted",
        notification_type: NotificationType.EMAIL,
        reference_id:      q.uuid,
        title:             `Quotation ${q.quotation_number} accepted`,
        message:           `${q.client_name} accepted your quotation`,
        email_subject:     `🎉 Quotation ${q.quotation_number} Accepted by ${q.client_name}`,
        email_html:        EmailTemplates.quotationAccepted({
          quotation_number: q.quotation_number,
          project_title:    q.project_title,
          client_name:      q.client_name,
          full_name:        userRow.full_name,
        }),
      });

      // DASHBOARD notification
      await this.notificationsService.create_notification_service({
        user_id:           q.user_id,
        event_type:        "quotation_accepted",
        notification_type: NotificationType.DASHBOARD,
        reference_id:      q.uuid,
        title:             `Quotation ${q.quotation_number} accepted`,
        message:           `${q.client_name} accepted your quotation`,
      });
    }

    if (action === "reject" && userRow?.email) {
      await this.notificationsService.create_and_send_service({
        user_id:           q.user_id,
        user_email:        userRow.email,
        user_full_name:    userRow.full_name,
        event_type:        "quotation_rejected",
        notification_type: NotificationType.EMAIL,
        reference_id:      q.uuid,
        title:             `Quotation ${q.quotation_number} rejected`,
        message:           `${q.client_name} declined your quotation`,
        email_subject:     `Quotation ${q.quotation_number} Rejected`,
        email_html:        EmailTemplates.quotationRejected({
          quotation_number: q.quotation_number,
          client_name:      q.client_name,
          client_comment:   comment,
          full_name:        userRow.full_name,
        }),
      });

      await this.notificationsService.create_notification_service({
        user_id:           q.user_id,
        event_type:        "quotation_rejected",
        notification_type: NotificationType.DASHBOARD,
        reference_id:      q.uuid,
        title:             `Quotation ${q.quotation_number} rejected`,
        message:           `${q.client_name} declined your quotation`,
      });
    }
*/

export const QUOTATIONS_NOTIFICATION_PATCH = "See comments above.";
