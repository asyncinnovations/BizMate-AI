import { Test, TestingModule } from '@nestjs/testing';
import { UserPaymentGatewayService } from './user_payment_gateway.service';

describe('UserPaymentGatewayService', () => {
  let service: UserPaymentGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPaymentGatewayService],
    }).compile();

    service = module.get<UserPaymentGatewayService>(UserPaymentGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
