import { ClientListsService } from "./client_lists.service";
import { ClientList } from "./client_lists.entity";
export declare class ClientListsController {
    private readonly clientListService;
    constructor(clientListService: ClientListsService);
    create_client(req: any, body: ClientList): Promise<{
        message: string;
        response: ClientList[];
    }>;
    get_all_clients(user_id: string): Promise<{
        message: string;
        response: ClientList[];
    }>;
    get_client(id: string): Promise<{
        message: string;
        response: ClientList;
    }>;
    search_clients(user_id: string, query: string): Promise<{
        message: string;
        response: ClientList[];
    }>;
    update_client(id: string, body: Partial<ClientList>): Promise<{
        message: string;
        response: ClientList;
    }>;
    bulk_import_clients(user_id: string, body: any[]): Promise<{
        message: string;
        count: number;
    }>;
    check_client_exists(user_id: string, body: any): Promise<{
        exists: boolean;
        message: string;
        data: ClientList | null;
    }>;
    delete_client(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
