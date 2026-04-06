/**
 * payroll.types.ts
 * Shared types for the entire Payroll feature.
 * Import from here in all payroll pages.
 */

// ─── Employee ────────────────────────────────────────────────────────────────

export type EmployeeStatus   = "active" | "inactive";
export type ContractType     = "full_time" | "part_time" | "contract";

export interface Employee {
  uuid: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  emirates_id: string;
  designation: string;
  department: string;
  joining_date: string;           // ISO date string
  contract_type: ContractType;
  status: EmployeeStatus;
  // Salary breakdown
  basic_salary: number;           // AED
  housing_allowance: number;      // AED
  transport_allowance: number;    // AED
  other_allowance: number;        // AED
  // Banking (WPS)
  bank_name: string;
  iban: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  emirates_id: string;
  designation: string;
  department: string;
  joining_date: string;
  contract_type: ContractType;
  basic_salary: number | string;
  housing_allowance: number | string;
  transport_allowance: number | string;
  other_allowance: number | string;
  bank_name: string;
  iban: string;
}

// ─── Payroll Run ─────────────────────────────────────────────────────────────

export type PayrollRunStatus = "draft" | "approved" | "processed";

export interface PayrollRunEmployee {
  employee_uuid: string;
  full_name: string;
  designation: string;
  department: string;
  basic_salary: number;
  housing_allowance: number;
  transport_allowance: number;
  other_allowance: number;
  gross_salary: number;           // sum of all above
  deductions: number;             // advance recovery, unpaid leave, penalties
  net_salary: number;             // gross - deductions
  iban: string;
  bank_name: string;
  notes?: string;
}

export interface PayrollRun {
  uuid: string;
  user_id: string;
  month: string;                  // "2026-03" (YYYY-MM)
  status: PayrollRunStatus;
  total_amount: number;           // AED — sum of all net salaries
  employee_count: number;
  employees: PayrollRunEmployee[];
  processed_date?: string;        // ISO date — set when approved
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface EmployeeListResponse {
  employees: Employee[];
}

export interface PayrollRunListResponse {
  runs: PayrollRun[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract:  "Contract",
};

export const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "Finance",
  "HR",
  "Operations",
  "Customer Support",
  "Design",
  "Legal",
  "Management",
  "Other",
];

/** Compute gross = basic + all allowances */
export function computeGross(emp: Pick<Employee, "basic_salary" | "housing_allowance" | "transport_allowance" | "other_allowance">): number {
  return (
    Number(emp.basic_salary) +
    Number(emp.housing_allowance) +
    Number(emp.transport_allowance) +
    Number(emp.other_allowance)
  );
}

/** Format AED amount */
export function fmtAED(amount: number): string {
  return `AED ${Number(amount).toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format YYYY-MM to "March 2026" */
export function fmtMonth(ym: string): string {
  if (!ym) return "";
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** Get current YYYY-MM */
export function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}