import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { UserBusinessInfoService } from "./user_business_info.service";
import { JwtGuard } from "src/guards/auth/auth.guard";

@Controller("user_business_info")
@UseGuards(JwtGuard)
export class UserBusinessInfoController {
  constructor(private readonly UserBusiness: UserBusinessInfoService) {}

  //////////////////////////////////////////////////////
  // CREATE NEW BUSINESS INFO
  //////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_business_info(@Body() data: any) {
    const response = await this.UserBusiness.create_business_info_serivce(data);
    return { message: "business info create success", response };
  }

  //////////////////////////////////////////////////////
  // GET SINGLE BUSINESS INFO BY ID OR UUID
  //////////////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async single_business_info(@Param("id") id: string) {
    const response = await this.UserBusiness.single_business_info_service(id);
    return { message: "single business info retrived", response };
  }

  //////////////////////////////////////////////////////
  // GET ALL BUSINESS INFO FOR A USER
  //////////////////////////////////////////////////////
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_business_info(@Param("user_id") user_id: string) {
    const response =
      await this.UserBusiness.user_business_info_service(user_id);
    return { message: "user business info retrived", response };
  }

  //////////////////////////////////////////////////////
  // UPDATE BUSINESS INFO
  //////////////////////////////////////////////////////
  @Patch("update/:id")
  @HttpCode(HttpStatus.OK)
  async update_business_info(@Param("id") id: string, @Body() data: any) {
    const response = await this.UserBusiness.update_business_info_service(
      id,
      data
    );
    return { message: "business info updated", response };
  }

  //////////////////////////////////////////////////////
  // DELETE BUSINESS INFO (soft delete by default)
  //////////////////////////////////////////////////////
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_business_info(@Param("id") id: string) {
    const response = await this.UserBusiness.delete_business_info_service(id);
    return { message: "business info delete success", response };
  }

  //////////////////////////////////////////////////////
  // SEARCH BUSINESS INFO BY BUSINESS NAME OR INDUSTRY
  //////////////////////////////////////////////////////
  @Get("search")
  @HttpCode(HttpStatus.OK)
  async search_business_info(
    @Query("user_id") user_id: string,
    @Query("query") query: string
  ) {
    if (!user_id || !query) {
      throw new BadRequestException("user_id and query are required");
    }
    const response = await this.UserBusiness.search_business_info_service(
      user_id,
      query
    );
    return { message: "search result success", response };
  }

  //////////////////////////////////////////////////////
  // BULK INSERT BUSINESS INFO
  //////////////////////////////////////////////////////
  @Post("bulk-insert")
  @HttpCode(HttpStatus.OK)
  async bulk_insert_business_info(@Body() data: any[]) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new BadRequestException("Data must be a non-empty array");
    }
    const response =
      await this.UserBusiness.bulk_insert_business_info_service(data);
    return { message: "bulk insert success", response };
  }
}
