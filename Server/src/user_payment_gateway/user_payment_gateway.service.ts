import { Injectable, NotFoundException } from "@nestjs/common";
import { UserPaymentGatewayEntity } from "./user_payment_gateway.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserPaymentGatewayService {
  constructor(
    @InjectRepository(UserPaymentGatewayEntity)
    private readonly gatewayRepo: Repository<UserPaymentGatewayEntity>
  ) {}

  ///////////////////////////////////////////////////
  // CONNECT GATEWAY
  ///////////////////////////////////////////////////
  async connect_gateway_service(data: any) {
    let existing = await this.gatewayRepo.findOne({
      where: { user_id: data.user_id, gateway_name: data.gateway_name },
    });

    if (existing) {
      existing.credentials = data.credentials;
      return await this.gatewayRepo.save(existing);
    } else {
      // IF ALREADY EXIST THEN CREATE NEW
      const newGateway = this.gatewayRepo.create({
        user_id: data.user_id,
        gateway_name: data.gateway_name,
        credentials: data.credentials,
        is_active: true,
      });
      return await this.gatewayRepo.save(newGateway);
    }
  }

  ///////////////////////////////////////////////////
  // CONNECT GATEWAY
  ///////////////////////////////////////////////////
  async all_gateway_service() {
    const response = await this.gatewayRepo.find();
    return response;
  }

  //////////////////////////////////////////////////////////////////////
  // GET USER GATEWAY BY USER ID
  //////////////////////////////////////////////////////////////////////
  async user_gateway_service(user_id: string) {
    const response = await this.gatewayRepo.find({ where: { user_id } });
    return response;
  }

  ///////////////////////////////////////////////////////////
  // GET USER ACTIVE  GATEWAY
  ///////////////////////////////////////////////////////////
  async user_active_gateway_service(user_id: string, gateway_name: string) {
    const gateway = await this.gatewayRepo.findOne({
      where: { user_id, gateway_name, is_active: true },
    });
    if (!gateway) throw new NotFoundException("Payment gateway not found");
    return gateway;
  }

  ///////////////////////////////////////////////////
  // DEACTIVE USER GATEWAY
  ///////////////////////////////////////////////////
  async deactivate_gateway_service(user_id: string, gateway_name: string) {
    const gateway = await this.gatewayRepo.findOne({
      where: { user_id, gateway_name },
    });
    if (!gateway) throw new NotFoundException("Gateway not found");
    gateway.is_active = false;
    return await this.gatewayRepo.save(gateway);
  }

  ///////////////////////////////////////////////////
  // SINGLE GATEWAY BY UUID
  ///////////////////////////////////////////////////
  async single_gateway_service(id: string) {
    const response = await this.gatewayRepo.find({ where: { uuid: id } });
    return response;
  }

  ///////////////////////////////////////////////////
  // DELETE USER GATEWAY
  ///////////////////////////////////////////////////
  async delete_user_gateway_service(user_id: string) {
    const response = await this.gatewayRepo.delete({ user_id: user_id });
    return response;
  }
}
