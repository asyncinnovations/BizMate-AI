import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { UserPaymentGatewayService } from "./user_payment_gateway.service";
import { JwtGuard } from "src/guards/auth/auth.guard";
import { PaymentService } from "src/common/PaymentService";

@Controller("user_payment_gateway")
@UseGuards(JwtGuard)
export class UserPaymentGatewayController {
  constructor(
    private readonly gatewayService: UserPaymentGatewayService,
    private readonly paymentService: PaymentService
  ) {}

  ///////////////////////////////////////////////////
  // VALIDATE CONNECT DATA
  ///////////////////////////////////////////////////
  public validate(data: any): { valid: boolean; errors?: any } {
    const errors: any = {};

    if (!data.user_id) {
      errors.user_id = "User ID is required";
    }

    if (!data.gateway_name) {
      errors.gateway_name = "Gateway name is required";
    }

    if (!data.credentials || typeof data.credentials !== "object") {
      errors.credentials = "Credentials are required and must be an object";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  ///////////////////////////////////////////////////
  // CONNECT OR UPDATE GATEWAY
  ///////////////////////////////////////////////////
  @Post("connect")
  @HttpCode(HttpStatus.CREATED)
  async connect_gateway(@Body() body: any) {
    const { valid, errors } = this.validate(body);
    if (!valid) {
      throw new BadRequestException(errors);
    }
    const data = {
      user_id: body.user_id,
      gateway_name: body.gateway_name || "stripe",
      credentials: body.credentials,
    };
    //  {
    //         publishable_key: "pk_live_abc123xyz",
    //         secret_key: "sk_live_def456uvw",
    //         webhook_secret: "whsec_789ghi",
    //       }
    const response = await this.gatewayService.connect_gateway_service(data);
    return { message: "gateway connected successfully", response };
  }

  ///////////////////////////////////////////////////
  // ALL GATEWAYS
  ///////////////////////////////////////////////////
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_gateway() {
    const response = await this.gatewayService.all_gateway_service();
    return { message: "all gateway retrived", response };
  }

  ///////////////////////////////////////////////////
  // SINGLE GATEWAYS BY UUID
  ///////////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async single_gateway(@Param("id") id: string) {
    const response = await this.gatewayService.single_gateway_service(id);
    return { message: "single gateway retrived", response };
  }

  ///////////////////////////////////////////////////
  // ALL GATEWAYS FOR A USER
  ///////////////////////////////////////////////////
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_gateways(@Param("user_id") user_id: string) {
    const response = await this.gatewayService.user_gateway_service(user_id);
    return { message: "user gateway retrived", response };
  }

  ///////////////////////////////////////////////////
  // ACTIVE GATEWAY FOR SPECIFIC USER & TYPE
  ///////////////////////////////////////////////////
  @Get("active/:user_id/:name")
  @HttpCode(HttpStatus.OK)
  async user_active_gateway(
    @Param("user_id") user_id: string,
    @Param("name") gateway_name: string
  ) {
    const response = await this.gatewayService.user_active_gateway_service(
      user_id,
      gateway_name
    );
    return { message: "active gateway retrived", response };
  }

  ///////////////////////////////////////////////////
  // DEACTIVATE A USER’S GATEWAY
  ///////////////////////////////////////////////////
  @Patch("deactivate")
  @HttpCode(HttpStatus.OK)
  async deactivate_gateway(
    @Body("user_id") user_id: string,
    @Body("gateway_name") gateway_name: string
  ) {
    const response = await this.gatewayService.deactivate_gateway_service(
      user_id,
      gateway_name
    );
    return { message: "gateway deactived", response };
  }

  ///////////////////////////////////////////////////
  // DELETE ALL USER GATEWAYS
  ///////////////////////////////////////////////////
  @Delete("delete/:user_id")
  @HttpCode(HttpStatus.OK)
  async delete_user_gateway(@Param("user_id") user_id: string) {
    const response =
      await this.gatewayService.delete_user_gateway_service(user_id);
    return { message: "user gateway deleted", response };
  }

  ///////////////////////////////////////////////////
  // GENERATE PAYMENT LINK
  ///////////////////////////////////////////////////
  @Post("payment_link")
  @HttpCode(HttpStatus.OK)
  async payment_link(
    @Body() body: { user_id: string; amount: number; gateway_name: string }
  ): Promise<any> {
    const { user_id, amount, gateway_name } = body;

    if (!user_id || !amount || !gateway_name) {
      throw new Error("Missing required fields: user_id, amount, gateway_name");
    }

    const userGateway = await this.gatewayService.user_active_gateway_service(
      user_id,
      gateway_name
    );

    if (!userGateway) {
      throw new Error("No active payment gateway found for this user.");
    }

    let response: any;
    switch (gateway_name.toLowerCase()) {
      case "stripe":
        response = await this.paymentService.generateStripeLink(
          userGateway.credentials,
          amount
        );
        break;

      case "paypal":
        response = await this.paymentService.generatePayPalLink(
          userGateway.credentials,
          amount
        );
        break;

      case "telr":
        response = await this.paymentService.generateTelrLink(
          userGateway.credentials,
          amount
        );
        break;

      default:
        throw new Error("Unsupported payment gateway.");
    }

    return {
      message: "Payment link generated successfully",
      gateway: gateway_name,
      data: response,
    };
  }
}
