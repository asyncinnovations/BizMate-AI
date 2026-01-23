import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  UploadedFile,
  Param,
  Put,
  HttpStatus,
  HttpCode,
  HttpException,
} from "@nestjs/common";
import { UploadFile } from "src/common/decorators/upload.decorator";
import { AuthService } from "./auth.service";
import { UserRole } from "./user.entity";
import * as bcrypt from "bcrypt";
import { join } from "path";
import { LicenceNumberChecker } from "src/common/LicenceNumberChecker";
import { PDFParse } from "pdf-parse";
import fs from "fs";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  //////////////////////////////////////////////////////////////////////////////////////////
  // MANUAL VALIDATION FUNCTION FOR SIGNUP
  //////////////////////////////////////////////////////////////////////////////////////////
  private validateSignup(body: any) {
    const errors: string[] = [];

    if (!body.full_name || typeof body.full_name !== "string") {
      errors.push("full_name is required and must be a string.");
    }

    if (!body.email || typeof body.email !== "string") {
      errors.push("email is required and must be a string.");
    } else {
      // basic email regex check
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

    if (body.role && !Object.values(UserRole).includes(body.role)) {
      errors.push(`role must be one of: ${Object.values(UserRole).join(", ")}`);
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: "Validation failed", errors });
    }
  }

  /////////////////////////////////////////////////////////////////
  // MANUAL VALIDATION FOR LOGIN
  ////////////////////////////////////////////////////////////////
  private validateLogin(body: any) {
    const errors: string[] = [];

    if (!body.email || typeof body.email !== "string") {
      errors.push("email is required and must be a string.");
    }

    if (!body.password || typeof body.password !== "string") {
      errors.push("password is required and must be a string.");
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: "Validation failed", errors });
    }
  }

  //////////////////////////////////////////////////////
  // CREATE ACCOUNT
  //////////////////////////////////////////////////////
  @Post("/signup")
  @HttpCode(HttpStatus.CREATED)
  @UploadFile({
    fieldName: "license_file",
    destination: join(__dirname, "../../public/uploads"),
    maxCount: 1,
    multiple: false,
  })
  async signup(
    @Body()
    data: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
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

    // LICHENCE NUMBER CHCKER
    // const lichence_check = await LicenceNumberChecker(
    //   file,
    //   post_data.license_number
    // );
    // if (lichence_check?.success == false) {
    //   return {
    //     success: false,
    //     message: "Input Lichence Number & PDF Lichence Number Should be Same",
    //   };
    // }

    // CREATE ACCOUNT AFTER VALIDATION
    this.validateSignup(data);
    const response = await this.authService.signup_service(post_data);
    return { message: "registration success", response };
  }

  //////////////////////////////////////////////////////////////
  // LOGIN USER TO THE ACCOUNT
  /////////////////////////////////////////////////////////////
  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    this.validateLogin(body);
    return this.authService.login_service(body.email, body.password);
  }

  //////////////////////////////////////////////////////
  // GET ALL USERS
  //////////////////////////////////////////////////////
  @Get("/all")
  @HttpCode(HttpStatus.OK)
  async all_users() {
    const response = await this.authService.all_users_service();
    return response;
  }

  //////////////////////////////////////////////////////
  // GET SINGLE  USERS
  //////////////////////////////////////////////////////
  @Get("/single/:id")
  @HttpCode(HttpStatus.OK)
  async single_user(@Param("id") user_id: string) {
    const response = await this.authService.single_user_service(user_id);
    return { message: "single user retrived", response };
  }

  //////////////////////////////////////////////////////
  // UPDATE USER BY USER_ID
  //////////////////////////////////////////////////////
  @Put("/update/:id")
  @HttpCode(HttpStatus.OK)
  async update_user(@Param("id") user_id: any, @Body() body: any) {
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

  //////////////////////////////////////////////////////
  // UPDATE PROFILE IMAGE
  //////////////////////////////////////////////////////
  @Put("/update_image/:id")
  @HttpCode(HttpStatus.OK)
  @UploadFile({
    fieldName: "profile_image",
    destination: join(__dirname, "../../public/uploads"),
    maxCount: 1,
    multiple: false,
  })
  async update_profile_image(
    @Param("id") user_id,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const image = file?.originalname || body.profile_image;
      const response = await this.authService.update_profile_image_service(
        user_id,
        image,
      );
      return { message: "profile image updated", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  //////////////////////////////////////////
  // EMAIL VERIFICATION
  //////////////////////////////////////////
  @Put("email_verify/:id")
  async verify_email(@Param("id") user_id, @Body() body) {
    try {
      const response = await this.authService.verify_email_service(
        user_id,
        body.email,
      );
      if (!response) {
        throw new HttpException(
          { message: "user account not found" },
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: "email verified", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  //////////////////////////////////////////
  // EMAIL VERIFICATION
  //////////////////////////////////////////
  @Put("reset_password/:id")
  async reset_user_password(@Param("id") user_id, @Body() body) {
    try {
      const hashed = await bcrypt.hash(body.new_password, 10);
      const response = await this.authService.reset_user_password_service(
        user_id,
        hashed,
      );
      if (!response) {
        throw new HttpException(
          { message: "user account not found" },
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: "Password Reset Success", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
