import { Injectable, HttpException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ComplianceLicense,
  LicenseStatus,
} from "./compliance_licensing.entity";

@Injectable()
export class ComplianceLicensingService {
  constructor(
    @InjectRepository(ComplianceLicense)
    private readonly licenseRepository: Repository<ComplianceLicense>
  ) {}

  ///////////////////////////////////////////////////////
  // CREATE LICENCES
  ///////////////////////////////////////////////////////
  async create_license_service(
    user_id: string,
    company_id: string,
    license_type: string,
    license_number?: string,
    issue_date?: string,
    expiry_date?: string,
    document_id?: string
  ) {
    const license = this.licenseRepository.create({
      user_id,
      company_id,
      license_type,
      license_number,
      issue_date,
      expiry_date,
      document_id,
      status: LicenseStatus.ACTIVE,
    });

    const saved = await this.licenseRepository.save(license);

    return saved;
  }

  ///////////////////////////////////////////////////////
  // GET ALL LICENCES
  ///////////////////////////////////////////////////////
  async get_user_licences_service(user_id: string, company_id?: string) {
    return this.licenseRepository.find({
      where: { user_id, company_id },
      order: { expiry_date: "ASC" },
    });
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE LICENCES
  ///////////////////////////////////////////////////////
  async single_licences_service(license_id: string) {
    const license = await this.licenseRepository.findOne({
      where: { uuid: license_id },
    });
    if (!license) throw new HttpException("License not found", 404);
    return license;
  }

  ///////////////////////////////////////////////////////
  // UPDATE LICENCES
  ///////////////////////////////////////////////////////
  async update_licences_service(
    license_id: string,
    updates: Partial<ComplianceLicense>
  ) {
    const license = await this.single_licences_service(license_id);
    Object.assign(license, updates);
    const updated = await this.licenseRepository.save(license);

    return updated;
  }

  ///////////////////////////////////////////////////////
  // DELETE LICENCES
  ///////////////////////////////////////////////////////
  async delete_licences_service(license_id: string) {
    const license = await this.single_licences_service(license_id);
    await this.licenseRepository.remove(license);

    return { message: "License deleted successfully" };
  }

  ///////////////////////////////////////////////////////
  // VERIFY LICENCES
  ///////////////////////////////////////////////////////
  async verify_licences_service(license_id: string) {
    return this.update_licences_service(license_id, {
      status: LicenseStatus.ACTIVE,
    });
  }

  ///////////////////////////////////////////////////////
  // MARK LICENCES EXPIRED
  ///////////////////////////////////////////////////////
  async mark_expire_licences_service(license_id: string) {
    return this.update_licences_service(license_id, {
      status: LicenseStatus.EXPIRED,
    });
  }

  ///////////////////////////////////////////////////////
  // SUSPEND LICENCES
  ///////////////////////////////////////////////////////
  async suspend_licences_service(license_id: string) {
    return this.update_licences_service(license_id, {
      status: LicenseStatus.SUSPENDED,
    });
  }

  ///////////////////////////////////////////////////////
  // ATTACH LICENCE DOCUMENT
  ///////////////////////////////////////////////////////
  async attach_licences_document_service(
    license_id: string,
    document_id: string
  ) {
    return this.update_licences_service(license_id, { document_id });
  }

  ///////////////////////////////////////////////////////
  // CHECK LICENCE NEAR EXPIRED
  ///////////////////////////////////////////////////////
  async get_expired_licences_service(user_id: string, daysBefore: number = 30) {
    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + daysBefore);

    return this.licenseRepository
      .createQueryBuilder("license")
      .where("license.user_id = :user_id", { user_id })
      .andWhere("license.expiry_date BETWEEN :now AND :targetDate", {
        now,
        targetDate,
      })
      .orderBy("license.expiry_date", "ASC")
      .getMany();
  }
}
