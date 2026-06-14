export declare const EmailTemplates: {
    reminder(reminder: {
        title: string;
        description?: string;
        reminder_date: Date | string;
        full_name?: string;
    }): string;
    invoicePaid(data: {
        invoice_number: string;
        customer_name: string;
        total: string | number;
        full_name?: string;
    }): string;
    quotationAccepted(data: {
        quotation_number: string;
        project_title?: string;
        client_name: string;
        full_name?: string;
    }): string;
    quotationRejected(data: {
        quotation_number: string;
        client_name: string;
        client_comment?: string;
        full_name?: string;
    }): string;
    documentFinalised(data: {
        document_name: string;
        document_type?: string;
        full_name?: string;
    }): string;
    welcome(data: {
        full_name: string;
        email: string;
    }): string;
    subscriptionExpiring(data: {
        plan_name: string;
        days_left: number;
        full_name?: string;
    }): string;
    passwordReset(data: {
        full_name: string;
        reset_link: string;
    }): string;
};
export declare class ResendService {
    private readonly apiKey;
    private readonly from;
    constructor();
    send(params: {
        to: string | string[];
        subject: string;
        html: string;
        reply_to?: string;
        tags?: {
            name: string;
            value: string;
        }[];
    }): Promise<{
        success: boolean;
        id?: string;
        error?: string;
    }>;
    sendReminderEmail(reminder: Parameters<typeof EmailTemplates.reminder>[0] & {
        email: string;
    }): Promise<{
        success: boolean;
        id?: string;
        error?: string;
    }>;
    sendInvoicePaidEmail(to: string, data: Parameters<typeof EmailTemplates.invoicePaid>[0]): Promise<{
        success: boolean;
        id?: string;
        error?: string;
    }>;
    sendQuotationAcceptedEmail(to: string, data: Parameters<typeof EmailTemplates.quotationAccepted>[0]): Promise<{
        success: boolean;
        id?: string;
        error?: string;
    }>;
    sendQuotationRejectedEmail(to: string, data: Parameters<typeof EmailTemplates.quotationRejected>[0]): Promise<{
        success: boolean;
        id?: string;
        error?: string;
    }>;
    sendDocumentFinalisedEmail(to: string, data: Parameters<typeof EmailTemplates.documentFinalised>[0]): Promise<{
        success: boolean;
        id?: string;
        error?: string;
    }>;
    sendWelcomeEmail(data: Parameters<typeof EmailTemplates.welcome>[0]): Promise<{
        success: boolean;
        id?: string;
        error?: string;
    }>;
    sendSubscriptionExpiringEmail(to: string, data: Parameters<typeof EmailTemplates.subscriptionExpiring>[0]): Promise<{
        success: boolean;
        id?: string;
        error?: string;
    }>;
    sendPasswordResetEmail(data: Parameters<typeof EmailTemplates.passwordReset>[0] & {
        email: string;
    }): Promise<{
        success: boolean;
        id?: string;
        error?: string;
    }>;
}
