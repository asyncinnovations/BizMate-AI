"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrebuiltTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const prebuilt_templates_service_1 = require("./prebuilt_templates.service");
const prebuilt_templates_controller_1 = require("./prebuilt_templates.controller");
let PrebuiltTemplatesModule = class PrebuiltTemplatesModule {
};
exports.PrebuiltTemplatesModule = PrebuiltTemplatesModule;
exports.PrebuiltTemplatesModule = PrebuiltTemplatesModule = __decorate([
    (0, common_1.Module)({
        providers: [prebuilt_templates_service_1.PrebuiltTemplatesService],
        controllers: [prebuilt_templates_controller_1.PrebuiltTemplatesController]
    })
], PrebuiltTemplatesModule);
//# sourceMappingURL=prebuilt_templates.module.js.map