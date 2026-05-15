import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceSchedulesController } from './invoice_schedules.controller';

describe('InvoiceSchedulesController', () => {
  let controller: InvoiceSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceSchedulesController],
    }).compile();

    controller = module.get<InvoiceSchedulesController>(InvoiceSchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
