import { Test, TestingModule } from '@nestjs/testing';
import { TemplateFieldController } from './template_field.controller';

describe('TemplateFieldController', () => {
  let controller: TemplateFieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateFieldController],
    }).compile();

    controller = module.get<TemplateFieldController>(TemplateFieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
