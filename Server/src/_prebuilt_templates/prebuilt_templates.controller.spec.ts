import { Test, TestingModule } from '@nestjs/testing';
import { PrebuiltTemplatesController } from './prebuilt_templates.controller';

describe('PrebuiltTemplatesController', () => {
  let controller: PrebuiltTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrebuiltTemplatesController],
    }).compile();

    controller = module.get<PrebuiltTemplatesController>(PrebuiltTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
