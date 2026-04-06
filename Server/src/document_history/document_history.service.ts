import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, Like } from "typeorm";
import { DocumentHistory } from "./document_history.entity";

@Injectable()
export class DocumentHistoryService {
  constructor(
    @InjectRepository(DocumentHistory)
    private readonly documentRepo: Repository<DocumentHistory>,
  ) {}

  // ==============================
  // CREATE Save new document
  // ==============================
  async create_document_service(data: {
    user_id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    raw_text?: string;
    parsed_data?: any;
    storage_path?: string;
  }): Promise<DocumentHistory> {
    const doc = this.documentRepo.create({
      ...data,
      status: "pending",
    });
    return this.documentRepo.save(doc);
  }

  // ==============================
  // Get document by UUID
  // ==============================
  async get_document_by_uuid_service(
    uuid: string,
  ): Promise<DocumentHistory | null> {
    return this.documentRepo.findOne({ where: { uuid } });
  }

  // ==============================
  // Get all documents for a user
  // ==============================
  async get_documents_by_user_service(
    user_id: string,
  ): Promise<DocumentHistory[]> {
    return this.documentRepo.find({
      where: { user_id },
      order: { uploaded_at: "DESC" },
    });
  }

  // ==============================
  // Search documents by file_name or raw_text
  // ==============================
  async search_documents_service(
    user_id: string,
    keyword: string,
  ): Promise<DocumentHistory[]> {
    const options: FindManyOptions<DocumentHistory> = {
      where: [
        { user_id, file_name: Like(`%${keyword}%`) },
        { user_id, raw_text: Like(`%${keyword}%`) },
      ],
      order: { uploaded_at: "DESC" },
    };
    return this.documentRepo.find(options);
  }

  // ==============================
  // Update document status
  // ==============================
  async update_status_service(
    uuid: string,
    status: "pending" | "processed" | "failed",
  ): Promise<void> {
    await this.documentRepo.update({ uuid }, { status });
  }

  // ==============================
  // Update parsed_data
  // ==============================
  async update_parsed_data_service(
    uuid: string,
    parsedData: any,
  ): Promise<void> {
    await this.documentRepo.update({ uuid }, { parsed_data: parsedData });
  }

  // ==============================
  // Delete document by UUID
  // ==============================
  async delete_document_service(uuid: string): Promise<void> {
    await this.documentRepo.delete({ uuid });
  }

  // ==============================
  // List all pending documents for processing
  // ==============================
  async get_pending_documents_service(): Promise<DocumentHistory[]> {
    return this.documentRepo.find({
      where: { status: "pending" },
      order: { uploaded_at: "ASC" },
    });
  }

  // ==============================
  // Documents expiring soon (if expiry_date exists in parsed_data)
  // ==============================
  async get_documents_expiring_within_service(
    days: number,
  ): Promise<DocumentHistory[]> {
    const now = new Date();
    const target = new Date();
    target.setDate(now.getDate() + days);

    return this.documentRepo
      .createQueryBuilder("doc")
      .where(`doc.parsed_data->>'expiry_date' IS NOT NULL`)
      .andWhere(
        `doc.parsed_data->>'expiry_date'::date BETWEEN :now AND :target`,
        { now, target },
      )
      .orderBy("doc.parsed_data->>'expiry_date'")
      .getMany();
  }
}
