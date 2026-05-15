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
    async launchBrowser() {
        return await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
            ],
        });
    }
    async TemplatePDFGenerator(data, filePath) {
        const browser = await this.launchBrowser();
        try {
            const page = await browser.newPage();
            const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <style>
              @page { size: A4; margin: 20mm; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
              header { border-bottom: 2px solid #1F6B2E; margin-bottom: 20px; padding-bottom: 10px; }
              h1 { color: #1F6B2E; margin: 0; font-size: 24px; }
              .description { color: #666; font-style: italic; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th { background-color: #f8f9fa; color: #111827; font-weight: 600; width: 30%; }
              td, th { border: 1px solid #E5E7EB; padding: 12px; text-align: left; }
              tr:nth-child(even) { background-color: #fdfdfd; }
          </style>
      </head>
      <body>
          <header>
              <h1>${data.template_name || "Document Template"}</h1>
          </header>
          <p class="description">${data.description || ""}</p>
          <table>
              <tbody>
                  ${Object.entries(data.fields_schema || {})
                .map(([key, value]) => {
                const displayValue = Array.isArray(value)
                    ? value
                        .map((v) => typeof v === "object"
                        ? v.name || JSON.stringify(v)
                        : v)
                        .join(", ")
                    : value;
                return `<tr><th>${key}</th><td>${displayValue}</td></tr>`;
            })
                .join("")}
              </tbody>
          </table>
      </body>
      </html>`;
            await page.setContent(htmlContent, { waitUntil: "load" });
            await page.pdf({
                path: filePath,
                format: "A4",
                printBackground: true,
                margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
            });
            return { success: true, message: "Template PDF generated successfully" };
        }
        catch (error) {
            console.error("Template PDF Generation Error:", error);
            throw new common_1.InternalServerErrorException(`Failed to generate PDF: ${error.message}`);
        }
        finally {
            await browser.close();
        }
    }
    async InvoicePDFGenerator(data, filePath) {
        const browser = await this.launchBrowser();
        try {
            const page = await browser.newPage();
            const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <style>
              * { box-sizing: border-box; }
              body {
                  font-family: 'Segoe UI', Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  color: #111827;
                  font-size: 10.5px; /* Slightly smaller base text */
                  line-height: 1.3;
                  background-color: white;
              }

              .container {
                  width: 100%;
                  max-width: 800px;
                  margin: auto;
                  padding: 20px 30px; /* Reduced top/bottom padding */
                  position: relative;
              }

              /*Header & Details */
              .header { display: flex; justify-content: space-between; margin-bottom: 15px; }
              .company-info h2 { color: #1E3A8A; margin: 0 0 5px 0; font-size: 18px; }
              .company-info p { margin: 1px 0; color: #4B5563; }

              .invoice-details { text-align: right; }
              .invoice-details h1 { color: #1E3A8A; font-size: 28px; margin: 0 0 10px 0; }
              .detail-row { display: flex; justify-content: flex-end; margin-bottom: 3px; }
              .detail-label { color: #3B82F6; font-weight: bold; width: 100px; text-align: left; }
              .detail-value { width: 100px; text-align: right; font-weight: 500; }

              .total-due-box {
                  background: #0D1B3E; color: white; padding: 8px 12px;
                  border-radius: 6px; margin-top: 8px; text-align: center;
              }
              .total-due-box span { display: block; font-size: 9px; opacity: 0.8; }
              .total-due-box strong { font-size: 20px; }

              /* Info Sections */
              .info-section {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 15px; border-top: 1px solid #E5E7EB; padding-top: 15px;
              }
              .section-title { color: #3B82F6; font-weight: bold; margin-bottom: 8px; font-size: 11px; }

              /* Table Styling */
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th { background: #0D1B3E; color: white; padding: 10px; text-align: left; font-size: 9px; }
              td { padding: 10px; border-bottom: 1px solid #F3F4F6; vertical-align: top; }
              .col-center { text-align: center; }
              .col-right { text-align: right; }
              .item-desc { color: #6B7280; font-size: 10px; margin-top: 2px; }

              /* Totals Section */
              .summary-container { display: flex; justify-content: space-between; margin-top: 15px; }
              .amount-words { width: 55%; color: #3B82F6; font-size: 10px; }
              .totals-table { width: 35%; background: #EFF6FF; border-radius: 6px; padding: 8px; }
              .total-line { display: flex; justify-content: space-between; padding: 4px 8px; }
              .total-line.grand-total { color: #1E3A8A; font-weight: bold; border-top: 1px solid #BFDBFE; margin-top: 4px; padding-top: 8px; }

              /* Footer Section */
              .footer-grid {
                  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;
                  margin-top: 25px; border-top: 1px solid #E5E7EB; padding-top: 15px;
              }
              .footer-col h4 { color: #3B82F6; margin-bottom: 8px; font-size: 10px; text-transform: uppercase; }
              .footer-col p, .footer-col ul { margin: 0; color: #4B5563; font-size: 9px; list-style: none; padding: 0; }

              .thank-you { text-align: right; margin-top: 20px; }
              .thank-you h2 { color: #3B82F6; font-family: 'Brush Script MT', cursive; font-size: 22px; margin: 0; }

              /* Force Single Page Print */
              @media print {
                  html, body { height: 99%; overflow: hidden; }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="company-info">
                      <h2>BizMate Solutions FZ-LLC</h2>
                      <p>Dubai Silicon Oasis, DDP, Building A2</p>
                      <p>Dubai, United Arab Emirates</p>
                      <p>VAT Registration No.: 100225344900003</p>
                  </div>
                  <div class="invoice-details">
                      <h1>TAX INVOICE</h1>
                      <div class="detail-row"><span class="detail-label">Invoice No:</span><span class="detail-value">${data.invoice_number}</span></div>
                      <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${data.invoice_date}</span></div>
                      <div class="detail-row"><span class="detail-label">Due Date:</span><span class="detail-value">${data.due_date}</span></div>

                      <div class="total-due-box">
                          <span>Total Due (BDT)</span>
                          <strong>${data.total}</strong>
                      </div>
                  </div>
              </div>

              <div class="info-section">
                  <div>
                      <div class="section-title">👤 BILL TO</div>
                      <strong>${data.customer_name}</strong><br>
                      ${data.customer_address}<br>
                      Email: ${data.customer_email}
                  </div>
                  <div>
                      <div class="section-title">📅 PAYMENT TERMS</div>
                      <div class="detail-row" style="justify-content: flex-start;"><span style="width: 80px;">Terms:</span><span>Net 45</span></div>
                      <div class="detail-row" style="justify-content: flex-start;"><span style="width: 80px;">Due:</span><span>${data.due_date}</span></div>
                  </div>
              </div>

              <table>
                  <thead>
                      <tr>
                          <th width="5%">#</th>
                          <th width="55%">Description</th>
                          <th width="10%" class="col-center">Qty</th>
                          <th width="15%" class="col-right">Unit Price</th>
                          <th width="15%" class="col-right">Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${(data.items || [])
                .map((item, index) => `
                          <tr>
                              <td class="col-center">${index + 1}</td>
                              <td>
                                  <strong>${item.name}</strong>
                                  <div class="item-desc">${item.description}</div>
                              </td>
                              <td class="col-center">${item.quantity}</td>
                              <td class="col-right">${item.price}</td>
                              <td class="col-right">${item.amount}</td>
                          </tr>
                      `)
                .join("")}
                  </tbody>
              </table>

              <div class="summary-container">
                  <div class="amount-words">
                      <p><strong>Amount in Words:</strong></p>
                      <small>Refer to total for final calculation</small>
                  </div>
                  <div class="totals-table">
                      <div class="total-line"><span>Subtotal</span><span>${data.subtotal}</span></div>
                      <div class="total-line"><span>VAT (5%)</span><span>${data.vat}</span></div>
                      <div class="total-line grand-total"><span>TOTAL DUE</span><span>${data.total} BDT</span></div>
                  </div>
              </div>

              <div class="footer-grid">
                  <div class="footer-col">
                      <h4>💳 Payment</h4>
                      <p>Bank Transfer<br>Credit / Debit Card</p>
                  </div>
                  <div class="footer-col">
                      <h4>🏛️ Bank</h4>
                      <p>Emirates NBD<br>A/C: BizMate Solutions<br>SWIFT: EBILA EAD</p>
                  </div>
                  <div class="footer-col">
                      <h4>📝 Notes</h4>
                      <p>• Computer generated.<br>• Please pay by due date.</p>
                  </div>
              </div>

              <div class="thank-you">
                  <h2>Thank You!</h2>
              </div>
          </div>
      </body>
      </html>`;
            await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
            await page.pdf({
                path: filePath,
                format: "A4",
                printBackground: true,
                margin: { top: "5mm", right: "5mm", bottom: "5mm", left: "5mm" },
            });
            return { success: true, message: "Invoice generated successfully" };
        }
        catch (error) {
            console.error("Invoice PDF Error:", error);
            throw new common_1.InternalServerErrorException(error.message);
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