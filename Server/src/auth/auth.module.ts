import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthUsers } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { SubscriptionModule } from "src/subscription_plans/subscription_plans.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUsers]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "BizMateAI",
      signOptions: { expiresIn: "1d" },
    }),
    SubscriptionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
