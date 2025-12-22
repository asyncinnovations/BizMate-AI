import { Module } from "@nestjs/common";
import { UserSessionsService } from "./user_sessions.service";
import { UserSessionsController } from "./user_sessions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSession } from "./user_sessions.entity";
import { AuthUsers } from "src/auth/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserSession, AuthUsers])],
  providers: [UserSessionsService],
  controllers: [UserSessionsController],
})
export class UserSessionsModule {}
