import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPaymentsService } from './subscription_payments.service';

describe('SubscriptionPaymentsService', () => {
  let service: SubscriptionPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionPaymentsService],
    }).compile();

    service = module.get<SubscriptionPaymentsService>(SubscriptionPaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
