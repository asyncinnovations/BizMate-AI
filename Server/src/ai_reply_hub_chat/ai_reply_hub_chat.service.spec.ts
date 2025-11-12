import { Test, TestingModule } from '@nestjs/testing';
import { AiReplyHubChatService } from './ai_reply_hub_chat.service';

describe('AiReplyHubChatService', () => {
  let service: AiReplyHubChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiReplyHubChatService],
    }).compile();

    service = module.get<AiReplyHubChatService>(AiReplyHubChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
