import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import {
  Notification,
  NotificationType,
  NotificationStatus,
} from "./notifications.entity";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  ///////////////////////////////////////////////////////
  // CREATE NOTIFICATION
  ///////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_notification(@Body() body: any) {
    try {
      const response =
        await this.notificationsService.create_notification_service(body);
      return { message: "notification send success", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // SEND NOTIFICATION
  ///////////////////////////////////////////////////////
  @Put("send/:notification_id")
  @HttpCode(HttpStatus.CREATED)
  async send_notification(@Param("notification_id") notification_id: string) {
    try {
      const response =
        await this.notificationsService.send_notification_service(
          notification_id
        );
      return { message: "notification send success", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET USER NOTIFICATION
  ///////////////////////////////////////////////////////
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_notification(
    @Param("user_id") user_id: string,
    @Query("company_id") company_id?: string
  ) {
    try {
      const response =
        await this.notificationsService.user_notification_service(
          user_id,
          company_id
        );
      return { message: "user notification get success", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE NOTIFICATION
  ///////////////////////////////////////////////////////
  @Get("single/:notification_id")
  @HttpCode(HttpStatus.OK)
  async single_notification(@Param("notification_id") notification_id: string) {
    try {
      const response =
        await this.notificationsService.single_notification_service(
          notification_id
        );
      return { message: "single notification get success", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // MARK NOTIFICATION AS READ
  ///////////////////////////////////////////////////////
  @Put("mark-read/:notification_id")
  @HttpCode(HttpStatus.OK)
  async mark_read_notification(
    @Param("notification_id") notification_id: string
  ) {
    try {
      const response =
        await this.notificationsService.mark_read_notification_service(
          notification_id
        );
      return { message: "notification marked as read", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // SEND BULK NOTIFICATION
  ///////////////////////////////////////////////////////
  @Post("bulk-send")
  @HttpCode(HttpStatus.OK)
  async send_bulk_notification(@Body() notifications: Notification[]) {
    try {
      const response =
        await this.notificationsService.send_bulk_notification_service(
          notifications
        );
      return { message: "bulk notification send success", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  ///////////////////////////////////////////////////////
  // DELETE NOTIFICATION
  ///////////////////////////////////////////////////////
  @Delete("delete/:notification_id")
  @HttpCode(HttpStatus.OK)
  async delete_notification(@Param("notification_id") notification_id: string) {
    try {
      const response =
        await this.notificationsService.delete_notification(notification_id);
      return { message: "notification delete success", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
