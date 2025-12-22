import { Test, TestingModule } from '@nestjs/testing';
import { UserSubscriptionController } from './user_subscription.controller';

describe('UserSubscriptionController', () => {
  let controller: UserSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSubscriptionController],
    }).compile();

    controller = module.get<UserSubscriptionController>(UserSubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
