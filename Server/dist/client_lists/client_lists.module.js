"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientListsModule = void 0;
const common_1 = require("@nestjs/common");
const client_lists_service_1 = require("./client_lists.service");
const client_lists_controller_1 = require("./client_lists.controller");
const typeorm_1 = require("@nestjs/typeorm");
const client_lists_entity_1 = require("./client_lists.entity");
let ClientListsModule = class ClientListsModule {
};
exports.ClientListsModule = ClientListsModule;
exports.ClientListsModule = ClientListsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([client_lists_entity_1.ClientList])],
        providers: [client_lists_service_1.ClientListsService],
        controllers: [client_lists_controller_1.ClientListsController],
        exports: [client_lists_service_1.ClientListsService],
    })
], ClientListsModule);
//# sourceMappingURL=client_lists.module.js.map