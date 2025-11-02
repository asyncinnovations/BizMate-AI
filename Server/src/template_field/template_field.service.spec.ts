import { Test, TestingModule } from '@nestjs/testing';
import { TemplateFieldService } from './template_field.service';

describe('TemplateFieldService', () => {
  let service: TemplateFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateFieldService],
    }).compile();

    service = module.get<TemplateFieldService>(TemplateFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
