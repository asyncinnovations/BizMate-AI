import { Repository } from "typeorm";
import { TemplateFieldEntity } from "./template_field.entity";
import { TemplateEntity } from "../templates/templates.entity";
export declare class TemplateFieldService {
    private readonly templateFieldRepo;
    private readonly templateRepo;
    constructor(templateFieldRepo: Repository<TemplateFieldEntity>, templateRepo: Repository<TemplateEntity>);
    create_template_field_service(data: Partial<TemplateFieldEntity>): Promise<TemplateFieldEntity>;
    create_many_template_field_service(templateId: string, fields: Partial<TemplateFieldEntity>[]): Promise<TemplateFieldEntity[]>;
    field_by_templateId_service(templateId: string): Promise<TemplateFieldEntity[]>;
    single_template_field_service(tfield_id: string): Promise<TemplateFieldEntity>;
    update_template_field_service(tfield_id: string, data: Partial<TemplateFieldEntity>): Promise<TemplateFieldEntity>;
    bulk_update_template_field_service(templateId: string, data: Partial<TemplateFieldEntity>[]): Promise<void>;
    delete_template_field_service(tfield_id: string): Promise<void>;
    delete_field_by_template_service(templateId: string): Promise<void>;
    clone_field_one_to_another_service(fromTemplateId: string, toTemplateId: string): Promise<void>;
}
