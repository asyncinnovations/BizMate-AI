// src/notifications/notifications.controller.ts
// UPDATED:
// 1. GET /notifications/unread-count/:user_id — for bell badge polling
// 2. PUT /notifications/mark-all-read/:user_id — "Clear all" button
// 3. GET /notifications/user/:user_id supports ?limit= query param

import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus, HttpException,
} from "@nestjs/common";
import { NotificationsService }   from "./notifications.service";
import { NotificationType }       from "./notifications.entity";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ── CREATE (dashboard notification) ──────────────────────────────────────
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_notification(@Body() body: any) {
    try {
      const response = await this.notificationsService.create_notification_service(body);
      return { message: "notification created", response };
    } catch (err: any) {
      throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
    }
  }

  // ── SEND existing notification by ID ──────────────────────────────────────
  @Put("send/:notification_id")
  @HttpCode(HttpStatus.OK)
  async send_notification(@Param("notification_id") id: string) {
    try {
      const response = await this.notificationsService.send_notification_service(id);
      return { message: "notification sent", response };
    } catch (err: any) {
      throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
    }
  }

  // ── GET all for user ──────────────────────────────────────────────────────
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_notification(
    @Param("user_id") user_id: string,
    @Query("limit") limit?: string,
  ) {
    try {
      const response = await this.notificationsService.user_notification_service(
        user_id,
        limit ? parseInt(limit, 10) : 50,
      );
      return { message: "user notifications retrieved", response };
    } catch (err: any) {
      throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
    }
  }

  // ── GET unread count — polled every 60s by TopBar bell badge ─────────────
  @Get("unread-count/:user_id")
  @HttpCode(HttpStatus.OK)
  async unread_count(@Param("user_id") user_id: string) {
    try {
      const count = await this.notificationsService.unread_count_service(user_id);
      return { message: "unread count retrieved", count };
    } catch (err: any) {
      throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
    }
  }

  // ── GET single ────────────────────────────────────────────────────────────
  @Get("single/:notification_id")
  @HttpCode(HttpStatus.OK)
  async single_notification(@Param("notification_id") id: string) {
    try {
      const response = await this.notificationsService.single_notification_service(id);
      return { message: "notification retrieved", response };
    } catch (err: any) {
      throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
    }
  }

  // ── MARK single as read ───────────────────────────────────────────────────
  @Put("mark-read/:notification_id")
  @HttpCode(HttpStatus.OK)
  async mark_read_notification(@Param("notification_id") id: string) {
    try {
      const response = await this.notificationsService.mark_read_notification_service(id);
      return { message: "notification marked as read", response };
    } catch (err: any) {
      throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
    }
  }

  // ── MARK ALL as read for user ─────────────────────────────────────────────
  @Put("mark-all-read/:user_id")
  @HttpCode(HttpStatus.OK)
  async mark_all_read(@Param("user_id") user_id: string) {
    try {
      const response = await this.notificationsService.mark_all_read_service(user_id);
      return { message: "all notifications marked as read", response };
    } catch (err: any) {
      throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
    }
  }

  // ── BULK SEND ─────────────────────────────────────────────────────────────
  @Post("bulk-send")
  @HttpCode(HttpStatus.OK)
  async send_bulk_notification(@Body() body: { notifications: any[] }) {
    try {
      const response = await this.notificationsService.send_bulk_notification_service(
        body.notifications ?? body,
      );
      return { message: "bulk notifications sent", response };
    } catch (err: any) {
      throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  @Delete("delete/:notification_id")
  @HttpCode(HttpStatus.OK)
  async delete_notification(@Param("notification_id") id: string) {
    try {
      const response = await this.notificationsService.delete_notification(id);
      return { message: "notification deleted", response };
    } catch (err: any) {
      throw new HttpException(err.message ?? err, HttpStatus.BAD_REQUEST);
    }
  }
}
