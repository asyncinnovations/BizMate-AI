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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiReminderController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../guards/auth/auth.guard");
const ai_reminder_service_1 = require("./ai_reminder.service");
let AiReminderController = class AiReminderController {
    reminderService;
    constructor(reminderService) {
        this.reminderService = reminderService;
    }
    async create_reminder(body) {
        const data = {
            user_id: body.user_id,
            title: body.title,
            description: body.description,
            type: body.type,
            reminder_date: body.reminder_date,
            notify_before: body.notify_before,
            notify_channels: body.notify_channels || {},
            recurrence_rule: body.recurrence_rule,
            status: body.status,
            source: body.source ?? "manual",
            reference_id: body.reference_id ?? null,
            reference_type: body.reference_type ?? null,
            ai_prompt: body.ai_prompt ?? null,
        };
        const response = await this.reminderService.create_reminder_service(data);
        return { message: "Reminder created successfully.", response };
    }
    async all_reminders(req, status, type, from, to) {
        const filters = { status, type, from, to };
        const response = await this.reminderService.all_reminders_service(req.user?.uuid, filters);
        return { message: "All reminders retrieved.", response };
    }
    async user_reminder(user_id) {
        const response = await this.reminderService.user_reminder_service(user_id);
        if (!response)
            throw new common_1.NotFoundException("Reminder not found");
        return { message: "User reminders retrieved.", response };
    }
    async single_reminder(uuid) {
        const response = await this.reminderService.single_reminder_service(uuid);
        if (!response)
            throw new common_1.NotFoundException("Reminder not found");
        return { message: "Reminder retrieved.", response };
    }
    async update_reminder(reminder_id, body) {
        const data = {
            title: body.title,
            description: body.description,
            type: body.type,
            reminder_date: body.reminder_date,
            notify_before: body.notify_before,
            notify_channels: body.notify_channels || {},
            recurrence_rule: body.recurrence_rule,
            status: body.status,
            source: body.source,
            reference_id: body.reference_id,
            reference_type: body.reference_type,
            ai_prompt: body.ai_prompt,
        };
        const response = await this.reminderService.update_reminder_service(reminder_id, data);
        return { message: "Reminder updated successfully.", response };
    }
    async update_reminder_status(reminder_id, status) {
        const response = await this.reminderService.update_reminder_status_service(reminder_id, status);
        return { message: "Status updated successfully.", response };
    }
    async upcoming_reminders(daysAhead = 3) {
        const response = await this.reminderService.upcoming_reminder_service(Number(daysAhead));
        return { message: "Upcoming reminders retrieved.", response };
    }
    async recurring_reminders(user_id) {
        const response = await this.reminderService.recurring_reminder_servcie(user_id);
        return { message: "Recurring reminders retrieved.", response };
    }
    async create_ai_generated(req, body) {
        const data = { ...body, created_by_ai: true };
        const response = await this.reminderService.generate_ai_reminder_service(data);
        return { message: "AI generated reminder created.", response };
    }
    async delete_reminder(uuid) {
        const response = await this.reminderService.delete_reminder_service(uuid);
        return { message: "Reminder deleted successfully.", response };
    }
    async ai_generate_from_prompt(user_id, prompt) {
        if (!user_id)
            throw new common_1.BadRequestException("user_id is required.");
        if (!prompt)
            throw new common_1.BadRequestException("prompt is required.");
        return await this.reminderService.ai_generate_from_prompt_service(user_id, prompt);
    }
    async get_module_suggestions(user_id) {
        if (!user_id)
            throw new common_1.BadRequestException("user_id is required.");
        return await this.reminderService.get_module_suggestions_service(user_id);
    }
    async create_from_module(body) {
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        if (!body.reference_id)
            throw new common_1.BadRequestException("reference_id is required.");
        if (!body.title)
            throw new common_1.BadRequestException("title is required.");
        if (!body.reminder_date)
            throw new common_1.BadRequestException("reminder_date is required.");
        return await this.reminderService.create_from_module_service(body);
    }
};
exports.AiReminderController = AiReminderController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "create_reminder", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("type")),
    __param(3, (0, common_1.Query)("from")),
    __param(4, (0, common_1.Query)("to")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "all_reminders", null);
__decorate([
    (0, common_1.Get)("user/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "user_reminder", null);
__decorate([
    (0, common_1.Get)("single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "single_reminder", null);
__decorate([
    (0, common_1.Put)("update/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "update_reminder", null);
__decorate([
    (0, common_1.Patch)("update/status/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "update_reminder_status", null);
__decorate([
    (0, common_1.Get)("upcoming"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)("daysAhead")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "upcoming_reminders", null);
__decorate([
    (0, common_1.Get)("recurring/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "recurring_reminders", null);
__decorate([
    (0, common_1.Post)("ai-generated"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "create_ai_generated", null);
__decorate([
    (0, common_1.Delete)("delete/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "delete_reminder", null);
__decorate([
    (0, common_1.Post)("ai-generate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)("user_id")),
    __param(1, (0, common_1.Body)("prompt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "ai_generate_from_prompt", null);
__decorate([
    (0, common_1.Get)("suggestions/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "get_module_suggestions", null);
__decorate([
    (0, common_1.Post)("from-module"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiReminderController.prototype, "create_from_module", null);
exports.AiReminderController = AiReminderController = __decorate([
    (0, common_1.Controller)("ai_reminder"),
    (0, common_1.UseGuards)(auth_guard_1.JwtGuard),
    __metadata("design:paramtypes", [ai_reminder_service_1.AiReminderService])
], AiReminderController);
//# sourceMappingURL=ai_reminder.controller.js.map