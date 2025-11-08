import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";

@Injectable()
export class PdfService {
  ////////////////////////////////////////////////////////
  // GENERATE TEMPLATE PDF
  ////////////////////////////////////////////////////////
  async TemplatePDFGenerator(data: any, filePath: string) {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Build dynamic HTML from JSON
    let htmlContent = `
      <html>
        <head>
          <title>${data.template_name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
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
        if (value.length > 0 && typeof value[0] === "object") {
          value = value.map((v) => v.name || JSON.stringify(v)).join(", ");
        } else {
          value = value.join(", ");
        }
      }

      htmlContent += `
        <tr>
          <th>${key}</th>
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

    // Render HTML and generate PDF
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "A4", printBackground: true });
    return { success: true, message: "PDF generated successfully" };
    await browser.close();
  }

  ////////////////////////////////////////////////////////
  // GENERATE INVOICE PDF
  ////////////////////////////////////////////////////////
  async InvoicePDFGenerator(data: any, filePath: string) {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Build dynamic HTML from JSON
    let htmlContent = `
      <html>
        <head>
          <title>${data.template_name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
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
        if (value.length > 0 && typeof value[0] === "object") {
          value = value.map((v) => v.name || JSON.stringify(v)).join(", ");
        } else {
          value = value.join(", ");
        }
      }

      htmlContent += `
        <tr>
          <th>${key}</th>
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

    // Render HTML and generate PDF
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "A4", printBackground: true });
    return { success: true, message: "PDF generated successfully" };
    await browser.close();
  }
}
