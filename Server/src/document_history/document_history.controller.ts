import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { DocumentHistoryService } from "./document_history.service";

@Controller("document-history")
export class DocumentHistoryController {
  constructor(private readonly service: DocumentHistoryService) {}

  ///////////////////////////////////////////////////////
  // CREATE NEW DOCUMENT
  ///////////////////////////////////////////////////////
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create_document(@Body() body: any) {
    try {
      const response = await this.service.create_document_service(body);
      return { message: "document created", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET DOCUMENT BY UUID
  ///////////////////////////////////////////////////////
  @Get(":uuid")
  @HttpCode(HttpStatus.OK)
  async get_document_by_uuid(@Param("uuid") uuid: string) {
    try {
      const response = await this.service.get_document_by_uuid_service(uuid);
      return { message: "document retrieved", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET ALL DOC FOR USER
  ///////////////////////////////////////////////////////
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_documents_by_user(@Param("user_id") user_id: string) {
    try {
      const response =
        await this.service.get_documents_by_user_service(user_id);
      return { message: "all user docs retrieved", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // SEARCH DOCUMENTS
  ///////////////////////////////////////////////////////
  @Get("user/:user_id/search")
  @HttpCode(HttpStatus.OK)
  async search_documents(
    @Param("user_id") user_id: string,
    @Query("keyword") keyword: string,
  ) {
    try {
      const response = await this.service.search_documents_service(
        user_id,
        keyword,
      );
      return { message: "search results", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // UPDATE DOCUMENT STATUS
  ///////////////////////////////////////////////////////
  @Put(":uuid/status")
  @HttpCode(HttpStatus.OK)
  async update_status(
    @Param("uuid") uuid: string,
    @Body("status") status: "pending" | "processed" | "failed",
  ) {
    try {
      await this.service.update_status_service(uuid, status);
      return { message: "document status updated" };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // UPDATE DOCUMENT PARSED DATA
  ///////////////////////////////////////////////////////
  @Put(":uuid/parsed-data")
  @HttpCode(HttpStatus.OK)
  async update_parsed_data(
    @Param("uuid") uuid: string,
    @Body("parsed_data") parsedData: any,
  ) {
    try {
      await this.service.update_parsed_data_service(uuid, parsedData);
      return { message: "document parsed data updated" };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // DELETE DOCUMENT
  ///////////////////////////////////////////////////////
  @Delete(":uuid")
  @HttpCode(HttpStatus.OK)
  async delete_document(@Param("uuid") uuid: string) {
    try {
      await this.service.delete_document_service(uuid);
      return { message: "document deleted" };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET ALL PENDING DOCUMENTS
  ///////////////////////////////////////////////////////
  @Get("pending/all")
  @HttpCode(HttpStatus.OK)
  async get_pending_documents() {
    try {
      const response = await this.service.get_pending_documents_service();
      return { message: "pending documents retrieved", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET DOCUMENTS EXPIRING WITHIN N DAYS
  ///////////////////////////////////////////////////////
  @Get("expiring-within/:days")
  @HttpCode(HttpStatus.OK)
  async get_documents_expiring_within(@Param("days") days: number) {
    try {
      const response =
        await this.service.get_documents_expiring_within_service(days);
      return { message: `documents expiring within ${days} days`, response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
