import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceSchedulesService } from './invoice_schedules.service';

describe('InvoiceSchedulesService', () => {
  let service: InvoiceSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceSchedulesService],
    }).compile();

    service = module.get<InvoiceSchedulesService>(InvoiceSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
