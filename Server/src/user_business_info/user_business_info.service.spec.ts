import { Test, TestingModule } from '@nestjs/testing';
import { UserBusinessInfoService } from './user_business_info.service';

describe('UserBusinessInfoService', () => {
  let service: UserBusinessInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBusinessInfoService],
    }).compile();

    service = module.get<UserBusinessInfoService>(UserBusinessInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
