import { Repository } from "typeorm";
import { TemplateEntity } from "./templates.entity";
export declare class TemplatesService {
    private templatesRepo;
    constructor(templatesRepo: Repository<TemplateEntity>);
    create_template_service(data: any): Promise<TemplateEntity[]>;
    get_all_template_service(): Promise<TemplateEntity[]>;
    single_template_service(id: string): Promise<TemplateEntity | null>;
    update_template_service(id: string, data: any): Promise<TemplateEntity | null>;
    user_template_service(user_id: string): Promise<TemplateEntity[]>;
    delete_template_service(id: string): Promise<import("typeorm").DeleteResult>;
    get_templates_by_category_service(category: string): Promise<TemplateEntity[]>;
    get_templates_filtered_service(filters: {
        category?: string;
        is_prebuilt?: boolean;
        search?: string;
    }): Promise<TemplateEntity[]>;
    ai_generate_template_schema_service(prompt: string): Promise<{
        prompt: string;
    }>;
}
