import { Test, TestingModule } from '@nestjs/testing';
import { UserIntegrationService } from './user_integration.service';

describe('UserIntegrationService', () => {
  let service: UserIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserIntegrationService],
    }).compile();

    service = module.get<UserIntegrationService>(UserIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
