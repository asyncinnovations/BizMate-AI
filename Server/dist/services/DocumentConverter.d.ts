export declare class DocumentConverter {
    constructor();
    convertToText(buffer: Buffer, mimetype: string): Promise<string>;
    parseStructuredData(rawText: string): Promise<any>;
    convertDocument(file: Buffer, mimetype: string): Promise<{
        rawText: string;
    }>;
}
