import { Injectable } from "@nestjs/common";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import * as mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { PromptService } from "./PromptService";
import { GPTService } from "./GPTService";
import { readFile } from "fs/promises";

@Injectable()
export class DocumentConverter {
  constructor() {}
  //================================
  // Convert uploaded document to text
  // Supports PDF, DOCX, and images (PNG, JPG)
  // Returns { rawText, parsedData? }
  //================================

  /**
   * Convert file buffer to plain text
   * @param buffer - File buffer
   * @param mimetype - File type (pdf, docx, jpg/png)
   * @returns plain text string
   */
  async convertToText(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const pdfData = await parser.getText();
      const fullText = pdfData.text || "";
      const normalizedText = fullText.replace(/\s+/g, "").toLowerCase();
      return normalizedText;
    } else if (
      mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimetype === "application/msword"
    ) {
      const { value } = await mammoth.extractRawText({ buffer });
      return value;
    } else if (mimetype.startsWith("image/")) {
      const result = await Tesseract.recognize(buffer, "eng", {
        logger: (m: any) => {},
      });
      return result.data.text;
    } else {
      throw new Error("Unsupported file type");
    }
  }

  /**
   *parse structured fields from license text
   * This can be enhanced with AI (GPT)
   * @param rawText - Extracted plain text
   * @returns parsed JSON object
   */
  async parseStructuredData(rawText: string): Promise<any> {
    // we can call GPT here to extract fields
    const prompt_service = new PromptService();
    const gpt_service = new GPTService();
    const aiResponse: any = await gpt_service.GPTChat(
      rawText,
      prompt_service.DocumentFieldExtractionPrompt(),
    );
    const parsedData = JSON.parse(aiResponse.data.content);
    return {
      parsedData,
    };
  }

  /**
   * Convert document to both raw text and structured JSON
   * @param buffer - File buffer
   * @param mimetype - File type
   * @returns { rawText, parsedData }
   */
  async convertDocument(file: Buffer, mimetype: string) {
    const buffer = await readFile(file);
    const rawText = await this.convertToText(buffer, mimetype);
    // const parsedData = await this.parseStructuredData(rawText);
    
    return { rawText };
  }
}
