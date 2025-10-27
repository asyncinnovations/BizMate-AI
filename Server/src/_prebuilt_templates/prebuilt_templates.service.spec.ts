import { Test, TestingModule } from '@nestjs/testing';
import { PrebuiltTemplatesService } from './prebuilt_templates.service';

describe('PrebuiltTemplatesService', () => {
  let service: PrebuiltTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrebuiltTemplatesService],
    }).compile();

    service = module.get<PrebuiltTemplatesService>(PrebuiltTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
