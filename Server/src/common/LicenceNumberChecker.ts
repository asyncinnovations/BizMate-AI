import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";
export const LicenceNumberChecker = async (
  file: any,
  licenseNumber: string
) => {
  if (!file || !file.path)
    return { success: false, message: "No file uploaded or file path missing" };

  try {
    const buffer = await readFile(file.path);
    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    // console.log(pdfData.text);

    // Extract text
    const fullText = pdfData.text || "";

    // Normalize and compare
    const normalizedText = fullText.replace(/\s+/g, "").toLowerCase();
    const normalizedLicense = licenseNumber.replace(/\s+/g, "").toLowerCase();
    const exists = normalizedText.includes(normalizedLicense);

    return {
      success: true,
      licenseExists: exists,
    };
  } catch (error: any) {
    console.error("PDF parsing error:", error);
    return {
      success: false,
      message: "Failed to parse PDF and check license number.",
    };
  }
};
