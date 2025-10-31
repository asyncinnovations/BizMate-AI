import { Injectable, NotFoundException } from "@nestjs/common";
import { TemplateEntity } from "../templates/templates.entity";
import { TemplateFieldEntity } from "./template_field.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TemplateFieldService {
  constructor(
    @InjectRepository(TemplateFieldEntity)
    private readonly templateFieldRepo: Repository<TemplateFieldEntity>,
    @InjectRepository(TemplateEntity)
    private readonly templateRepo: Repository<TemplateEntity>
  ) {}

  //////////////////////////////////////////////////////////////////////
  // CREATE TEMPLATE FIELDS
  //////////////////////////////////////////////////////////////////////
  async create_template_field_service(data: Partial<TemplateFieldEntity>) {
    const template_field = this.templateFieldRepo.create(data);
    return await this.templateFieldRepo.save(template_field);
  }

  //////////////////////////////////////////////////////////////////////
  // CREATE BULK TEMPLATE FIELDS
  //////////////////////////////////////////////////////////////////////
  async create_many_template_field_service(
    templateId: string,
    fields: Partial<TemplateFieldEntity>[]
  ): Promise<TemplateFieldEntity[]> {
    const template = await this.templateRepo.findOne({
      where: { uuid: templateId },
    });
    if (!template)
      throw new NotFoundException(`Template ${templateId} not found`);

    const fieldEntities = fields.map((field) =>
      this.templateFieldRepo.create({
        ...field,
        template_id: templateId,
      })
    );

    return await this.templateFieldRepo.save(fieldEntities);
  }

  //////////////////////////////////////////////////////////////////////
  // ALL FIELD BY TEMPLATE ID
  //////////////////////////////////////////////////////////////////////
  async field_by_templateId_service(
    templateId: string
  ): Promise<TemplateFieldEntity[]> {
    const sql = await this.templateFieldRepo.query(
      `SELECT tf.*,t.template_name FROM templates AS t JOIN template_fields as tf ON t.uuid=tf.template_id WHERE t.uuid=$1`,
      [templateId]
    );
    return sql;
    // return await this.templateFieldRepo.find({
    //   where: { template_id: templateId },
    //   order: { created_at: "ASC" },
    // });
  }

  //////////////////////////////////////////////////////////////////////
  // SINGLE TEMPLATE FIELD BY ID
  //////////////////////////////////////////////////////////////////////
  async single_template_field_service(
    tfield_id: string
  ): Promise<TemplateFieldEntity> {
    const field = await this.templateFieldRepo.findOne({
      where: { uuid: tfield_id },
    });
    if (!field) throw new NotFoundException(`Field ${tfield_id} not found`);
    return field;
  }

  //////////////////////////////////////////////////////////////////////
  // UPDATE TEMPLATE FIELD BY ID
  //////////////////////////////////////////////////////////////////////
  async update_template_field_service(
    tfield_id: string,
    data: Partial<TemplateFieldEntity>
  ): Promise<TemplateFieldEntity> {
    const field = await this.single_template_field_service(tfield_id);
    Object.assign(field, data);
    return await this.templateFieldRepo.save(field);
  }

  //////////////////////////////////////////////////////////////////////
  // BULK UPDATE TEMPLATE FIELD BY ID
  //////////////////////////////////////////////////////////////////////
  async bulk_update_template_field_service(
    templateId: string,
    data: Partial<TemplateFieldEntity>[]
  ) {
    const fields = await this.field_by_templateId_service(templateId);
    if (!fields.length)
      throw new NotFoundException("No fields found for this template");
    const updated = fields.map((field, i) => ({
      ...field,
      ...data[i],
    }));

    await this.templateFieldRepo.save(updated);
  }

  //////////////////////////////////////////////////////////////////////
  // DELETE TEMPLATE FIELD BY ID
  //////////////////////////////////////////////////////////////////////
  async delete_template_field_service(tfield_id: string): Promise<void> {
    const field = await this.single_template_field_service(tfield_id);
    await this.templateFieldRepo.remove(field);
  }

  //////////////////////////////////////////////////////////////////////
  // DELETE ALL TEMPLATE FIELD BY ID
  //////////////////////////////////////////////////////////////////////
  async delete_field_by_template_service(templateId: string): Promise<void> {
    await this.templateFieldRepo.delete({ template_id: templateId });
  }

  //////////////////////////////////////////////////////////////////////
  // DELETE ALL TEMPLATE FIELD BY ID
  //////////////////////////////////////////////////////////////////////
  async clone_field_one_to_another_service(
    fromTemplateId: string,
    toTemplateId: string
  ) {
    const sourceFields = await this.field_by_templateId_service(fromTemplateId);
    if (!sourceFields.length) return;

    const cloned = sourceFields.map((field) =>
      this.templateFieldRepo.create({
        template_id: toTemplateId,
        field_name: field.field_name,
        field_value: field.field_value,
        field_type: field.field_type,
        required: field.required,
      })
    );

    await this.templateFieldRepo.save(cloned);
  }
}
