import { Repository } from "typeorm";
import { ClientList } from "./client_lists.entity";
export declare class ClientListsService {
    private readonly clientListRepo;
    constructor(clientListRepo: Repository<ClientList>);
    create_client_service(data: any): Promise<ClientList[]>;
    get_all_clients_service(user_id: string): Promise<ClientList[]>;
    get_client_by_id_service(id: number | string): Promise<ClientList>;
    update_client_service(id: string, updateData: Partial<ClientList>): Promise<ClientList>;
    delete_client_service(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    search_clients_service(user_id: string, query: string): Promise<ClientList[]>;
    client_exists_service(user_id: string, email?: string, whatsapp?: string): Promise<ClientList | null>;
    bulk_import_clients_service(user_id: string, clients: Partial<ClientList>[]): Promise<ClientList[]>;
}
