import { Test, TestingModule } from '@nestjs/testing';
import { UserPaymentGatewayController } from './user_payment_gateway.controller';

describe('UserPaymentGatewayController', () => {
  let controller: UserPaymentGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPaymentGatewayController],
    }).compile();

    controller = module.get<UserPaymentGatewayController>(UserPaymentGatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
