import { Injectable, HttpException, NotFoundException } from "@nestjs/common";
import { FindOperator, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ComplianceDocument,
  DocumentStatus,
} from "./compliance_documents.entity";
import { PdfService } from "src/services/PdfService";
import { OpenAIService } from "src/services/OpenAIService";
import * as fs from "fs";
import path from "path";
@Injectable()
export class ComplianceDocumentsService {
  constructor(
    @InjectRepository(ComplianceDocument)
    private readonly documentRepository: Repository<ComplianceDocument>,
    private readonly pdf_service: PdfService,
    private readonly Openai_service: OpenAIService
  ) {}
  ///////////////////////////////////////////////////////
  // UPLAOD COMPLIANCE DOCS
  ///////////////////////////////////////////////////////
  async upload_document_service(data) {
    const doc = this.documentRepository.create({
      user_id: data.user_id,
      reminder_id: data.reminder_id,
      document_type: data.document_type,
      filename: data.filename,
      file_url: data.file_url,
    });
    const result = await this.documentRepository.save(doc);
    return result;
  }

  ///////////////////////////////////////////////////////
  // GET ALL USER DOCUMENTS
  ///////////////////////////////////////////////////////
  async get_user_document_service(userId: string, reminderId?: string) {
    const response = await this.documentRepository.find({
      where: { user_id: userId, reminder_id: reminderId },
    });
    return response;
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE DOCUMENTS
  ///////////////////////////////////////////////////////
  async get_single_document_service(documentId: string) {
    const doc = await this.documentRepository.findOne({
      where: { uuid: documentId },
    });
    if (!doc) {
      throw new HttpException("Document not found", 404);
    }
    return doc;
  }

  ///////////////////////////////////////////////////////
  // UPDATE SINLGE DOCUMENT
  ///////////////////////////////////////////////////////
  async update_document_service(
    documentId: string,
    updates: Partial<ComplianceDocument>
  ) {
    const doc = await this.get_single_document_service(documentId);
    Object.assign(doc, updates);
    const result = await this.documentRepository.save(doc);
    return result;
  }

  ///////////////////////////////////////////////////////
  // VERIFY DOCUMENT
  ///////////////////////////////////////////////////////
  async verify_document_service(documentId: string) {
    return await this.update_document_service(documentId, {
      status: DocumentStatus.VERIFIED,
    });
  }

  ///////////////////////////////////////////////////////
  // REJECT DOCUMENT
  ///////////////////////////////////////////////////////
  async reject_document_service(documentId: string) {
    return await this.update_document_service(documentId, {
      status: DocumentStatus.REJECTED,
    });
  }

  //////////////////////////////////////////////////////////////////////
  // ATTACH AI DOCUMENT SUMMARY
  //////////////////////////////////////////////////////////////////////
  async attach_ai_summary_service(documentId: string) {
    const find_document: any = await this.documentRepository.findOne({
      where: { uuid: documentId },
    });
    if (!find_document) {
      return { message: "document not found" };
    }
    const { filename }: any = find_document;
    const filePath = `${process.cwd()}/public/uploads/${filename}`;
    const text_response: any =
      await this.pdf_service.PDFToTextConverter(filePath);
    const response: any =
      await this.Openai_service.summarize_document(text_response);
    const result = await this.update_document_service(documentId, {
      ai_summary: response,
    });
    return result;
  }

  ///////////////////////////////////////////////////////
  // DELETE SINLGE DOCUMENT
  ///////////////////////////////////////////////////////
  async delete_document_service(documentId: string) {
    const docs = await this.documentRepository.findOne({
      where: { uuid: documentId },
    });
    if (!docs) throw new NotFoundException("docs not found");
    if (docs.filename) {
      const filePath = path.join(
        __dirname,
        "../../public/uploads",
        docs.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    const doc = await this.get_single_document_service(documentId);
    const result = await this.documentRepository.remove(doc);
    return result;
  }
}
