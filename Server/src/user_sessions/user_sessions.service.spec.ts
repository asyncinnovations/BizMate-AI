import { Test, TestingModule } from '@nestjs/testing';
import { UserSessionsService } from './user_sessions.service';

describe('UserSessionsService', () => {
  let service: UserSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSessionsService],
    }).compile();

    service = module.get<UserSessionsService>(UserSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
