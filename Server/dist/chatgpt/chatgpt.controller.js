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
exports.ChatgptController = void 0;
const common_1 = require("@nestjs/common");
const chatgpt_service_1 = require("./chatgpt.service");
let ChatgptController = class ChatgptController {
    gptService;
    constructor(gptService) {
        this.gptService = gptService;
    }
    async chat(prompt) {
        const reply = await this.gptService.generateResponse(prompt);
        return { reply };
    }
    send_document_form() {
        return { message: "send document form to chatgpt" };
    }
};
exports.ChatgptController = ChatgptController;
__decorate([
    (0, common_1.Post)("/"),
    __param(0, (0, common_1.Body)("prompt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatgptController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatgptController.prototype, "send_document_form", null);
exports.ChatgptController = ChatgptController = __decorate([
    (0, common_1.Controller)("chatgpt"),
    __metadata("design:paramtypes", [chatgpt_service_1.ChatgptService])
], ChatgptController);
//# sourceMappingURL=chatgpt.controller.js.map