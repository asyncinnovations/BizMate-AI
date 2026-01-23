export declare class PdfService {
    TemplatePDFGenerator(data: any, filePath: string): Promise<{
        success: boolean;
        message: any;
    }>;
    InvoicePDFGenerator(data: any, filePath: string): Promise<{
        success: boolean;
        message: any;
    }>;
    PDFToTextConverter(pdfPath: any): Promise<string>;
}
