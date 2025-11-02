import { Injectable } from "@nestjs/common";
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
}
