import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionUsageService } from './subscription_usage.service';

describe('SubscriptionUsageService', () => {
  let service: SubscriptionUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionUsageService],
    }).compile();

    service = module.get<SubscriptionUsageService>(SubscriptionUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
