// src/subscription_plans/subscription_plans.controller.ts
// UPDATED: Added POST /subscription_plan/create-checkout-session
// This replaces the fake subscribe + confirmPayment flow.

import {
  Controller, Get, Post, Param, Body,
  HttpCode, HttpStatus, HttpException,
} from "@nestjs/common";
import { SubscriptionPlanService } from "./subscription_plans.service";

@Controller("subscription_plan")
export class SubscriptionPlanController {
  constructor(private readonly subscriptionService: SubscriptionPlanService) {}

  // ── Create plan (admin only) ──────────────────────────────────────────────
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_subscription_plan(@Body() body: any) {
    try {
      const response = await this.subscriptionService.create_subscription_plan_service(body);
      return { message: "subscription plan created", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // ── List all active plans ─────────────────────────────────────────────────
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_subscription_plan() {
    try {
      const plans = await this.subscriptionService.all_subscription_plan_service();
      return { success: true, plans };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // ── THE NEW CHECKOUT ENDPOINT ─────────────────────────────────────────────
  // Replaces POST /subscribe/:userId + POST /subscription-payments/status/:id
  // Returns { payment_url } for paid plans, { free: true } for Free plan.
  //
  // Body: { planId, gateway, currency?, action }
  // Gateways: "stripe" | "telr" | "tap" | "paypal" | "free"
  @Post("create-checkout-session/:userId")
  @HttpCode(HttpStatus.OK)
  async create_checkout_session(
    @Param("userId") userId: string,
    @Body() body: { planId: string; gateway: string; currency?: string; action?: string },
  ) {
    try {
      const result = await this.subscriptionService.create_checkout_session_service({
        userId,
        planId:   body.planId,
        gateway:  body.gateway ?? "stripe",
        currency: body.currency ?? "AED",
        action:   (body.action as any) ?? "subscribe",
      });
      return { success: true, ...result };
    } catch (error: any) {
      throw new HttpException(error.message ?? error, HttpStatus.BAD_REQUEST);
    }
  }

  // ── Legacy subscribe (kept for backward compat) ───────────────────────────
  @Post("subscribe/:userId")
  @HttpCode(HttpStatus.OK)
  async subscribe_subscription_plan(
    @Param("userId") userId: string,
    @Body("planId") planId: string,
  ) {
    try {
      const subscription = await this.subscriptionService.subscribe_subscription_plan_service(userId, planId);
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // ── Get current subscription for user ─────────────────────────────────────
  @Get("user_current/:userId")
  @HttpCode(HttpStatus.OK)
  async user_subscription_plan(@Param("userId") userId: string) {
    try {
      const subscription = await this.subscriptionService.user_subscription_plan_service(userId);
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // ── Cancel ────────────────────────────────────────────────────────────────
  @Post("cancel_user/:userId")
  @HttpCode(HttpStatus.OK)
  async cancel_subscription_plan(@Param("userId") userId: string) {
    try {
      const subscription = await this.subscriptionService.cancel_subscription_plan_service(userId);
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // ── Upgrade ───────────────────────────────────────────────────────────────
  @Post("upgrade/:userId")
  @HttpCode(HttpStatus.OK)
  async upgrade(@Param("userId") userId: string, @Body("planId") planId: string) {
    try {
      const subscription = await this.subscriptionService.upgrade_subscription_plan_service(userId, planId);
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // ── Downgrade ─────────────────────────────────────────────────────────────
  @Post("downgrade/:userId")
  @HttpCode(HttpStatus.OK)
  async downgrade(@Param("userId") userId: string, @Body("planId") planId: string) {
    try {
      const subscription = await this.subscriptionService.downgrade_subscription_plan_service(userId, planId);
      return { success: true, subscription };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
