import { ClientListsService } from "./client_lists.service";
import { ClientList } from "./client_lists.entity";
export declare class ClientListsController {
    private readonly clientListService;
    constructor(clientListService: ClientListsService);
    create_client(req: any, body: ClientList): Promise<{
        message: string;
        response: any;
    }>;
    get_all_clients(user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    get_client(id: string): Promise<{
        message: string;
        response: any;
    }>;
    search_clients(user_id: string, query: string): Promise<{
        message: string;
        response: any;
    }>;
    update_client(id: string, body: Partial<ClientList>): Promise<{
        message: string;
        response: any;
    }>;
    bulk_import_clients(user_id: string, body: any[]): Promise<{
        message: string;
        count: any;
    }>;
    check_client_exists(user_id: string, body: any): Promise<{
        exists: boolean;
        message: string;
        data: any;
    }>;
    delete_client(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
