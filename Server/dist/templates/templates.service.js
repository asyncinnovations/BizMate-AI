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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const templates_entity_1 = require("./templates.entity");
let TemplatesService = class TemplatesService {
    templatesRepo;
    constructor(templatesRepo) {
        this.templatesRepo = templatesRepo;
    }
    async create_template_service(data) {
        const template = this.templatesRepo.create(data);
        return this.templatesRepo.save(template);
    }
    async get_all_template_service() {
        return this.templatesRepo.find();
    }
    async single_template_service(id) {
        return this.templatesRepo.findOneBy({ uuid: id });
    }
    async update_template_service(id, data) {
        await this.templatesRepo.update(id, data);
        return this.templatesRepo.findOneBy({ uuid: id });
    }
    async user_template_service(user_id) {
        return this.templatesRepo.findBy({ user_id: user_id });
    }
    async delete_template_service(id) {
        return this.templatesRepo.delete(id);
    }
    async get_templates_by_category_service(category) {
        return this.templatesRepo.find({
            where: { category: (0, typeorm_1.ILike)(`%${category}%`), is_active: true },
            order: { created_at: "ASC" },
        });
    }
    async get_templates_filtered_service(filters) {
        const where = { is_active: true };
        if (filters.category)
            where.category = (0, typeorm_1.ILike)(`%${filters.category}%`);
        if (filters.is_prebuilt !== undefined)
            where.is_prebuilt = filters.is_prebuilt;
        if (filters.search)
            where.template_name = (0, typeorm_1.ILike)(`%${filters.search}%`);
        return this.templatesRepo.find({ where, order: { created_at: "ASC" } });
    }
    async ai_generate_template_schema_service(prompt) {
        return { prompt };
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(templates_entity_1.TemplateEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_3.Repository !== "undefined" && typeorm_3.Repository) === "function" ? _a : Object])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map