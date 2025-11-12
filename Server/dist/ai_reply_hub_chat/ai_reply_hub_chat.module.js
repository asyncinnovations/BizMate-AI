"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiReplyHubChatModule = void 0;
const common_1 = require("@nestjs/common");
const ai_reply_hub_chat_service_1 = require("./ai_reply_hub_chat.service");
const ai_reply_hub_chat_controller_1 = require("./ai_reply_hub_chat.controller");
const ai_reply_hub_chat_entity_1 = require("./ai_reply_hub_chat.entity");
const typeorm_1 = require("@nestjs/typeorm");
const chatgpt_service_1 = require("../chatgpt/chatgpt.service");
const user_business_info_service_1 = require("../user_business_info/user_business_info.service");
const user_business_info_entity_1 = require("../user_business_info/user_business_info.entity");
let AiReplyHubChatModule = class AiReplyHubChatModule {
};
exports.AiReplyHubChatModule = AiReplyHubChatModule;
exports.AiReplyHubChatModule = AiReplyHubChatModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ai_reply_hub_chat_entity_1.AiReplyHubChat, user_business_info_entity_1.UserBusinessInfo])],
        providers: [ai_reply_hub_chat_service_1.AiReplyHubChatService, chatgpt_service_1.ChatgptService, user_business_info_service_1.UserBusinessInfoService],
        controllers: [ai_reply_hub_chat_controller_1.AiReplyHubChatController],
        exports: [ai_reply_hub_chat_service_1.AiReplyHubChatService],
    })
], AiReplyHubChatModule);
//# sourceMappingURL=ai_reply_hub_chat.module.js.map