import { Test, TestingModule } from '@nestjs/testing';
import { UserBusinessInfoController } from './user_business_info.controller';

describe('UserBusinessInfoController', () => {
  let controller: UserBusinessInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBusinessInfoController],
    }).compile();

    controller = module.get<UserBusinessInfoController>(UserBusinessInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
