import { InvoiceSchedulesService } from './invoice_schedules.service';
export declare class InvoiceSchedulesController {
    private readonly invoiceSchedulesService;
    constructor(invoiceSchedulesService: InvoiceSchedulesService);
    create_schedule_controller(dto: any): Promise<{
        message: string;
        response: any;
    }>;
    all_schedules_controller(user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    single_schedule_controller(id: string): Promise<{
        message: string;
        response: any;
    }>;
    cancel_schedule_controller(id: string): Promise<{
        message: string;
        response: {
            success: boolean;
        };
    }>;
    retry_schedule_controller(id: string): Promise<{
        message: string;
        response: any;
    }>;
    execute_schedule_controller(id: string): Promise<{
        message: string;
        response: void;
    }>;
    reload_pending_controller(): Promise<{
        message: string;
        response: void;
    }>;
}
