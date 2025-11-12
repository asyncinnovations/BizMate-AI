import { Test, TestingModule } from '@nestjs/testing';
import { AiReplyHubChatController } from './ai_reply_hub_chat.controller';

describe('AiReplyHubChatController', () => {
  let controller: AiReplyHubChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiReplyHubChatController],
    }).compile();

    controller = module.get<AiReplyHubChatController>(AiReplyHubChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
