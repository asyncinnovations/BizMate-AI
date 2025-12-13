import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationPreference } from "./notification_preferences.entity";

@Injectable()
export class NotificationPreferencesService {
  constructor(
    @InjectRepository(NotificationPreference)
    private readonly preferenceRepository: Repository<NotificationPreference>
  ) {}

  ///////////////////////////////////////////////////////
  // CREATE PREFERENCES
  ///////////////////////////////////////////////////////
  async createPreference(data: {
    user_id: string;
    company_id?: string;
    event_type: string;
    email_enabled?: boolean;
    sms_enabled?: boolean;
    push_enabled?: boolean;
    dashboard_enabled?: boolean;
  }) {
    const preference = this.preferenceRepository.create(data);
    return this.preferenceRepository.save(preference);
  }

  ///////////////////////////////////////////////////////
  // UPDATE PREFERENCES
  ///////////////////////////////////////////////////////
  async updatePreference(
    preference_id: string,
    updates: Partial<NotificationPreference>
  ) {
    const pref = await this.preferenceRepository.find({
      where: { uuid: preference_id },
    });
    if (!pref) throw new HttpException("Preference not found", 404);
    Object.assign(pref, updates);
    return this.preferenceRepository.save(pref);
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE PREFERENCES
  ///////////////////////////////////////////////////////
  async getPreferenceById(preference_id: string) {
    const pref = await this.preferenceRepository.findOne({
      where: { uuid: preference_id },
    });
    if (!pref) throw new HttpException("Preference not found", 404);
    return pref;
  }

  ///////////////////////////////////////////////////////
  // GET ALL PREFEERENCE
  ///////////////////////////////////////////////////////
  async getPreferencesByUser(user_id: string, company_id?: string) {
    return this.preferenceRepository.find({ where: { user_id, company_id } });
  }

  ///////////////////////////////////////////////////////
  // DELETE PREFERENCES
  ///////////////////////////////////////////////////////
  async deletePreference(preference_id: string) {
    const pref = await this.getPreferenceById(preference_id);
    await this.preferenceRepository.remove(pref);
    return { message: "Preference deleted successfully" };
  }

  ///////////////////////////////////////////////////////
  // ENABLE/DISABLE PREFERENECE
  ///////////////////////////////////////////////////////
  async toggleChannel(
    preference_id: string,
    channel: "email" | "sms" | "push" | "dashboard",
    enabled: boolean
  ) {
    const pref = await this.getPreferenceById(preference_id);
    switch (channel) {
      case "email":
        pref.email_enabled = enabled;
        break;
      case "sms":
        pref.sms_enabled = enabled;
        break;
      case "push":
        pref.push_enabled = enabled;
        break;
      case "dashboard":
        pref.dashboard_enabled = enabled;
        break;
      default:
        throw new HttpException("Invalid channel", 400);
    }
    return this.preferenceRepository.save(pref);
  }
}
