import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import * as fs from "fs";
import { PDFParse } from "pdf-parse";

@Injectable()
export class PdfService {
  //============================
  // LAUNCH BROWSER
  //============================
  private async launchBrowser() {
    return await puppeteer.launch({
      headless: true, // Use true for production, "shell" for newer versions
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
  }

  //============================
  // TEMPLATE PDF GENERATOR
  //============================
  async TemplatePDFGenerator(
    data: any,
    filePath: string,
  ): Promise<{ success: boolean; message: string }> {
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
                            .map((v: any) =>
                              typeof v === "object"
                                ? v.name || JSON.stringify(v)
                                : v,
                            )
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
    } catch (error: any) {
      console.error("Template PDF Generation Error:", error);
      throw new InternalServerErrorException(
        `Failed to generate PDF: ${error.message}`,
      );
    } finally {
      await browser.close();
    }
  }

  //============================
  // INVOICE GENERATOR
  //============================
  async InvoicePDFGenerator(
    data: any,
    filePath: string,
  ): Promise<{ success: boolean; message: string }> {
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
                        .map(
                          (item: any, index: number) => `
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
                      `,
                        )
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

//      const htmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <script src="https://cdn.tailwindcss.com"></script>
//     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
//     <style>
//         body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
//         @page { size: A4; margin: 0; }
//     </style>
// </head>
// <body class="bg-gray-50 antialiased text-slate-800">
//     <div class="max-w-[850px] mx-auto bg-white min-h-screen shadow-sm print:shadow-none overflow-hidden border-x border-gray-100">
        
//         <!-- Brand Header Bar -->
//         <div class="h-1.5 bg-gradient-to-r from-[#1F6B2E] to-[#4CAF50]"></div>

//         <div class="p-10">
//             <!-- Header Section -->
//             <div class="flex justify-between items-start mb-12">
//                 <div>
//                     <h2 class="text-2xl font-bold text-[#1F6B2E] tracking-tight mb-1">BizMate Solutions FZ-LLC</h2>
//                     <div class="text-slate-500 text-sm space-y-0.5">
//                         <p>Dubai Silicon Oasis, DDP, Building A2</p>
//                         <p>Dubai, United Arab Emirates</p>
//                         <p class="font-medium text-slate-700 pt-1">VAT No: 100225344900003</p>
//                     </div>
//                 </div>

//                 <div class="text-right">
//                     <h1 class="text-4xl font-black text-slate-200 uppercase tracking-tighter mb-4">Invoice</h1>
//                     <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-right">
//                         <span class="font-semibold text-slate-400 uppercase text-[10px] tracking-wider self-center">Invoice Number</span>
//                         <span class="font-bold text-slate-900">${invoice.invoice_number}</span>
                        
//                         <span class="font-semibold text-slate-400 uppercase text-[10px] tracking-wider self-center">Date Issued</span>
//                         <span class="text-slate-700 font-medium">${new Date(invoice.invoice_date).toLocaleDateString()}</span>
                        
//                         <span class="font-semibold text-slate-400 uppercase text-[10px] tracking-wider self-center">Due Date</span>
//                         <span class="text-red-600 font-bold">${new Date(invoice.due_date).toLocaleDateString()}</span>
//                     </div>
//                 </div>
//             </div>

//             <!-- Client Grid -->
//             <div class="grid grid-cols-2 gap-12 mb-12 py-8 border-y border-slate-100">
//                 <div>
//                     <h3 class="text-[10px] font-bold text-[#1F6B2E] uppercase tracking-[0.2em] mb-3">Billing From</h3>
//                     <div class="font-bold text-slate-900 text-lg">Al Halal Innovation</div>
//                     <p class="text-slate-500 text-sm mt-1">Tech Solutions & Software Engineering</p>
//                     <p class="text-slate-400 text-xs mt-2 italic">support@alhalalinnovation.com</p>
//                 </div>

//                 <div>
//                     <h3 class="text-[10px] font-bold text-[#1F6B2E] uppercase tracking-[0.2em] mb-3">Billing To</h3>
//                     <div class="font-bold text-slate-900 text-lg">${invoice.customer_name}</div>
//                     <div class="text-slate-500 text-sm mt-1 whitespace-pre-line leading-relaxed">
//                         ${invoice.customer_address || 'No address provided'}
//                     </div>
//                     <div class="text-[#1F6B2E] text-sm mt-2 font-medium underline underline-offset-4 decoration-slate-200 uppercase tracking-tight text-[11px]">
//                         ${invoice.customer_email || ''}
//                     </div>
//                 </div>
//             </div>

//             <!-- Items Table -->
//             <div class="mb-10 rounded-xl border border-slate-100 overflow-hidden shadow-sm">
//                 <table class="w-full text-left">
//                     <thead class="bg-slate-50 border-b border-slate-100">
//                         <tr>
//                             <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-12">#</th>
//                             <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
//                             <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Qty</th>
//                             <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
//                             <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
//                         </tr>
//                     </thead>
//                     <tbody class="divide-y divide-slate-50">
//                         ${invoice.items.map((item, index) => `
//                         <tr>
//                             <td class="px-6 py-5 text-sm font-mono text-slate-300">${String(index + 1).padStart(2, '0')}</td>
//                             <td class="px-6 py-5">
//                                 <div class="font-bold text-slate-800">${item.name}</div>
//                                 <div class="text-xs text-slate-400 mt-1 leading-relaxed">${item.description || ''}</div>
//                             </td>
//                             <td class="px-6 py-5 text-sm text-slate-600 text-center font-medium">${item.quantity}</td>
//                             <td class="px-6 py-5 text-sm text-slate-600 text-right font-mono">${item.price.toLocaleString()}</td>
//                             <td class="px-6 py-5 text-sm font-bold text-slate-900 text-right font-mono">${item.amount.toLocaleString()}</td>
//                         </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>

//             <!-- Summary Section -->
//             <div class="flex justify-end mb-16">
//                 <div class="w-72 space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
//                     <div class="flex justify-between text-sm">
//                         <span class="text-slate-400 font-medium">Subtotal</span>
//                         <span class="text-slate-700 font-bold">${invoice.subtotal.toLocaleString()}</span>
//                     </div>
//                     <div class="flex justify-between text-sm">
//                         <span class="text-slate-400 font-medium">VAT (5%)</span>
//                         <span class="text-slate-700 font-bold">${invoice.vat.toLocaleString()}</span>
//                     </div>
//                     <div class="pt-3 border-t border-slate-200 flex justify-between items-center">
//                         <span class="text-xs font-black text-slate-900 uppercase">Total Due</span>
//                         <span class="text-2xl font-black text-[#1F6B2E] tracking-tighter">${invoice.total.toLocaleString()} <span class="text-[10px] font-normal text-slate-400">AED</span></span>
//                     </div>
//                 </div>
//             </div>

//             <!-- Bottom Grid: Payment & Notes -->
//             <div class="grid grid-cols-2 gap-12 pt-10 border-t border-slate-100">
//                 <div>
//                     <h4 class="text-[10px] font-bold text-[#1F6B2E] uppercase tracking-widest mb-4">Payment Instructions</h4>
//                     <div class="bg-blue-50/40 border border-blue-100/50 p-4 rounded-lg">
//                         <p class="text-xs text-slate-600 leading-loose">
//                             <span class="font-bold text-blue-900">Emirates NBD</span><br />
//                             <span class="text-slate-400">Account:</span> Business Solutions Inc.<br />
//                             <span class="text-slate-400">IBAN:</span> AE070331234567890123456<br />
//                             <span class="text-slate-400">Reference:</span> <span class="font-mono text-blue-800">${invoice.invoice_number}</span>
//                         </p>
//                     </div>
//                 </div>

//                 <div>
//                     <h4 class="text-[10px] font-bold text-[#1F6B2E] uppercase tracking-widest mb-4">Important Notes</h4>
//                     <p class="text-xs text-slate-500 leading-relaxed italic">
//                         ${invoice.notes || 'Please ensure payment is made within the due date to avoid service interruption. Thank you for choosing Al Halal Innovation.'}
//                     </p>
//                 </div>
//             </div>

//             <!-- Footer Message -->
//             <div class="mt-20 text-center">
//                 <p class="text-[10px] text-slate-300 uppercase tracking-[0.4em] font-medium">Thank You for Your Business</p>
//                 <p class="text-[9px] text-slate-300 mt-2 italic">Generated by Nogorsheba Ecosystem</p>
//             </div>
//         </div>
//     </div>
// </body>
// </html>
// `;

      await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

      await page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true,
        // Adding tiny margins at the Puppeteer level prevents content from clipping
        margin: { top: "5mm", right: "5mm", bottom: "5mm", left: "5mm" },
      });

      return { success: true, message: "Invoice generated successfully" };
    } catch (error: any) {
      console.error("Invoice PDF Error:", error);
      throw new InternalServerErrorException(error.message);
    } finally {
      await browser.close();
    }
  }

  //============================
  // PDF COVNERT TO TEXT
  //============================
  async PDFToTextConverter(pdfPath: any) {
    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF file not found: " + pdfPath);
    }
    const parser = new PDFParse({ url: pdfPath });
    const result = await parser.getText();
    return result.text;
  }
}
