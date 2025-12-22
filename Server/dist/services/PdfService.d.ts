export declare class PdfService {
    TemplatePDFGenerator(data: any, filePath: string): Promise<{
        success: boolean;
        message: string;
    }>;
    InvoicePDFGenerator(data: any, filePath: string): Promise<{
        success: boolean;
        message: string;
    }>;
    PDFToTextConverter(pdfPath: any): Promise<string>;
}
