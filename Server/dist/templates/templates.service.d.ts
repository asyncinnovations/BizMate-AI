import { Repository } from "typeorm";
import { TemplateEntity } from "./templates.entity";
export declare class TemplatesService {
    private templatesRepo;
    constructor(templatesRepo: Repository<TemplateEntity>);
    create_template_service(data: any): Promise<any>;
    get_all_template_service(): Promise<TemplateEntity[]>;
    single_template_service(id: string): Promise<any>;
    update_template_service(id: string, data: any): Promise<any>;
    user_template_service(user_id: string): Promise<any>;
    delete_template_service(id: string): Promise<any>;
}
