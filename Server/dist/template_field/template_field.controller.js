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
exports.TemplateFieldController = void 0;
const common_1 = require("@nestjs/common");
const template_field_service_1 = require("./template_field.service");
let TemplateFieldController = class TemplateFieldController {
    templateFieldService;
    constructor(templateFieldService) {
        this.templateFieldService = templateFieldService;
    }
    async create_template_field(body) {
        return await this.templateFieldService.create_template_field_service(body);
    }
    async create_many_template_fields(template_id, fields) {
        return await this.templateFieldService.create_many_template_field_service(template_id, fields);
    }
    async get_fields_by_template(template_id) {
        return await this.templateFieldService.field_by_templateId_service(template_id);
    }
    async get_single_field(tfield_id) {
        return await this.templateFieldService.single_template_field_service(tfield_id);
    }
    async update_single_field(tfield_id, data) {
        return await this.templateFieldService.update_template_field_service(tfield_id, data);
    }
    async bulk_update_fields(template_id, updates) {
        return await this.templateFieldService.bulk_update_template_field_service(template_id, updates);
    }
    async delete_single_field(tfield_id) {
        await this.templateFieldService.delete_template_field_service(tfield_id);
    }
    async delete_all_fields_of_template(template_id) {
        await this.templateFieldService.delete_field_by_template_service(template_id);
    }
    async clone_fields(fromtfield_id, totfield_id) {
        return await this.templateFieldService.clone_field_one_to_another_service(fromtfield_id, totfield_id);
    }
};
exports.TemplateFieldController = TemplateFieldController;
__decorate([
    (0, common_1.Post)("/create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "create_template_field", null);
__decorate([
    (0, common_1.Post)("bulk/:template_id"),
    __param(0, (0, common_1.Param)("template_id", new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "create_many_template_fields", null);
__decorate([
    (0, common_1.Get)("template/:template_id"),
    __param(0, (0, common_1.Param)("template_id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "get_fields_by_template", null);
__decorate([
    (0, common_1.Get)("/single/:tfield_id"),
    __param(0, (0, common_1.Param)("tfield_id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "get_single_field", null);
__decorate([
    (0, common_1.Patch)("update/:tfield_id"),
    __param(0, (0, common_1.Param)("tfield_id", new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "update_single_field", null);
__decorate([
    (0, common_1.Patch)("bulk_update/:template_id"),
    __param(0, (0, common_1.Param)("template_id", new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "bulk_update_fields", null);
__decorate([
    (0, common_1.Delete)("delete/:tfield_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("tfield_id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "delete_single_field", null);
__decorate([
    (0, common_1.Delete)("template/:template_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("template_id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "delete_all_fields_of_template", null);
__decorate([
    (0, common_1.Post)("clone/:fromtfield_id/:totfield_id"),
    __param(0, (0, common_1.Param)("fromtfield_id", new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)("totfield_id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "clone_fields", null);
exports.TemplateFieldController = TemplateFieldController = __decorate([
    (0, common_1.Controller)("template_field"),
    __metadata("design:paramtypes", [template_field_service_1.TemplateFieldService])
], TemplateFieldController);
//# sourceMappingURL=template_field.controller.js.map