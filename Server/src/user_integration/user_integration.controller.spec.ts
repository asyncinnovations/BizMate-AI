import { Test, TestingModule } from '@nestjs/testing';
import { UserIntegrationController } from './user_integration.controller';

describe('UserIntegrationController', () => {
  let controller: UserIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserIntegrationController],
    }).compile();

    controller = module.get<UserIntegrationController>(UserIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
