import { Test, TestingModule } from '@nestjs/testing';
import { EmployeePayrollService } from './employee_payroll.service';

describe('EmployeePayrollService', () => {
  let service: EmployeePayrollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeePayrollService],
    }).compile();

    service = module.get<EmployeePayrollService>(EmployeePayrollService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
