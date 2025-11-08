import { Test, TestingModule } from '@nestjs/testing';
import { AiReminderController } from './ai_reminder.controller';

describe('AiReminderController', () => {
  let controller: AiReminderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiReminderController],
    }).compile();

    controller = module.get<AiReminderController>(AiReminderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
