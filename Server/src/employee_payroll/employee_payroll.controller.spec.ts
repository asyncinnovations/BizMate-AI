import { Test, TestingModule } from '@nestjs/testing';
import { EmployeePayrollController } from './employee_payroll.controller';

describe('EmployeePayrollController', () => {
  let controller: EmployeePayrollController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeePayrollController],
    }).compile();

    controller = module.get<EmployeePayrollController>(EmployeePayrollController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
