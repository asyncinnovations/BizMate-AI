import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, In } from "typeorm";
import { AiReminder } from "./ai_reminder.entity";

@Injectable()
export class AiReminderService {
  constructor(
    @InjectRepository(AiReminder)
    private readonly aiReminderRepo: Repository<AiReminder>
  ) {}

  //////////////////////////////////////////////////////
  // CREATE REMINDER
  //////////////////////////////////////////////////////
  async create_reminder_service(data: Partial<AiReminder>) {
    const reminder = this.aiReminderRepo.create(data);
    return await this.aiReminderRepo.save(reminder);
  }

  //////////////////////////////////////////////////////
  // GET ALL REMINDERS
  //////////////////////////////////////////////////////
  async all_reminders_service(user_id?: string, filters?: any) {
    const where: any = {};
    if (user_id) where.user_id = user_id;
    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;
    if (filters?.from && filters?.to)
      where.reminder_date = Between(filters.from, filters.to);

    return await this.aiReminderRepo.find({
      where,
      order: { reminder_date: "ASC" },
    });
  }

  //////////////////////////////////////////////////////
  // GET REMINDER BY UUID
  //////////////////////////////////////////////////////
  async single_reminder_service(uuid: string) {
    const reminder = await this.aiReminderRepo.findOne({ where: { uuid } });
    if (!reminder) throw new NotFoundException("Reminder not found");
    return reminder;
  }

  //////////////////////////////////////////////////////
  // USER REMINDER BY USER ID
  //////////////////////////////////////////////////////
  async user_reminder_service(user_id: string) {
    const reminder = await this.aiReminderRepo.query(
      `
    SELECT ar.*, u.full_name, u.email 
    FROM ai_reminders AS ar
    JOIN users AS u ON ar.user_id = u.uuid
    WHERE ar.user_id = $1
    `,
      [user_id]
    );

    if (!reminder || reminder.length === 0)
      throw new NotFoundException("No reminders found for this user");
    return reminder;
  }

  //////////////////////////////////////////////////////
  // UPDATE REMINDER
  //////////////////////////////////////////////////////
  async update_reminder_service(uuid: string, data: Partial<AiReminder>) {
    const reminder = await this.single_reminder_service(uuid);
    Object.assign(reminder, data);
    return await this.aiReminderRepo.save(reminder);
  }

  //////////////////////////////////////////////////////
  // DELETE REMINDER
  //////////////////////////////////////////////////////
  async delete_reminder_service(uuid: string) {
    const reminder = await this.single_reminder_service(uuid);
    return await this.aiReminderRepo.remove(reminder);
  }

  //////////////////////////////////////////////////////
  // MARK REMINDER STATUS
  //////////////////////////////////////////////////////
  async update_reminder_status_service(
    uuid: string,
    status: AiReminder["status"]
  ) {
    const reminder = await this.single_reminder_service(uuid);
    reminder.status = status;
    return await this.aiReminderRepo.save(reminder);
  }

  //////////////////////////////////////////////////////
  // GET RECURRING REMINDERS
  //////////////////////////////////////////////////////
  async recurring_reminder_servcie(user_id: string) {
    return await this.aiReminderRepo.find({
      where: {
        user_id,
        recurrence_rule: In(["monthly", "quarterly", "yearly"]),
      },
    });
  }

  //////////////////////////////////////////////////////
  // FIND UPCOMING REMINDERS >> for notification jobs
  //////////////////////////////////////////////////////
  async upcoming_reminder_service(daysAhead = 3) {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + daysAhead);

    return await this.aiReminderRepo.find({
      where: {
        reminder_date: Between(now, future),
        status: "pending",
      },
    });
  }

  //////////////////////////////////////////////////////
  // BULK CREATE (e.g., import from AI assistant)
  //////////////////////////////////////////////////////
  async create_bulk_reminders_service(reminders: Partial<AiReminder>[]) {
    const created = this.aiReminderRepo.create(reminders);
    return await this.aiReminderRepo.save(created);
  }

  //////////////////////////////////////////////////////
  // CREATE AI-GENERATED REMINDER
  //////////////////////////////////////////////////////
  async generate_ai_reminder_service(data: Partial<AiReminder>) {
    data.status = "pending";
    const reminder = this.aiReminderRepo.create({
      ...data,
      notify_channels: data.notify_channels || {
        email: true,
        whatsapp: false,
        push: true,
      },
    });
    return await this.aiReminderRepo.save(reminder);
  }
}
