interface UploadOptions {
    fieldName: string;
    destination?: string;
    multiple?: boolean;
    maxCount?: number;
}
export declare function UploadFile(options: UploadOptions): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export {};
