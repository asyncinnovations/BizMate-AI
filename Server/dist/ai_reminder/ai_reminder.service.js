"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiReminderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ai_reminder_entity_1 = require("./ai_reminder.entity");
let AiReminderService = class AiReminderService {
    aiReminderRepo;
    constructor(aiReminderRepo) {
        this.aiReminderRepo = aiReminderRepo;
    }
    async create_reminder_service(data) {
        const reminder = this.aiReminderRepo.create(data);
        return await this.aiReminderRepo.save(reminder);
    }
    async all_reminders_service(user_id, filters) {
        const where = {};
        if (user_id)
            where.user_id = user_id;
        if (filters?.status)
            where.status = filters.status;
        if (filters?.type)
            where.type = filters.type;
        if (filters?.from && filters?.to)
            where.reminder_date = (0, typeorm_2.Between)(filters.from, filters.to);
        return await this.aiReminderRepo.find({
            where,
            order: { reminder_date: "ASC" },
        });
    }
    async single_reminder_service(uuid) {
        const reminder = await this.aiReminderRepo.findOne({ where: { uuid } });
        if (!reminder)
            throw new common_1.NotFoundException("Reminder not found");
        return reminder;
    }
    async user_reminder_service(user_id) {
        const reminder = await this.aiReminderRepo.query(`
    SELECT ar.*, u.full_name, u.email 
    FROM ai_reminders AS ar
    JOIN users AS u ON ar.user_id = u.uuid
    WHERE ar.user_id = $1
    `, [user_id]);
        if (!reminder || reminder.length === 0)
            throw new common_1.NotFoundException("No reminders found for this user");
        return reminder;
    }
    async update_reminder_service(uuid, data) {
        const reminder = await this.single_reminder_service(uuid);
        Object.assign(reminder, data);
        return await this.aiReminderRepo.save(reminder);
    }
    async delete_reminder_service(uuid) {
        const reminder = await this.single_reminder_service(uuid);
        return await this.aiReminderRepo.remove(reminder);
    }
    async update_reminder_status_service(uuid, status) {
        const reminder = await this.single_reminder_service(uuid);
        reminder.status = status;
        return await this.aiReminderRepo.save(reminder);
    }
    async recurring_reminder_servcie(user_id) {
        return await this.aiReminderRepo.find({
            where: {
                user_id,
                recurrence_rule: (0, typeorm_2.In)(["monthly", "quarterly", "yearly"]),
            },
        });
    }
    async upcoming_reminder_service(daysAhead = 3) {
        const now = new Date();
        const future = new Date();
        future.setDate(now.getDate() + daysAhead);
        return await this.aiReminderRepo.find({
            where: {
                reminder_date: (0, typeorm_2.Between)(now, future),
                status: "pending",
            },
        });
    }
    async create_bulk_reminders_service(reminders) {
        const created = this.aiReminderRepo.create(reminders);
        return await this.aiReminderRepo.save(created);
    }
    async generate_ai_reminder_service(data) {
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
};
exports.AiReminderService = AiReminderService;
exports.AiReminderService = AiReminderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ai_reminder_entity_1.AiReminder)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], AiReminderService);
//# sourceMappingURL=ai_reminder.service.js.map