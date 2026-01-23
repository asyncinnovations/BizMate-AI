import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import * as fs from "fs";
import { PDFParse } from "pdf-parse";
@Injectable()
export class PdfService {
  ////////////////////////////////////////////////////////
  // GENERATE TEMPLATE PDF
  ////////////////////////////////////////////////////////
  // async TemplatePDFGenerator(data: any, filePath: string) {
  //   // Launch Puppeteer
  //   const browser = await puppeteer.launch({ headless: true });
  //   const page = await browser.newPage();

  //   // Build dynamic HTML from JSON
  //   let htmlContent = `
  //     <html>
  //       <head>
  //         <title>${data.template_name}</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; padding: 30px; }
  //           h1 { text-align: center; }
  //           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  //           td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
  //         </style>
  //       </head>
  //       <body>
  //         <h1>${data.template_name}</h1>
  //         <p>${data.description}</p>
  //         <table>
  //           <tbody>
  //   `;

  //   for (const key in data.fields_schema) {
  //     let value = data.fields_schema[key];

  //     if (Array.isArray(value)) {
  //       if (value.length > 0 && typeof value[0] === "object") {
  //         value = value.map((v) => v.name || JSON.stringify(v)).join(", ");
  //       } else {
  //         value = value.join(", ");
  //       }
  //     }

  //     htmlContent += `
  //       <tr>
  //         <th>${key}</th>
  //         <td>${value}</td>
  //       </tr>
  //     `;
  //   }

  //   htmlContent += `
  //           </tbody>
  //         </table>
  //       </body>
  //     </html>
  //   `;

  //   // Render HTML and generate PDF
  //   await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  //   await page.pdf({ path: filePath, format: "A4", printBackground: true });
  //   return { success: true, message: "PDF generated successfully" };
  //   await browser.close();
  // }
  async TemplatePDFGenerator(data: any, filePath: string) {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "shell",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      // Build dynamic HTML
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

      // Generate PDF with explicit A4 settings
      await page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true,
        displayHeaderFooter: false,
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      });

      return { success: true, message: "PDF generated successfully" };
    } catch (error) {
      console.error("PDF Generation Error:", error);
      return { success: false, message: error.message };
    } finally {
      // Close browser here so it runs even if an error occurs
      await browser.close();
    }
  }
  ////////////////////////////////////////////////////////
  // GENERATE INVOICE PDF
  ////////////////////////////////////////////////////////
  // async InvoicePDFGenerator(data: any, filePath: string) {
  //   // Launch Puppeteer
  //   const browser = await puppeteer.launch({ headless: true });
  //   const page = await browser.newPage();

  //   // Build dynamic HTML from JSON
  //   let htmlContent = `
  //     <html>
  //       <head>
  //         <title>${data.template_name}</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; padding: 30px; }
  //           h1 { text-align: center; }
  //           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  //           td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
  //         </style>
  //       </head>
  //       <body>
  //         <h1>${data.template_name}</h1>
  //         <p>${data.description}</p>
  //         <table>
  //           <tbody>
  //   `;

  //   for (const key in data.fields_schema) {
  //     let value = data.fields_schema[key];

  //     if (Array.isArray(value)) {
  //       if (value.length > 0 && typeof value[0] === "object") {
  //         value = value.map((v) => v.name || JSON.stringify(v)).join(", ");
  //       } else {
  //         value = value.join(", ");
  //       }
  //     }

  //     htmlContent += `
  //       <tr>
  //         <th>${key}</th>
  //         <td>${value}</td>
  //       </tr>
  //     `;
  //   }

  //   htmlContent += `
  //           </tbody>
  //         </table>
  //       </body>
  //     </html>
  //   `;

  //   // Render HTML and generate PDF
  //   await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  //   await page.pdf({ path: filePath, format: "A4", printBackground: true });
  //   return { success: true, message: "PDF generated successfully" };
  //   await browser.close();
  // }
  async InvoicePDFGenerator(data: any, filePath: string) {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "shell",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      // Build dynamic HTML with A4 Specific CSS
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

      // Process Schema Data
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

      // Set content and wait for it to load
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      // Export as A4 PDF
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
    } catch (error) {
      console.error("PDF Generation failed:", error);
      return { success: false, message: error.message };
    } finally {
      // This ensures the browser closes even if the code fails
      await browser.close();
    }
  }
  ////////////////////////////////////////////////////////
  // PDF COVNERT TO TEXT
  ////////////////////////////////////////////////////////
  async PDFToTextConverter(pdfPath: any) {
    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF file not found: " + pdfPath);
    }
    const parser = new PDFParse({ url: pdfPath });
    const result = await parser.getText();
    return result.text;
  }
}
