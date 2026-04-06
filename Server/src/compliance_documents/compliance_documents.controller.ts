import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  HttpException,
  HttpStatus,
  HttpCode,
  UploadedFile,
} from "@nestjs/common";
import { UploadFile } from "src/common/decorators/upload.decorator";
import { ComplianceDocumentsService } from "./compliance_documents.service";
import { join } from "path";
import { DocumentHistoryService } from "src/document_history/document_history.service";
import { DocumentConverter } from "src/services/DocumentConverter";
import { readFile } from "fs/promises";
@Controller("compliance-documents")
export class ComplianceDocumentsController {
  constructor(
    private readonly service: ComplianceDocumentsService,
    private readonly document_service: DocumentHistoryService,
    private readonly document_converter: DocumentConverter,
  ) {}

  ///////////////////////////////////////////////////////
  //  UPLAOD COMPLIANCE DOC
  ///////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  @UploadFile({
    fieldName: "filename",
    destination: join(__dirname, "../../public/uploads"),
    maxCount: 1,
    multiple: false,
  })
  async upload_document(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const data = {
        user_id: body.user_id,
        reminder_id: body.reminder_id,
        document_type: body.document_type,
        filename: file?.originalname || body.filename,
        file_url: body.file_url,
      };
      // const file_buffer: any = file?.path;
      // const rawtext: any = await this.document_converter.convertDocument(
      //   file_buffer,
      //   file?.mimetype || "png",
      // );
      // const result = await this.document_service.create_document_service({
      //   user_id: data.user_id,
      //   file_name: data.filename,
      //   file_type: file?.mimetype || "png",
      //   file_size: file?.size || 0,
      //   raw_text: rawtext,
      //   parsed_data: new Date().toISOString(),
      //   storage_path: "string",
      // });
      const response = await this.service.upload_document_service(data);
      return { message: "document uploaded", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET ALL DOC FOR USER
  ///////////////////////////////////////////////////////
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_user_document(
    @Param("user_id") user_id: string,
    @Query("reminder_id") reminderId?: string,
  ) {
    try {
      const response = await this.service.get_user_document_service(
        user_id,
        reminderId,
      );
      return { message: "all user docs retrived", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE DOC BY ID
  ///////////////////////////////////////////////////////
  @Get("single/:doc_id")
  @HttpCode(HttpStatus.OK)
  async get_single_document(@Param("doc_id") doc_id: string) {
    try {
      const response = await this.service.get_single_document_service(doc_id);
      return { message: "single document retrived", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // UPDATE DOCUMENT BY InD
  ///////////////////////////////////////////////////////
  @Patch("update/:doc_id")
  @HttpCode(HttpStatus.OK)
  async update_document(@Param("doc_id") doc_id: string, @Body() updates: any) {
    try {
      const response = await this.service.update_document_service(
        doc_id,
        updates,
      );
      return { message: "document updated", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // VERIFY DOCUEMNET
  ///////////////////////////////////////////////////////
  @Patch("verify/:doc_id")
  @HttpCode(HttpStatus.OK)
  async verify_document(@Param("doc_id") doc_id: string) {
    try {
      const response = await this.service.verify_document_service(doc_id);
      return { message: "document verified", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // REJECT DOCUMENT
  ///////////////////////////////////////////////////////
  @Patch("reject/:doc_id")
  @HttpCode(HttpStatus.OK)
  async reject_document(@Param("doc_id") doc_id: string) {
    try {
      const response = await this.service.reject_document_service(doc_id);
      return { message: "document rejected", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // ATTACH AI DOCS SUMMARY
  ///////////////////////////////////////////////////////
  @Patch("ai_summary/:doc_id")
  @HttpCode(HttpStatus.OK)
  async attach_ai_summary(@Param("doc_id") doc_id: string) {
    try {
      const response = await this.service.attach_ai_summary_service(doc_id);
      return { message: "ai summary attached", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  ///////////////////////////////////////////////////////
  // DELETE SINGLE DOCS
  ///////////////////////////////////////////////////////
  @Delete("delete/:doc_id")
  @HttpCode(HttpStatus.OK)
  async delete_document(@Param("doc_id") doc_id: string) {
    try {
      const response = await this.service.delete_document_service(doc_id);
      return { message: "document delete success", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
