import { Injectable } from "@nestjs/common";
import { ILike } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TemplateEntity } from "./templates.entity";

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateEntity)
    private templatesRepo: Repository<TemplateEntity>
  ) {}

  ////////////////////////////////////////////////////////////////
  // CREATE TEMPLATE
  ////////////////////////////////////////////////////////////////
  async create_template_service(data: any) {
    const template = this.templatesRepo.create(data);
    return this.templatesRepo.save(template);
  }

  ///////////////////////////////////////////////////
  // GET ALL TEMPLATES
  ///////////////////////////////////////////////////
  async get_all_template_service(): Promise<TemplateEntity[]> {
    return this.templatesRepo.find();
  }

  //////////////////////////////////////////////////
  // GET SINGLE TEMPLATE
  //////////////////////////////////////////////////
  async single_template_service(id: string) {
    return this.templatesRepo.findOneBy({ uuid: id });
  }

  ///////////////////////////////////////////////////
  // UPDATE TEMPLATE
  ///////////////////////////////////////////////////
  async update_template_service(id: string, data: any) {
    await this.templatesRepo.update(id, data);
    return this.templatesRepo.findOneBy({ uuid: id });
  }

  /////////////////////////////////////////////////////////
  // GET TEMPLATES BY USER
  /////////////////////////////////////////////////////////
  async user_template_service(user_id: string) {
    return this.templatesRepo.findBy({ user_id: user_id });
  }

  /////////////////////////////////////////////////////
  // DELETE TEMPLATE
  /////////////////////////////////////////////////////
  async delete_template_service(id: string) {
    return this.templatesRepo.delete(id);
  }
  ///////////////////////////////////////////////////
  // GET TEMPLATES BY CATEGORY
  ///////////////////////////////////////////////////
  async get_templates_by_category_service(category: string): Promise<TemplateEntity[]> {
    return this.templatesRepo.find({
      where: { category: ILike(`%${category}%`), is_active: true },
      order: { created_at: "ASC" },
    });
  }

  ///////////////////////////////////////////////////
  // GET ALL ACTIVE TEMPLATES WITH OPTIONAL CATEGORY FILTER
  ///////////////////////////////////////////////////
  async get_templates_filtered_service(filters: {
    category?:   string;
    is_prebuilt?: boolean;
    search?:     string;
  }): Promise<TemplateEntity[]> {
    const where: any = { is_active: true };
    if (filters.category)                 where.category    = ILike(`%${filters.category}%`);
    if (filters.is_prebuilt !== undefined) where.is_prebuilt = filters.is_prebuilt;
    if (filters.search)                   where.template_name = ILike(`%${filters.search}%`);
    return this.templatesRepo.find({ where, order: { created_at: "ASC" } });
  }

  ///////////////////////////////////////////////////
  // AI GENERATE TEMPLATE FIELDS FROM PROMPT
  // Returns field schema — caller saves via create_template_service
  ///////////////////////////////////////////////////
  async ai_generate_template_schema_service(prompt: string) {
    // This is called by the controller which injects GPTService and PromptService.
    // Service layer just passes through — actual AI call is in the controller
    // to keep the service focused on data access only.
    return { prompt }; // placeholder — handled in controller
  }

}
