import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientList } from "./client_lists.entity";

@Injectable()
export class ClientListsService {
  constructor(
    @InjectRepository(ClientList)
    private readonly clientListRepo: Repository<ClientList>
  ) {}

  //////////////////////////////////////////////
  // CREATE NEW CLIENT
  //////////////////////////////////////////////
  async create_client_service(data: any) {
    const client = this.clientListRepo.create(data);
    return await this.clientListRepo.save(client);
  }

  //////////////////////////////////////////////
  // GET ALL CLIENTS FOR A USER
  //////////////////////////////////////////////
  async get_all_clients_service(user_id: string) {
    return await this.clientListRepo.find({
      where: { user_id },
      order: { added_at: "DESC" },
    });
  }

  //////////////////////////////////////////////
  // GET SINGLE CLIENT BY ID OR UUID
  //////////////////////////////////////////////
  async get_client_by_id_service(id: number | string) {
    const client =
      typeof id === "number"
        ? await this.clientListRepo.findOne({ where: { id } })
        : await this.clientListRepo.findOne({ where: { uuid: id } });

    if (!client) throw new NotFoundException("Client not found");
    return client;
  }

  //////////////////////////////////////////////
  // UPDATE CLIENT
  //////////////////////////////////////////////
  async update_client_service(id: string, updateData: Partial<ClientList>) {
    const client = await this.clientListRepo.findOne({ where: { uuid: id } });
    if (!client) throw new NotFoundException("Client not found");

    Object.assign(client, updateData);
    return await this.clientListRepo.save(client);
  }

  //////////////////////////////////////////////
  // DELETE CLIENT
  //////////////////////////////////////////////
  async delete_client_service(id: string) {
    const client = await this.clientListRepo.findOne({ where: { uuid: id } });
    if (!client) throw new NotFoundException("Client not found");

    await this.clientListRepo.remove(client);
    return { success: true, message: "Client deleted successfully" };
  }

  //////////////////////////////////////////////
  // SEARCH CLIENTS BY NAME / EMAIL / WHATSAPP
  //////////////////////////////////////////////
  async search_clients_service(user_id: string, query: string) {
    return await this.clientListRepo
      .createQueryBuilder("client")
      .where("client.user_id = :user_id", { user_id })
      .andWhere(
        "(client.name ILIKE :q OR client.email ILIKE :q OR client.whatsapp_number ILIKE :q)",
        { q: `%${query}%` }
      )
      .orderBy("client.added_at", "DESC")
      .getMany();
  }

  //////////////////////////////////////////////
  // CHECK IF CLIENT EXISTS
  //////////////////////////////////////////////
  async client_exists_service(
    user_id: string,
    email?: string,
    whatsapp?: string
  ) {
    return await this.clientListRepo.findOne({
      where: [
        { user_id, email },
        { user_id, whatsapp_number: whatsapp },
      ],
    });
  }

  //////////////////////////////////////////////
  // BULK IMPORT CLIENTS (from CSV, Excel, etc.)
  //////////////////////////////////////////////
  async bulk_import_clients_service(
    user_id: string,
    clients: Partial<ClientList>[]
  ) {
    const clientEntities = clients.map((c) =>
      this.clientListRepo.create({ ...c, user_id })
    );
    return await this.clientListRepo.save(clientEntities);
  }
}
