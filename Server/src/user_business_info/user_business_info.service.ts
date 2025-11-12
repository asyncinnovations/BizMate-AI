import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Repository, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserBusinessInfo } from "./user_business_info.entity";

@Injectable()
export class UserBusinessInfoService {
  constructor(
    @InjectRepository(UserBusinessInfo)
    private readonly userBusiness: Repository<UserBusinessInfo>
  ) {}

  //////////////////////////////////////////////////////
  // CREATE NEW BUSINESS INFO
  //////////////////////////////////////////////////////
  async create_business_info_serivce(data: Partial<UserBusinessInfo>) {
    if (
      !data.user_id ||
      !data.business_name ||
      !data.industry ||
      !data.services_offered
    ) {
      throw new BadRequestException(
        "Required fields: user_id, business_name, industry, services_offered"
      );
    }
    const entity = this.userBusiness.create(data);
    const result = await this.userBusiness.save(entity);
    return result;
  }

  //////////////////////////////////////////////////////
  // GET SINGLE BUSINESS INFO BY ID OR UUID
  //////////////////////////////////////////////////////
  async single_business_info_service(idOrUuid: string | number) {
    const info = await this.userBusiness.findOne({
      where: [
        { id: typeof idOrUuid === "number" ? idOrUuid : undefined },
        { uuid: typeof idOrUuid === "string" ? idOrUuid : undefined },
      ],
    });
    if (!info) throw new NotFoundException("Business info not found");
    return info;
  }

  //////////////////////////////////////////////////////
  // GET BUSINESS INFO FOR USER
  //////////////////////////////////////////////////////
  async user_business_info_service(user_id: string) {
    const info = await this.userBusiness.find({
      where: { user_id, is_active: true },
      order: { created_at: "DESC" },
    });
    return info;
  }

  //////////////////////////////////////////////////////
  // UPDATE BUSINESS INFO
  //////////////////////////////////////////////////////
  async update_business_info_service(
    idOrUuid: string | number,
    data: Partial<UserBusinessInfo>
  ) {
    const info = await this.single_business_info_service(idOrUuid);
    Object.assign(info, data);
    const result = await this.userBusiness.save(info);
    return result;
  }

  //////////////////////////////////////////////////////
  // DELETE BUSINESS INFO (soft delete by default)
  //////////////////////////////////////////////////////
  async delete_business_info_service(idOrUuid: string | number, soft = true) {
    const info = await this.single_business_info_service(idOrUuid);
    if (soft) {
      info.is_active = false;
      return await this.userBusiness.save(info);
    } else {
      return await this.userBusiness.delete({
        uuid: typeof idOrUuid === "string" ? idOrUuid : undefined,
        id: typeof idOrUuid === "number" ? idOrUuid : undefined,
      });
    }
  }

  //////////////////////////////////////////////////////
  // SEARCH BUSINESS INFO BY BUSINESS NAME OR Industry
  //////////////////////////////////////////////////////
  async search_business_info_service(user_id: string, query: string) {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException(
        "Search query must be at least 2 characters"
      );
    }
    const result = await this.userBusiness.find({
      where: [
        { user_id, business_name: Like(`%${query}%`) },
        { user_id, industry: Like(`%${query}%`) },
      ],
      order: { created_at: "DESC" },
    });
    return result;
  }

  //////////////////////////////////////////////////////
  // BULK INSERT BUSINESS INFO
  //////////////////////////////////////////////////////
  async bulk_insert_business_info_service(
    entries: Partial<UserBusinessInfo>[]
  ) {
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new BadRequestException("Entries must be a non-empty array");
    }
    const entities = this.userBusiness.create(entries);
    const result = await this.userBusiness.save(entities);
    return result;
  }
}
