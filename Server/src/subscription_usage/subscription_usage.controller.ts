import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
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
    @Body() body: { subscriptionId: string; usageKey: string; amount?: number },
  ): Promise<SubscriptionUsage> {
    const { subscriptionId, usageKey, amount = 1 } = body;
    return this.usageService.increment_usage_service(
      subscriptionId,
      usageKey,
      amount,
    );
  }

  // ===============================
  // FEATURE USAGE
  // ===============================
  @Get(":subscriptionId/:usageKey")
  async getUsage(
    @Param("subscriptionId") subscriptionId: string,
    @Param("usageKey") usageKey: string,
  ): Promise<SubscriptionUsage | null> {
    return this.usageService.get_subscription_usage_serice(
      subscriptionId,
      usageKey,
    );
  }

  // ===============================
  // CHECK USAGE LIMIT
  // ===============================
  @Get(":subscriptionId/:usageKey/check")
  async checkLimit(
    @Param("subscriptionId") subscriptionId: string,
    @Param("usageKey") usageKey: string,
    @Query("limit", ParseIntPipe) limit: number,
  ): Promise<{ exceeded: boolean }> {
    const exceeded = await this.usageService.check_usage_limit_service(
      subscriptionId,
      usageKey,
      limit,
    );
    return { exceeded };
  }

  // ===============================
  // Reset Usage
  // ===============================
  @Post("reset")
  async resetUsage(
    @Body() body: { subscriptionId: string; usageKey?: string },
  ): Promise<{ success: boolean }> {
    const { subscriptionId, usageKey } = body;
    await this.usageService.reset_usage_service(subscriptionId, usageKey);
    return { success: true };
  }

  // ===============================
  // Get All Usage for Subscription
  // ===============================
  @Get(":subscriptionId/all")
  async getAllUsage(
    @Param("subscriptionId") subscriptionId: string,
  ): Promise<SubscriptionUsage[]> {
    return this.usageService.all_usage_for_subscription_service(subscriptionId);
  }

  // ===============================
  // Enforce Limit
  // ===============================
  @Post("enforce")
  async enforceLimit(
    @Body()
    body: {
      subscriptionId: string;
      usageKey: string;
      limit: number;
      amount?: number;
    },
  ): Promise<{ success: boolean }> {
    const { subscriptionId, usageKey, limit, amount = 1 } = body;

    try {
      await this.usageService.enforce_limit_service(
        subscriptionId,
        usageKey,
        limit,
        amount,
      );
      return { success: true };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new BadRequestException(err.message);
    }
  }
}
