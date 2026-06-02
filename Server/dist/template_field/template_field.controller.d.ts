import { TemplateFieldService } from "./template_field.service";
import { TemplateFieldEntity } from "./template_field.entity";
export declare class TemplateFieldController {
    private readonly templateFieldService;
    constructor(templateFieldService: TemplateFieldService);
    private validateTemplateField;
    create_template_field(body: Partial<TemplateFieldEntity>): Promise<{
        message: string;
        response: any;
    }>;
    create_many_template_fields(template_id: string, fields: Partial<TemplateFieldEntity>[]): Promise<{
        message: string;
        response: TemplateFieldEntity[];
    }>;
    get_fields_by_template(template_id: string): Promise<{
        message: string;
        response: TemplateFieldEntity[];
    }>;
    get_single_field(tfield_id: string): Promise<{
        message: string;
        response: TemplateFieldEntity;
    }>;
    update_single_field(tfield_id: string, data: Partial<TemplateFieldEntity>): Promise<{
        message: string;
        response: TemplateFieldEntity;
    }>;
    bulk_update_template_field(template_id: string, data: any[]): Promise<{
        message: string;
        success: boolean;
        data: void;
    }>;
    delete_single_field(tfield_id: string): Promise<{
        message: string;
        response: void;
    }>;
    delete_all_fields_of_template(template_id: string): Promise<{
        message: string;
        response: void;
    }>;
    clone_fields(fromtfield_id: string, totfield_id: string): Promise<{
        message: string;
        response: void;
    }>;
}
