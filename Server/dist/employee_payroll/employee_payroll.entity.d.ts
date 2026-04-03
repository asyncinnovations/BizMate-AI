export declare enum ContractType {
    FULL_TIME = "Full_Time",
    PART_TIME = "Part_Time",
    CONTRACT = "Contract",
    INTERNSHIP = "Internship"
}
export declare class EmployeePayroll {
    id: number;
    uuid: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    emiratesId: string;
    designation: string;
    user_id: string;
    department: string;
    joiningDate: Date;
    contractType: ContractType;
    basicSalary: number;
    housingAllowance: number;
    transportAllowance: number;
    otherAllowance: number;
    bankName: string;
    iban: string;
    createdAt: Date;
    updatedAt: Date;
}
