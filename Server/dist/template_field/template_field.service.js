"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFieldService = void 0;
const common_1 = require("@nestjs/common");
const templates_entity_1 = require("../templates/templates.entity");
const template_field_entity_1 = require("./template_field.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TemplateFieldService = class TemplateFieldService {
    templateFieldRepo;
    templateRepo;
    constructor(templateFieldRepo, templateRepo) {
        this.templateFieldRepo = templateFieldRepo;
        this.templateRepo = templateRepo;
    }
    async create_template_field_service(data) {
        const template_field = this.templateFieldRepo.create(data);
        return await this.templateFieldRepo.save(template_field);
    }
    async create_many_template_field_service(templateId, fields) {
        const template = await this.templateRepo.findOne({
            where: { uuid: templateId },
        });
        if (!template)
            throw new common_1.NotFoundException(`Template ${templateId} not found`);
        const fieldEntities = fields.map((field) => this.templateFieldRepo.create({
            ...field,
            template_id: templateId,
        }));
        return await this.templateFieldRepo.save(fieldEntities);
    }
    async field_by_templateId_service(templateId) {
        const sql = await this.templateFieldRepo.query(`SELECT tf.*,t.template_name FROM templates AS t JOIN template_fields as tf ON t.uuid=tf.template_id WHERE t.uuid=$1`, [templateId]);
        return sql;
    }
    async single_template_field_service(tfield_id) {
        const field = await this.templateFieldRepo.findOne({
            where: { uuid: tfield_id },
        });
        if (!field)
            throw new common_1.NotFoundException(`Field ${tfield_id} not found`);
        return field;
    }
    async update_template_field_service(tfield_id, data) {
        const field = await this.single_template_field_service(tfield_id);
        Object.assign(field, data);
        return await this.templateFieldRepo.save(field);
    }
    async bulk_update_template_field_service(templateId, data) {
        const fields = await this.field_by_templateId_service(templateId);
        console.log(fields);
        if (!fields.length)
            throw new common_1.NotFoundException("No fields found for this template");
        const updated = fields.map((field, i) => ({
            ...field,
            ...data[i],
        }));
        await this.templateFieldRepo.save(updated);
    }
    async delete_template_field_service(tfield_id) {
        const field = await this.single_template_field_service(tfield_id);
        await this.templateFieldRepo.remove(field);
    }
    async delete_field_by_template_service(templateId) {
        await this.templateFieldRepo.delete({ template_id: templateId });
    }
    async clone_field_one_to_another_service(fromTemplateId, toTemplateId) {
        const sourceFields = await this.field_by_templateId_service(fromTemplateId);
        if (!sourceFields.length)
            return;
        const cloned = sourceFields.map((field) => this.templateFieldRepo.create({
            template_id: toTemplateId,
            field_name: field.field_name,
            field_value: field.field_value,
            field_type: field.field_type,
            required: field.required,
        }));
        await this.templateFieldRepo.save(cloned);
    }
};
exports.TemplateFieldService = TemplateFieldService;
exports.TemplateFieldService = TemplateFieldService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(template_field_entity_1.TemplateFieldEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(templates_entity_1.TemplateEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TemplateFieldService);
//# sourceMappingURL=template_field.service.js.map