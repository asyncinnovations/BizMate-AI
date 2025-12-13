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
exports.NotificationPreferencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_preferences_entity_1 = require("./notification_preferences.entity");
let NotificationPreferencesService = class NotificationPreferencesService {
    preferenceRepository;
    constructor(preferenceRepository) {
        this.preferenceRepository = preferenceRepository;
    }
    async createPreference(data) {
        const preference = this.preferenceRepository.create(data);
        return this.preferenceRepository.save(preference);
    }
    async updatePreference(preference_id, updates) {
        const pref = await this.preferenceRepository.find({
            where: { uuid: preference_id },
        });
        if (!pref)
            throw new common_1.HttpException("Preference not found", 404);
        Object.assign(pref, updates);
        return this.preferenceRepository.save(pref);
    }
    async getPreferenceById(preference_id) {
        const pref = await this.preferenceRepository.findOne({
            where: { uuid: preference_id },
        });
        if (!pref)
            throw new common_1.HttpException("Preference not found", 404);
        return pref;
    }
    async getPreferencesByUser(user_id, company_id) {
        return this.preferenceRepository.find({ where: { user_id, company_id } });
    }
    async deletePreference(preference_id) {
        const pref = await this.getPreferenceById(preference_id);
        await this.preferenceRepository.remove(pref);
        return { message: "Preference deleted successfully" };
    }
    async toggleChannel(preference_id, channel, enabled) {
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
                throw new common_1.HttpException("Invalid channel", 400);
        }
        return this.preferenceRepository.save(pref);
    }
};
exports.NotificationPreferencesService = NotificationPreferencesService;
exports.NotificationPreferencesService = NotificationPreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_preferences_entity_1.NotificationPreference)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationPreferencesService);
//# sourceMappingURL=notification_preferences.service.js.map