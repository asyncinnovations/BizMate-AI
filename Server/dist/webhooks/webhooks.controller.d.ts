import type { Request, Response } from "express";
import type { RawBodyRequest } from "@nestjs/common";
import { SubscriptionPaymentsService } from "src/subscription_payments/subscription_payments.service";
import { SubscriptionPlanService } from "src/subscription_plans/subscription_plans.service";
import { ResendService } from "src/services/ResendService";
export declare class WebhooksController {
    private readonly paymentsService;
    private readonly planService;
    private readonly resendService;
    constructor(paymentsService: SubscriptionPaymentsService, planService: SubscriptionPlanService, resendService: ResendService);
    stripeWebhook(req: RawBodyRequest<Request>, res: Response, sig: string): Promise<Response<any, Record<string, any>>>;
    telrSuccess(orderRef: string, tranRef: string, res: Response): Promise<void>;
    telrDecline(orderRef: string, res: Response): Promise<void>;
    tapWebhook(body: any): Promise<{
        received: boolean;
    }>;
    paypalCapture(token: string, payerId: string, orderRef: string, res: Response): Promise<void>;
    private confirmPaymentByOrderRef;
    private failPaymentByOrderRef;
    private verifyTelrPayment;
}
