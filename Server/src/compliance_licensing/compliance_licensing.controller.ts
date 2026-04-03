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
  HttpException,
} from "@nestjs/common";
import { ComplianceLicensingService } from "./compliance_licensing.service";
import { ComplianceLicense } from "./compliance_licensing.entity";

@Controller("compliance-licensing")
export class ComplianceLicensingController {
  constructor(private readonly licensingService: ComplianceLicensingService) {}

  ///////////////////////////////////////////////////////
  // CREATE LICENSES
  ///////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_license(@Body() body: any) {
    try {
      const {
        user_id,
        company_id,
        license_type,
        license_number,
        issue_date,
        expiry_date,
        document_id,
      } = body;
      const response = await this.licensingService.create_license_service(
        user_id,
        company_id,
        license_type,
        license_number,
        issue_date,
        expiry_date,
        document_id,
      );
      return { message: "license created successfully", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET ALL LICENSES
  ///////////////////////////////////////////////////////
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_user_licences(
    @Param("user_id") user_id: string,
    @Query("company_id") company_id?: string,
  ) {
    try {
      const response = await this.licensingService.get_user_licences_service(
        user_id,
        company_id,
      );
      return { message: "user licenses retrieved", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE LICENSES
  ///////////////////////////////////////////////////////
  @Get("single/:license_id")
  @HttpCode(HttpStatus.OK)
  async get_single_licences(@Param("license_id") license_id: string) {
    try {
      const response =
        await this.licensingService.single_licences_service(license_id);
      return { message: "single license retrieved", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // UPDATE LICENSE
  ///////////////////////////////////////////////////////
  @Put("update/:license_id")
  @HttpCode(HttpStatus.OK)
  async update_licences(
    @Param("license_id") license_id: string,
    @Body() updates: Partial<ComplianceLicense>,
  ) {
    try {
      const response = await this.licensingService.update_licences_service(
        license_id,
        updates,
      );
      return { message: "license updated successfully", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // DELETE LICENSES
  ///////////////////////////////////////////////////////
  @Delete("delete/:license_id")
  @HttpCode(HttpStatus.OK)
  async delete_licences(@Param("license_id") license_id: string) {
    try {
      const response =
        await this.licensingService.delete_licences_service(license_id);
      return { message: "license deleted successfully", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // VERIFY LICENSES
  ///////////////////////////////////////////////////////
  @Put("verify/:license_id")
  @HttpCode(HttpStatus.OK)
  async verify_licences(@Param("license_id") license_id: string) {
    try {
      const response =
        await this.licensingService.verify_licences_service(license_id);
      return { message: "license verified successfully", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // MARK EXPIRED LICENSES
  ///////////////////////////////////////////////////////
  @Put("expire/:license_id")
  @HttpCode(HttpStatus.OK)
  async mark_expire_licences(@Param("license_id") license_id: string) {
    try {
      const response =
        await this.licensingService.mark_expire_licences_service(license_id);
      return { message: "license marked as expired", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // SUSPEND LICENSES
  ///////////////////////////////////////////////////////
  @Put(":license_id/suspend")
  @HttpCode(HttpStatus.OK)
  async suspend_licences(@Param("license_id") license_id: string) {
    try {
      const response =
        await this.licensingService.suspend_licences_service(license_id);
      return { message: "license suspended", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // ATTACH DOCUMENT
  ///////////////////////////////////////////////////////
  @Put(":license_id/attach-document/:document_id")
  @HttpCode(HttpStatus.OK)
  async attach_licences_document(
    @Param("license_id") license_id: string,
    @Param("document_id") document_id: string,
  ) {
    try {
      const response =
        await this.licensingService.attach_licences_document_service(
          license_id,
          document_id,
        );
      return { message: "document attached to license", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET NEARING EXPIRY LICENSES
  ///////////////////////////////////////////////////////
  @Get("user/:user_id/expiring")
  @HttpCode(HttpStatus.OK)
  async get_expired_licences(
    @Param("user_id") user_id: string,
    @Query("daysBefore") daysBefore?: number,
  ) {
    try {
      const response = await this.licensingService.get_expired_licences_service(
        user_id,
        daysBefore,
      );
      return { message: "expiring licenses retrieved", response };
    } catch (error: any) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }
}
