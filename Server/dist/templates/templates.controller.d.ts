import { TemplatesService } from "./templates.service";
export declare class TemplatesController {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    createTemplate(data: any, req: any): Promise<{
        message: string;
        data: import("./templates.entity").TemplateEntity[];
    }>;
    get_all_template(): Promise<{
        message: string;
        status: number;
        data?: undefined;
    } | {
        message: string;
        data: import("./templates.entity").TemplateEntity[];
        status?: undefined;
    }>;
    single_template(id: string): Promise<{
        message: string;
        status: number;
        data?: undefined;
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
        data?: undefined;
    } | {
        message: string;
        data: import("./templates.entity").TemplateEntity[];
        status?: undefined;
    }>;
    delete_template(id: string): Promise<{
        message: string;
    }>;
}
