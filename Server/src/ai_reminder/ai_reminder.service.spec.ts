import { Test, TestingModule } from '@nestjs/testing';
import { AiReminderService } from './ai_reminder.service';

describe('AiReminderService', () => {
  let service: AiReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiReminderService],
    }).compile();

    service = module.get<AiReminderService>(AiReminderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
