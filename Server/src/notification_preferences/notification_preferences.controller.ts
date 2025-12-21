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
import { NotificationPreferencesService } from "./notification_preferences.service";

@Controller("notification-preferences")
export class NotificationPreferencesController {
  constructor(
    private readonly preferencesService: NotificationPreferencesService
  ) {}

  ///////////////////////////////////////////////////////
  // CREATE PREFERENCES
  ///////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_preference(@Body() body: any) {
    try {
      const response =
        await this.preferencesService.create_preference_service(body);
      return { message: "preference created", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // UPDATE PREFERENCES
  ///////////////////////////////////////////////////////
  @Put("update/:preference_id")
  @HttpCode(HttpStatus.OK)
  async update_preference(
    @Param("preference_id") preference_id: string,
    @Body() updates: any
  ) {
    try {
      const response = await this.preferencesService.update_preference_service(
        preference_id,
        updates
      );
      return { message: "preference updated", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE PREFERENCES
  ///////////////////////////////////////////////////////
  @Get("single/:preference_id")
  @HttpCode(HttpStatus.OK)
  async single_preference(@Param("preference_id") preference_id: string) {
    try {
      const response =
        await this.preferencesService.single_preference_service(preference_id);
      return { message: "single preference", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET ALL PREFEERENCE
  ///////////////////////////////////////////////////////
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_preference(
    @Param("user_id") user_id: string,
    @Query("company_id") company_id?: string
  ) {
    try {
      const response = await this.preferencesService.user_preference_service(
        user_id,
        company_id
      );
      return { message: "user preference", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // ENABLE/DISABLE PREFERENECE
  ///////////////////////////////////////////////////////
  @Put("toggle-channel/:preference_id")
  @HttpCode(HttpStatus.OK)
  async toggle_channel(
    @Param("preference_id") preference_id: string,
    @Body()
    body: { channel: "email" | "sms" | "push" | "dashboard"; enabled: boolean }
  ) {
    try {
      const { channel, enabled } = body;
      const response = await this.preferencesService.toggle_channel_service(
        preference_id,
        channel,
        enabled
      );
      return { message: "toggle preference", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  ///////////////////////////////////////////////////////
  // DELETE PREFERENCES
  ///////////////////////////////////////////////////////
  @Delete("delete/:preference_id")
  @HttpCode(HttpStatus.OK)
  async delete_preference(@Param("preference_id") preference_id: string) {
    try {
      const response =
        await this.preferencesService.delete_preference_service(preference_id);
      return { message: "preference deleted", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
