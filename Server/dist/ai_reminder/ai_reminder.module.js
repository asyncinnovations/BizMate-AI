"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiReminderModule = void 0;
const common_1 = require("@nestjs/common");
const ai_reminder_service_1 = require("./ai_reminder.service");
const ai_reminder_controller_1 = require("./ai_reminder.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ai_reminder_entity_1 = require("./ai_reminder.entity");
let AiReminderModule = class AiReminderModule {
};
exports.AiReminderModule = AiReminderModule;
exports.AiReminderModule = AiReminderModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ai_reminder_entity_1.AiReminder])],
        providers: [ai_reminder_service_1.AiReminderService],
        controllers: [ai_reminder_controller_1.AiReminderController],
        exports: [],
    })
], AiReminderModule);
//# sourceMappingURL=ai_reminder.module.js.map