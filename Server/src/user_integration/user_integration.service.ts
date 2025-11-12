import { Injectable, NotFoundException } from "@nestjs/common";
import { UserIntegration } from "./user_integration.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserIntegrationService {
  constructor(
    @InjectRepository(UserIntegration)
    private readonly userIntegration: Repository<UserIntegration>
  ) {}

  /////////////////////////////////////////////////////////////////////////
  // CREATE USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  async create_userIntegration_service(data: any) {
    const response = this.userIntegration.create(data);
    const result = await this.userIntegration.save(response);
    return result;
  }

  /////////////////////////////////////////////////////////////////////////
  // ALL USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  async all_userIntegration_service() {
    const response = await this.userIntegration.find();
    return response;
  }

  /////////////////////////////////////////////////////////////////////////
  // SINGLE USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  async single_userIntegration_service(uuid: string) {
    const response = await this.userIntegration.findOne({
      where: { uuid },
    });
    if (!response)
      throw new NotFoundException(`Integration with UUID ${uuid} not found`);
    return response;
  }

  /////////////////////////////////////////////////////////////////////////
  // FIND USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  async user_userIntegration_service(user_id: string) {
    const response = await this.userIntegration.find({ where: { user_id } });
    return response;
  }

  /////////////////////////////////////////////////////////////////////////
  // UPDATE USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  async update_userIntegration_service(uuid: string, data: any) {
    await this.userIntegration.update(uuid, data);
    return this.userIntegration.findOneBy({ uuid: uuid });
  }

  /////////////////////////////////////////////////////////////////////////
  // DELETE USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  async delete_userIntegration_service(uuid: string) {
    const response = await this.userIntegration.delete(uuid);
    return response;
  }

  /////////////////////////////////////////////////////////////////////////
  // SYNC FOR EXTERNAL API SYNC STATUS
  /////////////////////////////////////////////////////////////////////////
  async update_lastsync_userIntegration_service(uuid: string) {
    const record = await this.userIntegration.findOne({ where: { uuid } });
    if (!record) {
      throw new Error("Integration not found");
    }
    record.last_sync_at = new Date();
    await this.userIntegration.save(record);
    return record;
  }

  /////////////////////////////////////////////////////////////////////////
  // CHANGE USER INTEGRATION STATUS
  /////////////////////////////////////////////////////////////////////////
  async change_status_userIntegration_service(
    uuid: string,
    status: "connected" | "disconnected"
  ) {
    const record = await this.userIntegration.findOne({ where: { uuid } });
    if (!record) {
      throw new Error("Integration not found");
    }
    record.status = status;
    await this.userIntegration.save(record);
    return record;
  }
}
