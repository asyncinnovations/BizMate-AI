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
const auth_guard_1 = require("../guards/auth/auth.guard");
let TemplateFieldController = class TemplateFieldController {
    templateFieldService;
    constructor(templateFieldService) {
        this.templateFieldService = templateFieldService;
    }
    validateTemplateField(data) {
        const errors = [];
        if (!data.template_id)
            errors.push("template_id is required.");
        else if (!/^[0-9a-fA-F-]{36}$/.test(data.template_id))
            errors.push("template_id must be a valid UUID.");
        if (!data.field_name || data.field_name.trim() === "")
            errors.push("field_name is required.");
        else if (data.field_name.length > 100)
            errors.push("field_name must be less than or equal to 100 characters.");
        if (data.field_type && data.field_type.length > 255)
            errors.push("field_type must be less than or equal to 255 characters.");
        if (data.required !== undefined && typeof data.required !== "boolean") {
            errors.push("required must be a boolean value (true or false).");
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException({
                message: "Validation failed",
                errors,
            });
        }
    }
    async create_template_field(body) {
        this.validateTemplateField(body);
        const data = {
            template_id: body.template_id,
            field_name: body.field_name?.trim(),
            field_value: body.field_value || null,
            field_type: body.field_type || null,
            required: body.required ?? false,
        };
        const response = await this.templateFieldService.create_template_field_service(data);
        return { message: "Template field created successfully", response };
    }
    async create_many_template_fields(template_id, fields) {
        if (!Array.isArray(fields) || fields.length === 0)
            throw new common_1.BadRequestException("Fields array cannot be empty.");
        for (const field of fields) {
            this.validateTemplateField({ ...field, template_id });
        }
        const response = await this.templateFieldService.create_many_template_field_service(template_id, fields);
        return { message: "Bulk fields created successfully", response };
    }
    async get_fields_by_template(template_id) {
        const response = await this.templateFieldService.field_by_templateId_service(template_id);
        return { message: "Template fields retrieved successfully", response };
    }
    async get_single_field(tfield_id) {
        const response = await this.templateFieldService.single_template_field_service(tfield_id);
        return {
            message: "Single template field retrieved successfully",
            response,
        };
    }
    async update_single_field(tfield_id, data) {
        this.validateTemplateField(data);
        const response = await this.templateFieldService.update_template_field_service(tfield_id, data);
        return { message: "Template field updated successfully", response };
    }
    async delete_single_field(tfield_id) {
        const response = await this.templateFieldService.delete_template_field_service(tfield_id);
        return { message: "Template field deleted successfully", response };
    }
    async delete_all_fields_of_template(template_id) {
        const response = await this.templateFieldService.delete_field_by_template_service(template_id);
        return { message: "All template fields deleted successfully", response };
    }
    async clone_fields(fromtfield_id, totfield_id) {
        const response = await this.templateFieldService.clone_field_one_to_another_service(fromtfield_id, totfield_id);
        return { message: "Template fields cloned successfully", response };
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
    (0, common_1.Delete)("delete/:tfield_id"),
    __param(0, (0, common_1.Param)("tfield_id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateFieldController.prototype, "delete_single_field", null);
__decorate([
    (0, common_1.Delete)("/delete/template/:template_id"),
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
    (0, common_1.UseGuards)(auth_guard_1.JwtGuard),
    __metadata("design:paramtypes", [template_field_service_1.TemplateFieldService])
], TemplateFieldController);
//# sourceMappingURL=template_field.controller.js.map