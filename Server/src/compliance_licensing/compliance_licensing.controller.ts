import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ComplianceLicensingService } from "./compliance_licensing.service";
import { ComplianceLicense } from "./compliance_licensing.entity";

@Controller("compliance-licensing")
export class ComplianceLicensingController {
  constructor(private readonly licensingService: ComplianceLicensingService) {}

  ///////////////////////////////////////////////////////
  // CREATE LICHENCES
  ///////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_license(@Body() body: any) {
    const {
      user_id,
      company_id,
      license_type,
      license_number,
      issue_date,
      expiry_date,
      document_id,
    } = body;
    return await this.licensingService.create_license_service(
      user_id,
      company_id,
      license_type,
      license_number,
      issue_date,
      expiry_date,
      document_id
    );
  }

  ///////////////////////////////////////////////////////
  // GET ALL LICENCES
  ///////////////////////////////////////////////////////
  @Get("user/:user_id")
  async get_user_licences(
    @Param("user_id") user_id: string,
    @Query("company_id") company_id?: string
  ) {
    return await this.licensingService.get_user_licences_service(
      user_id,
      company_id
    );
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE LICENCES
  ///////////////////////////////////////////////////////
  @Get("single/:license_id")
  async get_single_licences(@Param("license_id") license_id: string) {
    return await this.licensingService.single_licences_service(license_id);
  }

  ///////////////////////////////////////////////////////
  // UPDATE LICENCSE
  ///////////////////////////////////////////////////////
  @Put("update/:license_id")
  async update_licences(
    @Param("license_id") license_id: string,
    @Body() updates: Partial<ComplianceLicense>
  ) {
    return await this.licensingService.update_licences_service(
      license_id,
      updates
    );
  }

  ///////////////////////////////////////////////////////
  // DELETE LICENCES
  ///////////////////////////////////////////////////////
  @Delete("delete/:license_id")
  async delete_licences(@Param("license_id") license_id: string) {
    return await this.licensingService.delete_licences_service(license_id);
  }

  ///////////////////////////////////////////////////////
  // VERIFY LICENCES
  ///////////////////////////////////////////////////////
  @Put("verify/:license_id")
  async verify_licences(@Param("license_id") license_id: string) {
    return await this.licensingService.verify_licences_service(license_id);
  }

  ///////////////////////////////////////////////////////
  // GET EXPIRED LICENCES
  ///////////////////////////////////////////////////////
  @Put("expire/:license_id")
  async mark_expire_licences(@Param("license_id") license_id: string) {
    return await this.licensingService.mark_expire_licences_service(license_id);
  }

  ///////////////////////////////////////////////////////
  // SUSPEND LICENCES
  ///////////////////////////////////////////////////////
  @Put(":license_id/suspend")
  async suspend_licences(@Param("license_id") license_id: string) {
    return await this.licensingService.suspend_licences_service(license_id);
  }

  ///////////////////////////////////////////////////////
  // ATTACH DOCUMENT
  ///////////////////////////////////////////////////////
  @Put(":license_id/attach-document/:document_id")
  async attach_licences_document(
    @Param("license_id") license_id: string,
    @Param("document_id") document_id: string
  ) {
    return await this.licensingService.attach_licences_document_service(
      license_id,
      document_id
    );
  }

  ///////////////////////////////////////////////////////
  // GET NEARING LICENCES
  ///////////////////////////////////////////////////////
  @Get("user/:user_id/expiring")
  async get_expired_licences(
    @Param("user_id") user_id: string,
    @Query("daysBefore") daysBefore?: number
  ) {
    return await this.licensingService.get_expired_licences_service(
      user_id,
      daysBefore
    );
  }
}
