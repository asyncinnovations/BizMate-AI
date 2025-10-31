"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenceNumberChecker = void 0;
const promises_1 = require("node:fs/promises");
const pdf_parse_1 = require("pdf-parse");
const LicenceNumberChecker = async (file, licenseNumber) => {
    if (!file || !file.path)
        return { success: false, message: "No file uploaded or file path missing" };
    try {
        const buffer = await (0, promises_1.readFile)(file.path);
        const parser = new pdf_parse_1.PDFParse({ data: buffer });
        const pdfData = await parser.getText();
        const fullText = pdfData.text || "";
        const normalizedText = fullText.replace(/\s+/g, "").toLowerCase();
        const normalizedLicense = licenseNumber.replace(/\s+/g, "").toLowerCase();
        const exists = normalizedText.includes(normalizedLicense);
        return {
            success: true,
            licenseExists: exists,
        };
    }
    catch (error) {
        console.error("PDF parsing error:", error);
        return {
            success: false,
            message: "Failed to parse PDF and check license number.",
        };
    }
};
exports.LicenceNumberChecker = LicenceNumberChecker;
//# sourceMappingURL=LicenceNumberChecker.js.map