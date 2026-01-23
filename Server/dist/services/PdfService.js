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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = __importStar(require("puppeteer"));
const fs = __importStar(require("fs"));
const pdf_parse_1 = require("pdf-parse");
let PdfService = class PdfService {
    async TemplatePDFGenerator(data, filePath) {
        const browser = await puppeteer.launch({
            headless: "shell",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        try {
            const page = await browser.newPage();
            let htmlContent = `
      <html>
        <head>
          <style>
            @page { size: A4; margin: 20mm; } /* CSS forced A4 size */
            body { font-family: Arial, sans-serif; padding: 0; margin: 0; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>${data.template_name}</h1>
          <p>${data.description}</p>
          <table>
            <tbody>
    `;
            for (const key in data.fields_schema) {
                let value = data.fields_schema[key];
                if (Array.isArray(value)) {
                    value =
                        value.length > 0 && typeof value[0] === "object"
                            ? value.map((v) => v.name || JSON.stringify(v)).join(", ")
                            : value.join(", ");
                }
                htmlContent += `<tr><th>${key}</th><td>${value}</td></tr>`;
            }
            htmlContent += `</tbody></table></body></html>`;
            await page.setContent(htmlContent, { waitUntil: "networkidle0" });
            await page.pdf({
                path: filePath,
                format: "A4",
                printBackground: true,
                displayHeaderFooter: false,
                margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
            });
            return { success: true, message: "PDF generated successfully" };
        }
        catch (error) {
            console.error("PDF Generation Error:", error);
            return { success: false, message: error.message };
        }
        finally {
            await browser.close();
        }
    }
    async InvoicePDFGenerator(data, filePath) {
        const browser = await puppeteer.launch({
            headless: "shell",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        try {
            const page = await browser.newPage();
            let htmlContent = `
      <html>
        <head>
          <title>Invoice - ${data.template_name}</title>
          <style>
            /* Essential A4 Print Settings */
            @page { 
              size: A4; 
              margin: 15mm; 
            }
            body { 
              font-family: 'Helvetica', 'Arial', sans-serif; 
              line-height: 1.5;
              color: #333;
              margin: 0;
              padding: 0;
            }
            h1 { text-align: center; color: #000; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            td, th { border: 1px solid #ddd; padding: 10px; text-align: left; }
            
            /* Professional Invoice Look */
            .description { margin-bottom: 20px; font-style: italic; color: #666; }
          </style>
        </head>
        <body>
          <h1>${data.template_name}</h1>
          <div class="description">${data.description}</div>
          <table>
            <tbody>
    `;
            for (const key in data.fields_schema) {
                let value = data.fields_schema[key];
                if (Array.isArray(value)) {
                    value =
                        value.length > 0 && typeof value[0] === "object"
                            ? value.map((v) => v.name || JSON.stringify(v)).join(", ")
                            : value.join(", ");
                }
                htmlContent += `
        <tr>
          <th style="width: 30%;">${key}</th>
          <td>${value}</td>
        </tr>
      `;
            }
            htmlContent += `
            </tbody>
          </table>
        </body>
      </html>
    `;
            await page.setContent(htmlContent, { waitUntil: "networkidle0" });
            await page.pdf({
                path: filePath,
                format: "A4",
                printBackground: true,
                margin: {
                    top: "15mm",
                    right: "15mm",
                    bottom: "15mm",
                    left: "15mm",
                },
            });
            return { success: true, message: "Invoice PDF generated successfully" };
        }
        catch (error) {
            console.error("PDF Generation failed:", error);
            return { success: false, message: error.message };
        }
        finally {
            await browser.close();
        }
    }
    async PDFToTextConverter(pdfPath) {
        if (!fs.existsSync(pdfPath)) {
            throw new Error("PDF file not found: " + pdfPath);
        }
        const parser = new pdf_parse_1.PDFParse({ url: pdfPath });
        const result = await parser.getText();
        return result.text;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=PdfService.js.map