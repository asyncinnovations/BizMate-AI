import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { SubscriptionUsage } from "./subscription_usage.entity";

@Injectable()
export class SubscriptionUsageService {
  constructor(
    @InjectRepository(SubscriptionUsage)
    private readonly subscriptionUsageRepo: Repository<SubscriptionUsage>,
  ) {}
  //=================================
  // INCREMENT USAGE SERVICE
  //=================================
  async increment_usage_service(
    subscriptionId: string,
    usageKey: string,
    amount = 1,
    periodStart?: Date,
    periodEnd?: Date,
  ): Promise<SubscriptionUsage> {
    const now = new Date();
    const start = periodStart || new Date(now.getFullYear(), now.getMonth(), 1);
    const end =
      periodEnd ||
      new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // insert or increment
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
      return this.subscriptionUsageRepo.save(existing);
    } else {
      const usage = this.subscriptionUsageRepo.create({
        subscriptionId,
        usageKey,
        used: amount,
        periodStart: start,
        periodEnd: end,
        lastUsedAt: new Date(),
      });
      return this.subscriptionUsageRepo.save(usage);
    }
  }

  //==========================
  // GET SUBSCRIPTION USAGE
  //==========================
  async get_subscription_usage_serice(
    subscriptionId: string,
    usageKey: string,
    periodStart?: Date,
    periodEnd?: Date,
  ): Promise<SubscriptionUsage | null> {
    const now = new Date();
    const start = periodStart || new Date(now.getFullYear(), now.getMonth(), 1);
    const end =
      periodEnd ||
      new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return this.subscriptionUsageRepo.findOne({
      where: {
        subscriptionId,
        usageKey,
        periodStart: start,
        periodEnd: end,
      },
    });
  }

  //===================================
  // CHECK LIMITE EXECED OR NOT
  //===================================
  async check_usage_limit_service(
    subscriptionId: string,
    usageKey: string,
  ): Promise<any> {
    const usage = await this.get_subscription_usage_serice(
      subscriptionId,
      usageKey,
    );
    return { usage: usage?.used || 0 };
  }

  //=================================
  // RESET USAGE AFTER RENEW
  //=================================
  async reset_usage_service(
    subscriptionId: string,
    usageKey?: string,
    periodStart?: Date,
    periodEnd?: Date,
  ): Promise<void> {
    const now = new Date();
    const start = periodStart || new Date(now.getFullYear(), now.getMonth(), 1);
    const end =
      periodEnd ||
      new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const query = this.subscriptionUsageRepo
      .createQueryBuilder()
      .update(SubscriptionUsage)
      .set({ used: 0 })
      .where("subscription_id = :subscriptionId", { subscriptionId })
      .andWhere("period_start = :start", { start })
      .andWhere("period_end = :end", { end });

    if (usageKey) {
      query.andWhere("usage_key = :usageKey", { usageKey });
    }

    await query.execute();
  }

  //====================
  // GET ALL USAGE
  //====================
  async all_usage_for_subscription_service(
    subscriptionId: string,
  ): Promise<SubscriptionUsage[]> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return this.subscriptionUsageRepo.find({
      where: {
        subscriptionId,
        periodStart: start,
        periodEnd: end,
      },
    });
  }

  //====================================
  // Enforce usage limit, throws exception if exceeded
  //====================================
  async enforce_limit_service(
    subscriptionId: string,
    usageKey: string,
    limit: number,
    amount = 1,
  ): Promise<void> {
    const usage = await this.get_subscription_usage_serice(
      subscriptionId,
      usageKey,
    );
    const currentUsed = usage?.used || 0;

    if (currentUsed + amount > limit) {
      throw new BadRequestException(
        `Usage limit exceeded for ${usageKey}: ${currentUsed}/${limit}`,
      );
    }

    await this.increment_usage_service(subscriptionId, usageKey, amount);
  }
}
