import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPaymentsController } from './subscription_payments.controller';

describe('SubscriptionPaymentsController', () => {
  let controller: SubscriptionPaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionPaymentsController],
    }).compile();

    controller = module.get<SubscriptionPaymentsController>(SubscriptionPaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
