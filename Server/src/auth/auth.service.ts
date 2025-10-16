import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { AuthUsers } from "./user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUsers)
    private usersRepo: Repository<AuthUsers>,
    private jwtService: JwtService
  ) {}

  async signup(
    email: string,
    password: string,
    full_name: string,
    phone: any,
    company_name: string,
    license_number: any,
    vat_id: any,
    idustry: any,
    role: any
  ) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException("Email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({
      email,
      password_hash: hashed,
      full_name,
      phone,
      company_name,
      license_number,
      vat_id,
      idustry,
      role,
    });
    await this.usersRepo.save(user);
    return { message: "User registered successfully" };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException("Invalid credentials");

    const token = this.jwtService.sign({
      email: user.email,
    });
    return {
      token,
      user: {
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone,
        language: user.language_preference,
        user_id: user.uuid,
      },
    };
  }

  async all_users() {
    // const users = await this.usersRepo.find({ select: ["id", "email"] });
    // if (!users) throw new UnauthorizedException("Invalid credentials");
    // return users;
    const users = await this.usersRepo.query(`SELECT email FROM users`);
    return users;
  }
}

// async getUsersWithListingsQB() {
//   const result = await this.usersRepo
//     .createQueryBuilder('u')
//     .leftJoin('u.listings', 'l')
//     .select(['u.id', 'u.email', 'l.id AS listing_id', 'l.title AS listing_title'])
//     .getRawMany(); // returns raw SQL result

//   return result;
// }
