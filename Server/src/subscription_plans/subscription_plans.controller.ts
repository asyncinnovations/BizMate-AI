import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { SubscriptionPlanService } from "./subscription_plans.service";

@Controller("subscription_plan") 
export class SubscriptionPlanController {
  constructor(private readonly subscriptionService: SubscriptionPlanService) {}

  ///////////////////////////////////////////
  // List All Active Subscription Plans
  ///////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_subscription_plan(@Body() body: any) {
    try {
      const response =
        await this.subscriptionService.create_subscription_plan_service(body);
      return { message: "subscription plan created", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  ///////////////////////////////////////////
  // List All Active Subscription Plans
  ///////////////////////////////////////////
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_subscription_plan() {
    try {
      const plans =
        await this.subscriptionService.all_subscription_plan_service();
      return { success: true, plans };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Subscribe a User to a Plan
  ///////////////////////////////////////////
  @Post("subscribe/:userId")
  @HttpCode(HttpStatus.OK)
  async subscribe_subscription_plan(
    @Param("userId") userId: string,
    @Body("planId") planId: string
  ) {
    try {
      const subscription =
        await this.subscriptionService.subscribe_subscription_plan_service(
          userId,
          planId
        );
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Get Current Subscription of a User
  ///////////////////////////////////////////
  @Get("user_current/:userId")
  @HttpCode(HttpStatus.OK)
  async user_subscription_plan(@Param("userId") userId: string) {
    try {
      const subscription =
        await this.subscriptionService.user_subscription_plan_service(userId);
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Cancel Subscription
  ///////////////////////////////////////////
  @Post("cancel_user/:userId")
  @HttpCode(HttpStatus.OK)
  async cancel_subscription_plan(@Param("userId") userId: string) {
    try {
      const subscription =
        await this.subscriptionService.cancel_subscription_plan_service(userId);
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Upgrade Subscription
  ///////////////////////////////////////////
  @Post("upgrade/:userId")
  @HttpCode(HttpStatus.OK)
  async upgrade_subscription_plan(
    @Param("userId") userId: string,
    @Body("planId") newPlanId: string
  ) {
    try {
      const subscription =
        await this.subscriptionService.upgrade_subscription_plan_service(
          userId,
          newPlanId
        );
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Downgrade Subscription
  ///////////////////////////////////////////
  @Post("downgrade/:userId")
  @HttpCode(HttpStatus.OK)
  async downgrade_subscription_plan(
    @Param("userId") userId: string,
    @Body("planId") newPlanId: string
  ) {
    try {
      const subscription =
        await this.subscriptionService.downgrade_subscription_plan_service(
          userId,
          newPlanId
        );
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
