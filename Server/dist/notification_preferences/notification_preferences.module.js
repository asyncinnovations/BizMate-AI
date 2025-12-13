"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPreferencesModule = void 0;
const common_1 = require("@nestjs/common");
const notification_preferences_service_1 = require("./notification_preferences.service");
const notification_preferences_controller_1 = require("./notification_preferences.controller");
const typeorm_1 = require("@nestjs/typeorm");
const notification_preferences_entity_1 = require("./notification_preferences.entity");
let NotificationPreferencesModule = class NotificationPreferencesModule {
};
exports.NotificationPreferencesModule = NotificationPreferencesModule;
exports.NotificationPreferencesModule = NotificationPreferencesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([notification_preferences_entity_1.NotificationPreference])],
        providers: [notification_preferences_service_1.NotificationPreferencesService],
        controllers: [notification_preferences_controller_1.NotificationPreferencesController],
    })
], NotificationPreferencesModule);
//# sourceMappingURL=notification_preferences.module.js.map