import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
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
  @Post()
  async createPreference(@Body() body: any) {
    return this.preferencesService.createPreference(body);
  }

  ///////////////////////////////////////////////////////
  // UPDATE PREFERENCES
  ///////////////////////////////////////////////////////
  @Put(":preference_id")
  async updatePreference(
    @Param("preference_id") preference_id: string,
    @Body() updates: any
  ) {
    return this.preferencesService.updatePreference(preference_id, updates);
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE PREFERENCES
  ///////////////////////////////////////////////////////
  @Get(":preference_id")
  async getPreferenceById(@Param("preference_id") preference_id: string) {
    return this.preferencesService.getPreferenceById(preference_id);
  }

  ///////////////////////////////////////////////////////
  // GET ALL PREFEERENCE
  ///////////////////////////////////////////////////////
  @Get("user/:user_id")
  async getPreferencesByUser(
    @Param("user_id") user_id: string,
    @Query("company_id") company_id?: string
  ) {
    return this.preferencesService.getPreferencesByUser(user_id, company_id);
  }

  ///////////////////////////////////////////////////////
  // DELETE PREFERENCES
  ///////////////////////////////////////////////////////
  @Delete(":preference_id")
  async deletePreference(@Param("preference_id") preference_id: string) {
    return this.preferencesService.deletePreference(preference_id);
  }

  ///////////////////////////////////////////////////////
  // ENABLE/DISABLE PREFERENECE
  ///////////////////////////////////////////////////////
  @Put(":preference_id/toggle-channel")
  async toggleChannel(
    @Param("preference_id") preference_id: string,
    @Body()
    body: { channel: "email" | "sms" | "push" | "dashboard"; enabled: boolean }
  ) {
    const { channel, enabled } = body;
    return this.preferencesService.toggleChannel(
      preference_id,
      channel,
      enabled
    );
  }
}
