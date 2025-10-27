import { TemplateFieldService } from "./template_field.service";
import { TemplateFieldEntity } from "./template_field.entity";
export declare class TemplateFieldController {
    private readonly templateFieldService;
    constructor(templateFieldService: TemplateFieldService);
    create_template_field(body: Partial<TemplateFieldEntity>): Promise<TemplateFieldEntity>;
    create_many_template_fields(template_id: string, fields: Partial<TemplateFieldEntity>[]): Promise<TemplateFieldEntity[]>;
    get_fields_by_template(template_id: string): Promise<TemplateFieldEntity[]>;
    get_single_field(tfield_id: string): Promise<TemplateFieldEntity>;
    update_single_field(tfield_id: string, data: Partial<TemplateFieldEntity>): Promise<TemplateFieldEntity>;
    bulk_update_fields(template_id: string, updates: Partial<TemplateFieldEntity>[]): Promise<void>;
    delete_single_field(tfield_id: string): Promise<void>;
    delete_all_fields_of_template(template_id: string): Promise<void>;
    clone_fields(fromtfield_id: string, totfield_id: string): Promise<void>;
}
