import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionUsageController } from './subscription_usage.controller';

describe('SubscriptionUsageController', () => {
  let controller: SubscriptionUsageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionUsageController],
    }).compile();

    controller = module.get<SubscriptionUsageController>(SubscriptionUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
