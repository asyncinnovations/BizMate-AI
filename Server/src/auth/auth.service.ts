import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { AuthUsers } from "./user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUsers)
    private usersRepo: Repository<AuthUsers>,
    private jwtService: JwtService
  ) {}

  //////////////////////////////////////////////////////
  // CREATE ACCOUNT
  //////////////////////////////////////////////////////
  async signup_service(data: any) {
    const existing = await this.usersRepo.findOne({
      where: { email: data.email },
    });
    if (existing) throw new BadRequestException("Account Already Exists");
    const user = this.usersRepo.create(data);
    const users: any = await this.usersRepo.save(user);
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

  //////////////////////////////////////////////////////
  // LOGIN USER TO THE ACCOUNT
  //////////////////////////////////////////////////////
  async login_service(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException("Account Not Found");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException("Invalid credentials");

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

  //////////////////////////////////////////////////////
  // GET ALL USERS
  //////////////////////////////////////////////////////
  async all_users_service() {
    // const users = await this.usersRepo.find({ select: ["id", "email"] });
    // if (!users) throw new UnauthorizedException("Invalid credentials");
    // return users;
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

  //////////////////////////////////////////////////////
  // GET SINGLE USER
  //////////////////////////////////////////////////////
  async single_user_service(user_id: string) {
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

  //////////////////////////////////////////////////////
  // UPDATE USER BY USER_ID
  //////////////////////////////////////////////////////
  async update_user_service(user_id: any, data: any) {
    const response = await this.usersRepo.update({ uuid: user_id }, data);
    return response;
  }

  //////////////////////////////////////////////////////
  // UPDATE PROFILE IMAGE
  //////////////////////////////////////////////////////
  async update_profile_image_service(user_id: string, newImage: string) {
    // FETCH CURRENT USER FROM DB
    const user = await this.usersRepo.findOne({ where: { uuid: user_id } });
    if (!user) throw new NotFoundException("User not found");

    // DELETE OLD IMAGE FROM FOLDER IF EXIST
    if (user.profile_image) {
      const filePath = path.join(
        __dirname,
        "../../public/uploads",
        user.profile_image
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // UPDATE DB IMAGE WITH NEW
    user.profile_image = newImage;
    await this.usersRepo.save(user);

    return {
      message: "Profile image updated successfully",
      profile_image: newImage,
    };
  }
}
