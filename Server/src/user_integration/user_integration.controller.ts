import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserIntegrationService } from "./user_integration.service";
import { JwtGuard } from "src/guards/auth/auth.guard";

@Controller("user_integration")
@UseGuards(JwtGuard)
export class UserIntegrationController {
  constructor(private readonly Integrationservice: UserIntegrationService) {}

  /////////////////////////////////////////////////////////////////////////
  // CREATE USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_userIntegration(@Body() body: any) {
    if (!body.user_id) {
      return new BadRequestException("user id required");
    }

    const response =
      await this.Integrationservice.create_userIntegration_service(body);
    return { message: "user integration create success", response };
  }
  /////////////////////////////////////////////////////////////////////////
  // ALL USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_userIntegration() {
    const response =
      await this.Integrationservice.all_userIntegration_service();
    return { message: "all user integration retrived", response };
  }
  /////////////////////////////////////////////////////////////////////////
  // SINGLE USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async single_userIntegration(@Param("id") id: string) {
    const response =
      await this.Integrationservice.single_userIntegration_service(id);
    return { message: "single userIntegration retirved", response };
  }
  /////////////////////////////////////////////////////////////////////////
  // FIND USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_userIntegration(@Param("user_id") user_id: string) {
    const response =
      await this.Integrationservice.user_userIntegration_service(user_id);
    return { message: "user integration retrived", response };
  }
  /////////////////////////////////////////////////////////////////////////
  // UPDATE USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  @Patch("update/:id")
  @HttpCode(HttpStatus.OK)
  async update_userIntegration(@Param("id") id: string, @Body() body: any) {
    const response =
      await this.Integrationservice.update_userIntegration_service(id, body);
    return { message: "userIntegration update success", response };
  }
  /////////////////////////////////////////////////////////////////////////
  // DELETE USER INTEGRATION
  /////////////////////////////////////////////////////////////////////////
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_userIntegration(@Param("id") id: string) {
    const response =
      await this.Integrationservice.delete_userIntegration_service(id);
    return { message: "userIntegration delete success", response };
  }
  /////////////////////////////////////////////////////////////////////////
  // UPDATE USER INTEGRATION STATUS
  /////////////////////////////////////////////////////////////////////////
  @Patch("update_status/:id")
  @HttpCode(HttpStatus.OK)
  async change_userIntegration_status(
    @Param("id") id: string,
    @Body("status") status: "connected" | "disconnected"
  ) {
    const response =
      await this.Integrationservice.change_status_userIntegration_service(
        id,
        status
      );
    return { message: "user Integration status change success", response };
  }
  /////////////////////////////////////////////////////////////////////////
  // UPDATE  USER INTEGRATION SYNC
  /////////////////////////////////////////////////////////////////////////
  @Patch("update_sync/:id")
  @HttpCode(HttpStatus.OK)
  async update_userIntegration_lastSync(@Param("id") id: string) {
    const response =
      await this.Integrationservice.update_lastsync_userIntegration_service(id);
    return { message: "userIntegration last sync updated", response };
  }
}
