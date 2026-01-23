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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("./user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let AuthService = class AuthService {
    usersRepo;
    jwtService;
    constructor(usersRepo, jwtService) {
        this.usersRepo = usersRepo;
        this.jwtService = jwtService;
    }
    async signup_service(data) {
        const existing = await this.usersRepo.findOne({
            where: { email: data.email },
        });
        if (existing)
            throw new common_1.BadRequestException("Account Already Exists");
        const user = this.usersRepo.create(data);
        const users = await this.usersRepo.save(user);
        return {
            user_id: users?.uuid,
            id: users?.id,
            full_name: users?.full_name,
            email: users?.email,
            phone: users?.phone,
            lichence_file: users?.lichence_file,
            company_name: users?.company_name,
            license_number: users?.license_number,
            vat_id: users?.vat_id,
            industry: users?.industry,
            role: users?.role,
            language: users?.language_preference,
            status: users?.status,
            created_at: users?.created_at,
            updated_at: users?.updated_at,
        };
    }
    async login_service(email, password) {
        const user = await this.usersRepo.findOne({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException("Account Not Found");
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const token = this.jwtService.sign({
            email: user.email,
        });
        return {
            token,
            user: {
                user_id: user?.uuid,
                id: user?.id,
                full_name: user?.full_name,
                email: user?.email,
                phone: user?.phone,
                lichence_file: user?.lichence_file,
                company_name: user?.company_name,
                license_number: user?.license_number,
                vat_id: user?.vat_id,
                industry: user?.industry,
                role: user?.role,
                language: user?.language_preference,
                status: user?.status,
                created_at: user?.created_at,
                updated_at: user?.updated_at,
            },
        };
    }
    async all_users_service() {
        const users = await this.usersRepo.query(`SELECT email FROM users`);
        return {
            user_id: users?.uuid,
            id: users?.id,
            full_name: users?.full_name,
            email: users?.email,
            phone: users?.phone,
            lichence_file: users?.lichence_file,
            company_name: users?.company_name,
            license_number: users?.license_number,
            vat_id: users?.vat_id,
            industry: users?.industry,
            role: users?.role,
            language: users?.language_preference,
            status: users?.status,
            created_at: users?.created_at,
            updated_at: users?.updated_at,
        };
    }
    async single_user_service(user_id) {
        const users = await this.usersRepo.findOne({ where: { uuid: user_id } });
        return {
            user_id: users?.uuid,
            id: users?.id,
            full_name: users?.full_name,
            email: users?.email,
            phone: users?.phone,
            lichence_file: users?.lichence_file,
            company_name: users?.company_name,
            license_number: users?.license_number,
            vat_id: users?.vat_id,
            industry: users?.industry,
            role: users?.role,
            language: users?.language_preference,
            status: users?.status,
            created_at: users?.created_at,
            updated_at: users?.updated_at,
        };
    }
    async update_user_service(user_id, data) {
        const response = await this.usersRepo.update({ uuid: user_id }, data);
        return response;
    }
    async verify_email_service(user_id, email) {
        const response = await this.usersRepo.update({ uuid: user_id }, { email_verified: email ? true : false, email: email });
        return response.raw;
    }
    async reset_user_password_service(user_id, new_password) {
        const response = await this.usersRepo.update({ uuid: user_id }, { password_hash: new_password });
        return response;
    }
    async update_profile_image_service(user_id, newImage) {
        const user = await this.usersRepo.findOne({ where: { uuid: user_id } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        if (user.profile_image) {
            const filePath = path.join(__dirname, "../../public/uploads", user.profile_image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        user.profile_image = newImage;
        await this.usersRepo.save(user);
        return {
            message: "Profile image updated successfully",
            profile_image: newImage,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.AuthUsers)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map