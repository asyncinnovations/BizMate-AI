import { TemplatesService } from "./templates.service";
import { PdfService } from "src/services/PdfService";
import { GPTService } from "src/services/GPTService";
import { PromptService } from "src/services/PromptService";
import { EmailService } from "src/services/EmailService";
export declare class TemplatesController {
    private readonly templatesService;
    private readonly pdfService;
    private readonly emailService;
    private readonly gptService;
    private readonly promptService;
    constructor(templatesService: TemplatesService, pdfService: PdfService, emailService: EmailService, gptService: GPTService, promptService: PromptService);
    createTemplate(data: any, req: any): Promise<{
        message: string;
        data: any;
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
        data: any;
        status?: undefined;
    }>;
    update_template(id: string, data: any): Promise<{
        message: string;
        data: any;
    }>;
    user_template(user_id: string): Promise<{
        message: string;
        status: number;
        data: never[];
    } | {
        message: string;
        data: any;
        status?: undefined;
    }>;
    preview_document(body: any): Promise<{
        response: string;
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
    get_templates_filtered(category?: string, is_prebuilt?: string, search?: string): Promise<{
        message: string;
        data: import("./templates.entity").TemplateEntity[];
    }>;
    ai_generate_template(body: any, req: any): Promise<{
        message: string;
        template: any;
        fields: any[];
    }>;
}
