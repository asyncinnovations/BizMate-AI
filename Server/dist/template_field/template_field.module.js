"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFieldModule = void 0;
const common_1 = require("@nestjs/common");
const template_field_service_1 = require("./template_field.service");
const template_field_controller_1 = require("./template_field.controller");
const template_field_entity_1 = require("./template_field.entity");
const templates_entity_1 = require("./../templates/templates.entity");
const typeorm_1 = require("@nestjs/typeorm");
let TemplateFieldModule = class TemplateFieldModule {
};
exports.TemplateFieldModule = TemplateFieldModule;
exports.TemplateFieldModule = TemplateFieldModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([template_field_entity_1.TemplateFieldEntity, templates_entity_1.TemplateEntity])],
        providers: [template_field_service_1.TemplateFieldService],
        controllers: [template_field_controller_1.TemplateFieldController],
        exports: [template_field_service_1.TemplateFieldService],
    })
], TemplateFieldModule);
//# sourceMappingURL=template_field.module.js.map