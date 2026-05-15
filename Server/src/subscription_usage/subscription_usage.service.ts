import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubscriptionUsage } from "./subscription_usage.entity";

@Injectable()
export class SubscriptionUsageService {
  constructor(
    @InjectRepository(SubscriptionUsage)
    private readonly subscriptionUsageRepo: Repository<SubscriptionUsage>,
  ) {}

  /**
   * Helper to determine date ranges based on period type
   */
  private getPeriodDates(type: "daily" | "monthly" | "lifetime") {
    const now = new Date();
    if (type === "daily") {
      const start = new Date(now.setHours(0, 0, 0, 0));
      const end = new Date(now.setHours(23, 59, 59, 999));
      return { start, end };
    }
    if (type === "monthly") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
      );
      return { start, end };
    }
    // Lifetime
    return { start: new Date(0), end: new Date(2099, 11, 31) };
  }

  //=================================
  // INCREMENT USAGE SERVICE
  //=================================
  async increment_usage_service(
    subscriptionId: string,
    usageKey: string,
    amount = 1,
    options?: {
      periodType?: "daily" | "monthly" | "lifetime";
      limitSnapshot?: number;
      policyType?: "strict" | "fair_use" | "unlimited";
    },
  ): Promise<SubscriptionUsage> {
    const pType = options?.periodType || "monthly";
    const { start, end } = this.getPeriodDates(pType);

    const existing = await this.subscriptionUsageRepo.findOne({
      where: {
        subscriptionId,
        usageKey,
        periodStart: start,
      },
    });

    if (existing) {
      existing.used += amount;
      existing.lastUsedAt = new Date();
      // Update snapshot if the plan changed recently
      if (options?.limitSnapshot)
        existing.limitSnapshot = options.limitSnapshot;
      return this.subscriptionUsageRepo.save(existing);
    } else {
      const usage = this.subscriptionUsageRepo.create({
        subscriptionId,
        usageKey,
        used: amount,
        periodType: pType,
        periodStart: start,
        periodEnd: end,
        limitSnapshot: options?.limitSnapshot,
        policyType: options?.policyType || "strict",
        lastUsedAt: new Date(),
      });
      return this.subscriptionUsageRepo.save(usage);
    }
  }

  //==========================
  // GET SUBSCRIPTION USAGE
  //==========================
  async get_subscription_usage_service(
    subscriptionId: string,
    usageKey: string,
    periodType: "daily" | "monthly" | "lifetime" = "monthly",
  ): Promise<SubscriptionUsage | null> {
    const { start } = this.getPeriodDates(periodType);

    return this.subscriptionUsageRepo.findOne({
      where: {
        subscriptionId,
        usageKey,
        periodStart: start,
      },
    });
  }

  //===================================
  // CHECK LIMIT EXCEEDED
  //===================================
  async check_usage_limit_service(
    subscriptionId: string,
    usageKey: string,
    periodType: "daily" | "monthly" | "lifetime" = "monthly",
  ): Promise<{ used: number; policy: string }> {
    const usage = await this.get_subscription_usage_service(
      subscriptionId,
      usageKey,
      periodType,
    );
    return {
      used: usage?.used || 0,
      policy: usage?.policyType || "strict",
    };
  }

  //====================================
  // ENFORCE LIMIT (Updated with Policy Logic)
  //====================================
  async enforce_limit_service(
    subscriptionId: string,
    usageKey: string,
    limit: number, // -1 for unlimited
    amount = 1,
    options?: {
      periodType?: "daily" | "monthly" | "lifetime";
      policyType?: "strict" | "fair_use" | "unlimited";
    },
  ): Promise<void> {
    const pType = options?.periodType || "monthly";
    const policy = options?.policyType || "strict";

    const usage = await this.get_subscription_usage_service(
      subscriptionId,
      usageKey,
      pType,
    );

    const currentUsed = usage?.used || 0;

    // 1. If limit is -1 or policy is unlimited, always allow
    if (limit === -1 || policy === "unlimited") {
      await this.increment_usage_service(subscriptionId, usageKey, amount, {
        ...options,
        limitSnapshot: limit,
      });
      return;
    }

    // 2. Strict enforcement
    if (policy === "strict" && currentUsed + amount > limit) {
      throw new BadRequestException(
        `Usage limit exceeded for ${usageKey}: ${currentUsed}/${limit}. Please upgrade your plan.`,
      );
    }

    // 3. Fair Use enforcement (Allow with warning or log, but here we just process)
    // You could add logic here to notify admins if fair use is being pushed

    await this.increment_usage_service(subscriptionId, usageKey, amount, {
      ...options,
      limitSnapshot: limit,
    });
  }

  //=================================
  // RESET USAGE (By Period Type)
  //=================================
  async reset_usage_service(
    subscriptionId: string,
    usageKey?: string,
    periodType: "daily" | "monthly" | "lifetime" = "monthly",
  ): Promise<void> {
    const { start, end } = this.getPeriodDates(periodType);

    const query = this.subscriptionUsageRepo
      .createQueryBuilder()
      .update(SubscriptionUsage)
      .set({ used: 0, resetKey: `reset_${new Date().getTime()}` })
      .where("subscriptionId = :subscriptionId", { subscriptionId })
      .andWhere("periodStart = :start", { start })
      .andWhere("periodEnd = :end", { end });

    if (usageKey) {
      query.andWhere("usageKey = :usageKey", { usageKey });
    }

    await query.execute();
  }
  //====================
  // GET ALL USAGE
  //====================
  async all_usage_for_subscription_service(
    subscriptionId: string,
    periodType: "daily" | "monthly" | "lifetime" = "monthly",
  ) {
    const { start } = this.getPeriodDates(periodType);

    return this.subscriptionUsageRepo.find({
      where: {
        subscriptionId,
        periodStart: start,
      },
    });
  }
}
