import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplianceHistory } from "./compliance_history.entity";

export class ComplianceHistoryService {
  constructor(
    @InjectRepository(ComplianceHistory)
    private readonly historyRepository: Repository<ComplianceHistory>
  ) {}

  ////////////////////////////////////////////////////////////////
  // GENERIC HISTORY LOGGER
  ////////////////////////////////////////////////////////////////
  async log_event_service(
    user_id: string,
    event_type: string,
    details: string,
    document_id?: string,
    reminder_id?: string,
    company_id?: string
  ) {
    const history = this.historyRepository.create({});
    return await this.historyRepository.save(history);
  }

  ////////////////////////////////////////////////////////////////
  // WHEN DOCUMENT IS UPLOADED
  ////////////////////////////////////////////////////////////////
  async log_document_uploaded_service(
    user_id: string,
    document_id: string,
    filename: string
  ) {
    return this.log_event_service(
      user_id,
      "document_uploaded",
      `Document uploaded: ${filename}`,
      document_id
    );
  }

  ////////////////////////////////////////////////////////////////
  // WHEN AI SUMMARY IS GENERATED
  ////////////////////////////////////////////////////////////////
  async log_ai_summary_generated_service(user_id: string, document_id: string) {
    return this.log_event_service(
      user_id,
      "ai_summary_generated",
      "AI summary generated for document",
      document_id
    );
  }

  ////////////////////////////////////////////////////////////////
  // WHEN REMINDER IS TRIGGERED
  ////////////////////////////////////////////////////////////////
  async log_reminder_triggered_service(
    user_id: string,
    reminder_id: string,
    reminder_title: string
  ) {
    return this.log_event_service(
      user_id,
      "reminder_triggered",
      `Reminder triggered: ${reminder_title}`,
      reminder_id
    );
  }

  ////////////////////////////////////////////////////////////////
  // WHEN DOCUMENT STATUS IS VERIFIED
  ////////////////////////////////////////////////////////////////
  async log_document_verified_service(user_id: string, document_id: string) {
    return this.log_event_service(
      user_id,
      "document_verified",
      `Document marked as verified`,
      document_id
    );
  }

  ////////////////////////////////////////////////////////////////
  // WHEN DOCUMENT IS REJECTED
  ////////////////////////////////////////////////////////////////
  async log_document_rejected_service(
    user_id: string,
    document_id: string,
    reason: string
  ) {
    return this.log_event_service(
      user_id,
      "document_rejected",
      `Document rejected: ${reason}`,
      document_id
    );
  }

  ////////////////////////////////////////////////////////////////
  // WHEN USER ASKS AI A QUESTION
  ////////////////////////////////////////////////////////////////
  async log_ai_chat_service(user_id: string, question: string) {
    return this.log_event_service(user_id, "ai_chat", `User asked AI: ${question}`);
  }

  ////////////////////////////////////////////////////////////////
  // WHEN LICENSE IS RENEWED
  ////////////////////////////////////////////////////////////////
  async log_license_renewed_service(
    user_id: string,
    license_id: string,
    license_type: string
  ) {
    return this.log_event_service(
      user_id,
      "license_renewed",
      `License renewed: ${license_type}`,
      license_id
    );
  }

  ////////////////////////////////////////////////////////////////
  // FETCH HISTORY BY USER
  ////////////////////////////////////////////////////////////////
  async get_user_history_service(user_id: string) {
    return await this.historyRepository.find({
      where: { user_id },
      order: { created_at: "DESC" },
    });
  }

  ////////////////////////////////////////////////////////////////
  // FETCH HISTORY BY DOCUMENT
  ////////////////////////////////////////////////////////////////
  async get_document_history_service(document_id: string) {
    return await this.historyRepository.find({
      where: { uuid: document_id },
      order: { created_at: "DESC" },
    });
  }

  ////////////////////////////////////////////////////////////////
  // FETCH HISTORY BY REMINDER
  ////////////////////////////////////////////////////////////////
  async get_reminder_history_service(reminder_id: string) {
    return await this.historyRepository.find({
      where: {},
      order: { created_at: "DESC" },
    });
  }

  ////////////////////////////////////////////////////////////////
  // FETCH HISTORY BY EVENT TYPE
  ////////////////////////////////////////////////////////////////
  async get_by_event_type_service(event_type: string) {
    return await this.historyRepository.find({
      where: { event_type },
      order: { created_at: "DESC" },
    });
  }

  ////////////////////////////////////////////////////////////////
  // DELETE SINGLE HISTORY LOG
  ////////////////////////////////////////////////////////////////
  async delete_history_entry_service(id: string) {
    return await this.historyRepository.delete({ uuid: id });
  }

  ////////////////////////////////////////////////////////////////
  // CLEAR ALL HISTORY OF USER
  ////////////////////////////////////////////////////////////////
  async clear_user_history_service(user_id: string) {
    return await this.historyRepository.delete({ user_id });
  }
}
