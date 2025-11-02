import { Module } from "@nestjs/common";
import { UserPaymentGatewayService } from "./user_payment_gateway.service";
import { UserPaymentGatewayController } from "./user_payment_gateway.controller";
import { UserPaymentGatewayEntity } from "./user_payment_gateway.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentService } from "src/common/PaymentService";

@Module({
  imports: [TypeOrmModule.forFeature([UserPaymentGatewayEntity])],
  providers: [UserPaymentGatewayService, PaymentService],
  controllers: [UserPaymentGatewayController],
  exports: [UserPaymentGatewayService],
})
export class UserPaymentGatewayModule {}
