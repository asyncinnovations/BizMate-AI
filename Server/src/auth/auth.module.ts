import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthUsers } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./_jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUsers]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "BizMateAI",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
