import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  Query,
} from "@nestjs/common";
import { ComplianceHistoryService } from "./compliance_history.service";

@Controller("compliance-history")
export class ComplianceHistoryController {
  constructor(private readonly historyService: ComplianceHistoryService) {}

  //////////////////////////////////////////////////////
  // LOG A GENERIC EVENT
  //////////////////////////////////////////////////////
  @Post("log")
  async log_event(@Body() body, @Req() req) {
    return this.historyService.log_event_service(
      req.user.id,
      body.event_type,
      body.details,
      body.document_id,
      body.reminder_id,
      body.company_id
    );
  }

  //////////////////////////////////////////////////////
  // LOG DOCUMENT UPLOADED
  //////////////////////////////////////////////////////
  @Post("document-uploaded")
  async log_document_uploaded(@Body() body, @Req() req) {
    return this.historyService.log_document_uploaded_service(
      req.user.id,
      body.document_id,
      body.filename
    );
  }

  //////////////////////////////////////////////////////
  // LOG AI SUMMARY GENERATED
  //////////////////////////////////////////////////////
  @Post("ai-summary")
  async logAiSummary(@Body() body, @Req() req) {
    return this.historyService.log_ai_summary_generated_service(
      req.user.id,
      body.document_id
    );
  }

  //////////////////////////////////////////////////////
  // LOG REMINDER TRIGGERED
  //////////////////////////////////////////////////////
  @Post("reminder-triggered")
  async logReminder(@Body() body, @Req() req) {
    return this.historyService.log_reminder_triggered_service(
      req.user.id,
      body.reminder_id,
      body.reminder_title
    );
  }

  //////////////////////////////////////////////////////
  // LOG DOCUMENT VERIFIED
  //////////////////////////////////////////////////////
  @Post("document-verified")
  async logDocumentVerified(@Body() body, @Req() req) {
    return this.historyService.log_document_verified_service(
      req.user.id,
      body.document_id
    );
  }

  //////////////////////////////////////////////////////
  // LOG DOCUMENT REJECTED
  //////////////////////////////////////////////////////
  @Post("document-rejected")
  async logDocumentRejected(@Body() body, @Req() req) {
    return this.historyService.log_document_rejected_service(
      req.user.id,
      body.document_id,
      body.reason
    );
  }

  //////////////////////////////////////////////////////
  // LOG AI CHAT
  //////////////////////////////////////////////////////
  @Post("ai-chat")
  async logAiChat(@Body() body, @Req() req) {
    return this.historyService.log_ai_chat_service(req.user.id, body.question);
  }

  //////////////////////////////////////////////////////
  // LOG LICENSE RENEWED
  //////////////////////////////////////////////////////
  @Post("license-renewed")
  async logLicenseRenewed(@Body() body, @Req() req) {
    return this.historyService.log_license_renewed_service(
      req.user.id,
      body.license_id,
      body.license_type
    );
  }

  //////////////////////////////////////////////////////
  // GET HISTORY BY USER
  //////////////////////////////////////////////////////
  @Get("user")
  async getUserHistory(@Req() req) {
    return this.historyService.get_user_history_service(req.user.id);
  }

  //////////////////////////////////////////////////////
  // GET HISTORY BY DOCUMENT
  //////////////////////////////////////////////////////
  @Get("document/:documentId")
  async getDocumentHistory(@Param("documentId") documentId: string) {
    return this.historyService.get_document_history_service(documentId);
  }

  //////////////////////////////////////////////////////
  // GET HISTORY BY REMINDER
  //////////////////////////////////////////////////////
  @Get("reminder/:reminderId")
  async getReminderHistory(@Param("reminderId") reminderId: string) {
    return this.historyService.get_reminder_history_service(reminderId);
  }

  //////////////////////////////////////////////////////
  // GET HISTORY BY EVENT TYPE
  //////////////////////////////////////////////////////
  @Get("event/:eventType")
  async getByEventType(@Param("eventType") eventType: string) {
    return this.historyService.get_by_event_type_service(eventType);
  }

  //////////////////////////////////////////////////////
  // DELETE SINGLE HISTORY ENTRY
  //////////////////////////////////////////////////////
  @Delete(":uuid")
  async deleteHistoryEntry(@Param("uuid") uuid: string) {
    return this.historyService.delete_history_entry_service(uuid);
  }

  //////////////////////////////////////////////////////
  // CLEAR ALL USER HISTORY
  //////////////////////////////////////////////////////
  @Delete("clear/all")
  async clearUserHistory(@Req() req) {
    return this.historyService.clear_user_history_service(req.user.id);
  }
}
