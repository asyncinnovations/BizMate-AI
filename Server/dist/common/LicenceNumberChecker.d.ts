export declare const LicenceNumberChecker: (file: any, licenseNumber: string) => Promise<{
    success: boolean;
    message: string;
    licenseExists?: undefined;
} | {
    success: boolean;
    licenseExists: boolean;
    message?: undefined;
}>;
