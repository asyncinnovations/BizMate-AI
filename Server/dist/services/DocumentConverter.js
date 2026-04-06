"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentConverter = void 0;
const common_1 = require("@nestjs/common");
const pdf_parse_1 = require("pdf-parse");
const mammoth = __importStar(require("mammoth"));
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const PromptService_1 = require("./PromptService");
const GPTService_1 = require("./GPTService");
const promises_1 = require("fs/promises");
let DocumentConverter = class DocumentConverter {
    constructor() { }
    async convertToText(buffer, mimetype) {
        if (mimetype === "application/pdf") {
            const parser = new pdf_parse_1.PDFParse({ data: buffer });
            const pdfData = await parser.getText();
            const fullText = pdfData.text || "";
            const normalizedText = fullText.replace(/\s+/g, "").toLowerCase();
            return normalizedText;
        }
        else if (mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            mimetype === "application/msword") {
            const { value } = await mammoth.extractRawText({ buffer });
            return value;
        }
        else if (mimetype.startsWith("image/")) {
            const result = await tesseract_js_1.default.recognize(buffer, "eng", {
                logger: (m) => { },
            });
            return result.data.text;
        }
        else {
            throw new Error("Unsupported file type");
        }
    }
    async parseStructuredData(rawText) {
        const prompt_service = new PromptService_1.PromptService();
        const gpt_service = new GPTService_1.GPTService();
        const aiResponse = await gpt_service.GPTChat(rawText, prompt_service.DocumentFieldExtractionPrompt());
        const parsedData = JSON.parse(aiResponse.data.content);
        return {
            parsedData,
        };
    }
    async convertDocument(file, mimetype) {
        const buffer = await (0, promises_1.readFile)(file);
        const rawText = await this.convertToText(buffer, mimetype);
        return { rawText };
    }
};
exports.DocumentConverter = DocumentConverter;
exports.DocumentConverter = DocumentConverter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DocumentConverter);
//# sourceMappingURL=DocumentConverter.js.map