import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpException,
  HttpCode,
} from "@nestjs/common";
import { UserSessionsService } from "./user_sessions.service";

@Controller("user-sessions")
export class UserSessionsController {
  constructor(private readonly userSessionsService: UserSessionsService) {}

  ///////////////////////////////////////
  // CREATE USER SESSION
  ///////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.OK)
  async create_user_session_service(@Body() body: any) {
    try {
      const session =
        await this.userSessionsService.create_user_session_service(body);
      return {
        statusCode: HttpStatus.CREATED,
        message: "User session created successfully",
        data: session,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  ///////////////////////////////////////
  // GET ALL USER SESSIONS
  ///////////////////////////////////////
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async get_all_sessions_service() {
    try {
      const sessions =
        await this.userSessionsService.get_all_sessions_service();
      return {
        statusCode: HttpStatus.OK,
        message: "All user sessions fetched successfully",
        data: sessions,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  ///////////////////////////////////////
  // GET SESSIONS BY USER
  ///////////////////////////////////////
  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  async get_user_sessions_service(@Param("userId") userId: string) {
    try {
      const sessions =
        await this.userSessionsService.get_user_sessions_service(userId);
      return {
        statusCode: HttpStatus.OK,
        message: "User sessions fetched successfully",
        data: sessions,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: error.message },
        HttpStatus.NOT_FOUND
      );
    }
  }

  ///////////////////////////////////////
  // UPDATE LAST ACTIVE / SESSION INFO
  ///////////////////////////////////////
  @Patch("update_last_active/:uuid")
  @HttpCode(HttpStatus.OK)
  async update_user_session_service(@Param("uuid") uuid: string) {
    try {
      const session =
        await this.userSessionsService.update_user_session_service(uuid);
      return {
        statusCode: HttpStatus.OK,
        message: "User session updated successfully",
        data: session,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  ///////////////////////////////////////
  // LOGOUT / DEACTIVATE SESSION
  ///////////////////////////////////////
  @Delete("logout/:uuid")
  @HttpCode(HttpStatus.OK)
  async deactivate_user_session_service(@Param("uuid") uuid: string) {
    try {
      const session =
        await this.userSessionsService.deactivate_user_session_service(uuid);
      return {
        statusCode: HttpStatus.OK,
        message: "User session deactivated successfully",
        data: session,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: error.message },
        HttpStatus.NOT_FOUND
      );
    }
  }
}
