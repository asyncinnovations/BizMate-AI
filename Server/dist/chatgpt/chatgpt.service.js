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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatgptService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let ChatgptService = class ChatgptService {
    configService;
    openai;
    OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    constructor(configService) {
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get(this.OPENAI_API_KEY),
        });
    }
    async generateResponse(prompt) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "o1-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            });
            return response.choices[0]?.message?.content || "No response.";
        }
        catch (error) {
            console.log(error);
            if (error.status === 429) {
                return "API rate limit exceeded. Please try again later.";
            }
            console.error(error);
            return "An error occurred while generating the response.";
        }
    }
};
exports.ChatgptService = ChatgptService;
exports.ChatgptService = ChatgptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatgptService);
//# sourceMappingURL=chatgpt.service.js.map