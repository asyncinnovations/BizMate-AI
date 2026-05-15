import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { SubscriptionUsage } from "./subscription_usage.entity";
import { SubscriptionUsageService } from "./subscription_usage.service";

@Controller("subscription-usage")
export class SubscriptionUsageController {
  constructor(private readonly usageService: SubscriptionUsageService) {}

  // ===============================
  // INCREMENT USAGE
  // ===============================
  @Post("increment")
  async incrementUsage(
    @Body()
    body: {
      subscriptionId: string;
      usageKey: string;
      amount?: number;
      periodType?: "daily" | "monthly" | "lifetime";
      limitSnapshot?: number;
      policyType?: "strict" | "fair_use" | "unlimited";
    },
  ): Promise<SubscriptionUsage> {
    const { subscriptionId, usageKey, amount = 1, ...options } = body;
    return this.usageService.increment_usage_service(
      subscriptionId,
      usageKey,
      amount,
      options,
    );
  }

  // ===============================
  // FEATURE USAGE
  // ===============================
  @Get("feature_usage/:subscriptionId/:usageKey")
  async getUsage(
    @Param("subscriptionId") subscriptionId: string,
    @Param("usageKey") usageKey: string,
    @Query("periodType") periodType?: "daily" | "monthly" | "lifetime",
  ): Promise<SubscriptionUsage | null> {
    // service method name fixed to match the updated service
    return this.usageService.get_subscription_usage_service(
      subscriptionId,
      usageKey,
      periodType || "monthly",
    );
  }

  // ===============================
  // CHECK USAGE LIMIT
  // ===============================
  @Get("check_usage_limit/:subscriptionId/:usageKey")
  async checkLimit(
    @Param("subscriptionId") subscriptionId: string,
    @Param("usageKey") usageKey: string,
    @Query("periodType") periodType?: "daily" | "monthly" | "lifetime",
  ): Promise<{ used: number; policy: string }> {
    return this.usageService.check_usage_limit_service(
      subscriptionId,
      usageKey,
      periodType || "monthly",
    );
  }

  // ===============================
  // RESET USAGE
  // ===============================
  @Post("reset_usage")
  async resetUsage(
    @Body()
    body: {
      subscriptionId: string;
      usageKey?: string;
      periodType?: "daily" | "monthly" | "lifetime";
    },
  ): Promise<{ success: boolean }> {
    const { subscriptionId, usageKey, periodType = "monthly" } = body;
    await this.usageService.reset_usage_service(
      subscriptionId,
      usageKey,
      periodType,
    );
    return { success: true };
  }

  // ===============================
  // ENFORCE LIMIT
  // ===============================
  @Post("enforce_limit")
  async enforceLimit(
    @Body()
    body: {
      subscriptionId: string;
      usageKey: string;
      limit: number;
      amount?: number;
      periodType?: "daily" | "monthly" | "lifetime";
      policyType?: "strict" | "fair_use" | "unlimited";
    },
  ): Promise<{ success: boolean }> {
    const {
      subscriptionId,
      usageKey,
      limit,
      amount = 1,
      periodType = "monthly",
      policyType = "strict",
    } = body;

    try {
      await this.usageService.enforce_limit_service(
        subscriptionId,
        usageKey,
        limit,
        amount,
        { periodType, policyType },
      );
      return { success: true };
    } catch (err: any) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new BadRequestException(err.message);
    }
  }

  // ===============================
  // GET ALL USAGE (Legacy support)
  // ===============================
  @Get("all_subscription/:subscriptionId")
  async getAllUsage(@Param("subscriptionId") subscriptionId: string) {
    return this.usageService.all_usage_for_subscription_service(subscriptionId);
  }
}
