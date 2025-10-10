import { Controller, Post, Body, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  async signup(
    @Body()
    body: {
      email: string;
      password: string;
      full_name: string;
      phone: any;
      role: any;
    }
  ) {
    return this.authService.signup(
      body.email,
      body.password,
      body.full_name,
      body.phone,
      body.role
    );
  }

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get("all")
  async all_users() {
    return this.authService.all_users();
  }
}
