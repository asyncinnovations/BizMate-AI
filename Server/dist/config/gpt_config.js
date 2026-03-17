"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gtp_config = void 0;
const openai_1 = __importDefault(require("openai"));
exports.gtp_config = new openai_1.default({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});
//# sourceMappingURL=gpt_config.js.map