import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { JwtGuard } from "src/guards/auth/auth.guard";
import { ClientListsService } from "./client_lists.service";
import { ClientList } from "./client_lists.entity";

@Controller("client_lists")
@UseGuards(JwtGuard)
export class ClientListsController {
  constructor(private readonly clientListService: ClientListsService) {}

  //////////////////////////////////////////////
  // CREATE NEW CLIENT
  //////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_client(@Req() req, @Body() body: ClientList) {
    // const user_id = req.user?.id;
    const { name, email, whatsapp_number, instagram_id, user_id } = body;
    if (!user_id) throw new BadRequestException("Invalid user ID");

    // Basic validation
    if (!name) throw new BadRequestException("Client name is required");
    if (!email && !whatsapp_number && !instagram_id)
      throw new BadRequestException(
        "At least one contact (email, WhatsApp, or Instagram) is required"
      );

    // Email format validation (if provided)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new BadRequestException("Invalid email format");

    // WhatsApp format validation (optional)
    if (whatsapp_number && !/^\+?\d{8,15}$/.test(whatsapp_number))
      throw new BadRequestException("Invalid WhatsApp number");

    const data = { ...body, user_id };
    const response = await this.clientListService.create_client_service(data);
    return { message: "Client created successfully", response };
  }

  //////////////////////////////////////////////
  // GET ALL CLIENTS (by user)
  //////////////////////////////////////////////
  @Get("user/:id")
  @HttpCode(HttpStatus.OK)
  async get_all_clients(@Param("id") user_id: string) {
    if (!user_id) throw new BadRequestException("Invalid user ID");

    const response =
      await this.clientListService.get_all_clients_service(user_id);
    return { message: "Clients fetched successfully", response };
  }

  //////////////////////////////////////////////
  // GET SINGLE CLIENT (by id or uuid)
  //////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async get_client(@Param("id") id: string) {
    if (!id) throw new BadRequestException("Client ID is required");

    const response = await this.clientListService.get_client_by_id_service(id);
    if (!response) throw new BadRequestException("Client not found");

    return { message: "Client fetched successfully", response };
  }

  //////////////////////////////////////////////
  // SEARCH CLIENTS (by name, email, whatsapp)
  //////////////////////////////////////////////
  @Get("search/:id")
  @HttpCode(HttpStatus.OK)
  async search_clients(
    @Param("id") user_id: string,
    @Query("q") query: string
  ) {
    // const user_id = req.user?.id;
    if (!user_id) throw new BadRequestException("Invalid user ID");
    if (!query || query.trim().length < 2)
      throw new BadRequestException(
        "Search query must be at least 2 characters"
      );

    const response = await this.clientListService.search_clients_service(
      user_id,
      query
    );
    return { message: "Search results", response };
  }

  //////////////////////////////////////////////
  // UPDATE CLIENT
  //////////////////////////////////////////////
  @Patch("update/:id")
  @HttpCode(HttpStatus.OK)
  async update_client(
    @Param("id") id: string,
    @Body() body: Partial<ClientList>
  ) {
    if (!id) throw new BadRequestException("Client ID is required");
    if (!Object.keys(body).length)
      throw new BadRequestException("No data provided to update");

    const response = await this.clientListService.update_client_service(
      id,
      body
    );
    return { message: "Client updated successfully", response };
  }

  //////////////////////////////////////////////
  // BULK IMPORT CLIENTS
  //////////////////////////////////////////////
  @Post("bulk_import/:id")
  @HttpCode(HttpStatus.OK)
  async bulk_import_clients(@Param("id") user_id: string, @Body() body: any[]) {
    // const user_id = req.user?.id;
    if (!user_id) throw new BadRequestException("Invalid user ID");

    if (!Array.isArray(body) || body.length === 0)
      throw new BadRequestException("Client list must be a non-empty array");

    for (const client of body) {
      if (!client.name)
        throw new BadRequestException("Each client must have a name");
    }

    const response = await this.clientListService.bulk_import_clients_service(
      user_id,
      body
    );
    return { message: "Clients imported successfully", count: response.length };
  }

  //////////////////////////////////////////////
  // CHECK IF CLIENT EXISTS (email or whatsapp)
  //////////////////////////////////////////////
  @Post("client_exists/:id")
  @HttpCode(HttpStatus.OK)
  async check_client_exists(@Param("id") user_id: string, @Body() body: any) {
    if (!user_id) throw new BadRequestException("Invalid user ID");

    const { email, whatsapp_number } = body;
    if (!email && !whatsapp_number)
      throw new BadRequestException(
        "Please provide either email or WhatsApp number"
      );

    const response = await this.clientListService.client_exists_service(
      user_id,
      email,
      whatsapp_number
    );

    return {
      exists: !!response,
      message: response ? "Client already exists" : "Client not found",
      data: response,
<<<<<<< HEAD
    }; 
=======
    };
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
  }

  //////////////////////////////////////////////
  // DELETE CLIENT
  //////////////////////////////////////////////
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_client(@Param("id") id: string) {
    if (!id) throw new BadRequestException("Client ID is required");

    const response = await this.clientListService.delete_client_service(id);
    return response;
  }
}
