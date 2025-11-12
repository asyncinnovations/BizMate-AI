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
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get("OPENAI_API_KEY");
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY is not set in environment variables");
        }
        this.openai = new openai_1.default({ apiKey });
    }
    async generate_response_service(prompt) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "o1-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            });
            return response.choices[0]?.message?.content || "No response.";
        }
        catch (error) {
            console.error(error);
            if (error.status === 429) {
                return "API rate limit exceeded. Please try again later.";
            }
            return "An error occurred while generating the response.";
        }
    }
    async generate_ai_reply_service(message, options) {
        try {
            const model = options?.model || "gpt-4o-mini";
            const temperature = options?.temperature ?? 0.7;
            const systemContent = options?.businessSnapshot
                ? `You are a professional AI assistant trained on this business information: ${JSON.stringify(options.businessSnapshot)}. Respond appropriately to the client.`
                : "You are a helpful AI assistant for a business communication platform.";
            const messages = [
                { role: "system", content: systemContent },
                { role: "user", content: message },
            ];
            const completion = await this.openai.chat.completions.create({
                model,
                messages,
                temperature,
            });
            const aiReply = completion.choices[0]?.message?.content?.trim();
            if (!aiReply)
                throw new Error("No reply generated from OpenAI");
            return aiReply;
        }
        catch (error) {
            console.error("AI reply generation failed:", error);
            return "⚠️ Sorry, I couldn’t generate a response right now.";
        }
    }
    async generate_faq_service(businessSnapshot) {
        const prompt = `Create 5-10 FAQ questions and answers based on this business info: ${JSON.stringify(businessSnapshot)}. Return as a JSON array of objects [{question, answer}]`;
        const faqText = await this.generate_ai_reply_service(prompt, {
            businessSnapshot,
            purpose: "faq",
        });
        try {
            return JSON.parse(faqText);
        }
        catch {
            return [];
        }
    }
    async generate_exampletone_service(businessSnapshot) {
        const prompt = `Generate 3-5 tone examples for replying to clients for this business. Include situation and how AI should respond: ${JSON.stringify(businessSnapshot)}. Return as JSON array [{situation, ai_should_reply_like}]`;
        const toneText = await this.generate_ai_reply_service(prompt, {
            businessSnapshot,
            purpose: "tone_examples",
        });
        try {
            return JSON.parse(toneText);
        }
        catch {
            return [];
        }
    }
    async create_embedding_service(text) {
        try {
            const res = await this.openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text,
            });
            return res.data[0].embedding;
        }
        catch (error) {
            console.error("Error creating embedding:", error);
            return [];
        }
    }
};
exports.ChatgptService = ChatgptService;
exports.ChatgptService = ChatgptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatgptService);
//# sourceMappingURL=chatgpt.service.js.map