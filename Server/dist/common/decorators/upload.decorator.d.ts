interface UploadOptions {
    fieldName: string;
    destination?: string;
    multiple?: boolean;
    maxCount?: number;
}
export declare function UploadFile(options: UploadOptions): any;
export {};
