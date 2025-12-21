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
  async create_preference_service(data: {
    user_id: string;
    company_id?: string;
    event_type: string;
    email_enabled?: boolean;
    sms_enabled?: boolean;
    push_enabled?: boolean;
    dashboard_enabled?: boolean;
  }) {
    const preference = this.preferenceRepository.create(data);
    const result = await this.preferenceRepository.save(preference);
    return result;
  }

  ///////////////////////////////////////////////////////
  // UPDATE PREFERENCES
  ///////////////////////////////////////////////////////
  async update_preference_service(
    preference_id: string,
    updates: Partial<NotificationPreference>
  ) {
    const pref = await this.preferenceRepository.find({
      where: { uuid: preference_id },
    });
    if (!pref) throw new HttpException("Preference not found", 404);
    Object.assign(pref, updates);
    const result = await this.preferenceRepository.save(pref);
    return result;
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE PREFERENCES
  ///////////////////////////////////////////////////////
  async single_preference_service(preference_id: string) {
    const pref = await this.preferenceRepository.findOne({
      where: { uuid: preference_id },
    });
    if (!pref) throw new HttpException("Preference not found", 404);
    return pref;
  }

  ///////////////////////////////////////////////////////
  // GET ALL PREFEERENCE
  ///////////////////////////////////////////////////////
  async user_preference_service(user_id: string, company_id?: string) {
    return this.preferenceRepository.find({ where: { user_id, company_id } });
  }

  ///////////////////////////////////////////////////////
  // DELETE PREFERENCES
  ///////////////////////////////////////////////////////
  async delete_preference_service(preference_id: string) {
    const pref = await this.single_preference_service(preference_id);
    await this.preferenceRepository.remove(pref);
    return { message: "Preference deleted successfully" };
  }

  ///////////////////////////////////////////////////////
  // ENABLE/DISABLE PREFERENECE
  ///////////////////////////////////////////////////////
  async toggle_channel_service(
    preference_id: string,
    channel: "email" | "sms" | "push" | "dashboard",
    enabled: boolean
  ) {
    const pref = await this.single_preference_service(preference_id);
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
