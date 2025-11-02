"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const upload_decorator_1 = require("../common/decorators/upload.decorator");
const auth_service_1 = require("./auth.service");
const user_entity_1 = require("./user.entity");
const bcrypt = __importStar(require("bcrypt"));
const path_1 = require("path");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    validateSignup(body) {
        const errors = [];
        if (!body.full_name || typeof body.full_name !== "string") {
            errors.push("full_name is required and must be a string.");
        }
        if (!body.email || typeof body.email !== "string") {
            errors.push("email is required and must be a string.");
        }
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(body.email)) {
                errors.push("email is invalid.");
            }
        }
        if (!body.password || typeof body.password !== "string") {
            errors.push("password is required and must be a string.");
        }
        if (body.phone && typeof body.phone !== "string") {
            errors.push("phone must be a string if provided.");
        }
        if (body.company_name && typeof body.company_name !== "string") {
            errors.push("company_name must be a string if provided.");
        }
        if (body.license_number && typeof body.license_number !== "string") {
            errors.push("license_number must be a string if provided.");
        }
        if (body.vat_id && typeof body.vat_id !== "string") {
            errors.push("vat_id must be a string if provided.");
        }
        if (body.idustry && typeof body.idustry !== "string") {
            errors.push("idustry must be a string if provided.");
        }
        if (body.role && !Object.values(user_entity_1.UserRole).includes(body.role)) {
            errors.push(`role must be one of: ${Object.values(user_entity_1.UserRole).join(", ")}`);
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException({ message: "Validation failed", errors });
        }
    }
    validateLogin(body) {
        const errors = [];
        if (!body.email || typeof body.email !== "string") {
            errors.push("email is required and must be a string.");
        }
        if (!body.password || typeof body.password !== "string") {
            errors.push("password is required and must be a string.");
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException({ message: "Validation failed", errors });
        }
    }
    async signup(data, file) {
        const hashed = await bcrypt.hash(data.password, 10);
        const post_data = {
            email: data.email,
            password_hash: hashed,
            full_name: data.full_name,
            phone: data.phone,
            company_name: data.company_name,
            license_number: data.license_number,
            vat_id: data.vat_id,
            industry: data.industry,
            role: data.role,
            lichence_file: file?.originalname || data.lichence_file,
        };
        this.validateSignup(data);
        const response = await this.authService.signup_service(post_data);
        return { message: "registration success", response };
    }
    async login(body) {
        this.validateLogin(body);
        return this.authService.login_service(body.email, body.password);
    }
    async all_users() {
        const response = await this.authService.all_users_service();
        return response;
    }
    async single_user(user_id) {
        const response = await this.authService.single_user_service(user_id);
        return { message: "single user retrived", response };
    }
    async update_user(user_id, body) {
        const data = {
            full_name: body?.full_name,
            email: body?.email,
            phone: body?.phone,
            company_name: body?.company_name,
            license_number: body?.license_number,
            vat_id: body?.vat_id,
            industry: body?.industry,
            role: body?.role,
            status: body?.status,
        };
        const response = await this.authService.update_user_service(user_id, data);
        return { message: "account updated", response };
    }
    async update_profile_image(user_id, body, file) {
        const image = file?.originalname || body.profile_image;
        const response = await this.authService.update_profile_image_service(user_id, image);
        return { message: "profile image updated", response };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("/signup"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, upload_decorator_1.UploadFile)({
        fieldName: "license_file",
        destination: (0, path_1.join)(__dirname, "../../public/uploads"),
        maxCount: 1,
        multiple: false,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)("/login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)("/all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "all_users", null);
__decorate([
    (0, common_1.Get)("/single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "single_user", null);
__decorate([
    (0, common_1.Put)("/update/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "update_user", null);
__decorate([
    (0, common_1.Put)("/update_image/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, upload_decorator_1.UploadFile)({
        fieldName: "profile_image",
        destination: (0, path_1.join)(__dirname, "../../public/uploads"),
        maxCount: 1,
        multiple: false,
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "update_profile_image", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("/auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map