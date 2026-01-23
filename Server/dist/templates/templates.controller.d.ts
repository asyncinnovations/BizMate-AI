import { TemplatesService } from "./templates.service";
import { PdfService } from "src/services/PdfService";
import { EmailService } from "src/services/EmailService";
export declare class TemplatesController {
    private readonly templatesService;
    private readonly pdfService;
    private readonly emailService;
    constructor(templatesService: TemplatesService, pdfService: PdfService, emailService: EmailService);
    createTemplate(data: any, req: any): Promise<{
        message: string;
        data: import("./templates.entity").TemplateEntity[];
    }>;
    get_all_template(): Promise<{
        message: string;
        status: number;
        data: never[];
    } | {
        message: string;
        data: import("./templates.entity").TemplateEntity[];
        status?: undefined;
    }>;
    single_template(id: string): Promise<{
        message: string;
        status: number;
        data: never[];
    } | {
        message: string;
        data: import("./templates.entity").TemplateEntity;
        status?: undefined;
    }>;
    update_template(id: string, data: any): Promise<{
        message: string;
        data: import("./templates.entity").TemplateEntity | null;
    }>;
    user_template(user_id: string): Promise<{
        message: string;
        status: number;
        data: never[];
    } | {
        message: string;
        data: import("./templates.entity").TemplateEntity[];
        status?: undefined;
    }>;
    preview_document(body: any): Promise<{
        response: any;
        success: boolean;
        url: string;
    }>;
    delete_template(id: string): Promise<{
        message: string;
    }>;
    send_template_to_email(body: any): Promise<{
        message: string;
        response: {
            success: boolean;
            response: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            response?: undefined;
        };
    }>;
}
