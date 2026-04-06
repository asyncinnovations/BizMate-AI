"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlayCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Users,
  Minus,
  Plus,
  Equal,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/select";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import EmptyState from "@/components/empty-state/EmptyState";
import toast from "react-hot-toast";
import { DUMMY_EMPLOYEES } from "@/types/payroll.dummy";
import {
  Employee,
  fmtAED,
  computeGross,
  currentYearMonth,
  fmtMonth,
} from "@/types/payroll.types";

export default function RunPayrollPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [month, setMonth] = useState(currentYearMonth());
  const [deductions, setDeductions] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setEmployees(DUMMY_EMPLOYEES.filter((e) => e.status === "active"));
    setLoading(false);
  };

  const getDeduction = (uuid: string) => Number(deductions[uuid]) || 0;
  const getNet = (emp: Employee) =>
    Math.max(0, computeGross(emp) - getDeduction(emp.uuid));
  const totalGross = employees.reduce((s, e) => s + computeGross(e), 0);
  const totalDeductions = employees.reduce(
    (s, e) => s + getDeduction(e.uuid),
    0,
  );
  const totalNet = totalGross - totalDeductions;

  const monthOptions = Array.from({ length: 3 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const handleRunPayroll = async () => {
    if (employees.length === 0)
      return toast.error("No active employees to process");
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Payroll processed successfully!");
    router.push("/dashboard/payroll/history/run-001"); // navigate to latest dummy run
  };

  const inputCls =
    "w-full px-3 py-2 border border-border rounded-lg bg-bg-base text-sm text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary";

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <PageHeader
          title="Run Payroll"
          description="Review and process monthly salaries for all active employees"
          icon={<PlayCircle size={24} />}
          buttons={[
            {
              text: "Back",
              icon: <ArrowLeft size={18} />,
              onClick: () => router.back(),
            },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                    Payroll Month
                  </label>
                  <Select
                    value={month}
                    onChange={setMonth}
                    options={monthOptions.map((m) => ({
                      value: m,
                      label: fmtMonth(m),
                    }))}
                    className="w-auto min-w-48"
                  />
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-text-muted mb-1">
                    Active employees
                  </p>
                  <p className="text-2xl font-black text-text-heading">
                    {employees.length}
                  </p>
                </div>
              </div>
            </Card>

            {loading ? (
              <div className="flex items-center justify-center p-16">
                <LoadingSpinner size="w-8 h-8" />
              </div>
            ) : employees.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No active employees"
                description="Add employees first before running payroll"
                ctaLabel="Add Employee"
                onCTAClick={() =>
                  router.push("/dashboard/payroll/employees/add")
                }
              />
            ) : (
              employees.map((emp) => {
                const gross = computeGross(emp);
                const deduction = getDeduction(emp.uuid);
                const net = getNet(emp);
                return (
                  <Card key={emp.uuid}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-on-brand text-xs font-bold shrink-0">
                          {emp.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-heading">
                            {emp.full_name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {emp.designation} · {emp.department}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-muted">Net Salary</p>
                        <p className="text-lg font-black text-secondary">
                          {fmtAED(net)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {[
                        { label: "Basic", value: emp.basic_salary },
                        { label: "Housing", value: emp.housing_allowance },
                        { label: "Transport", value: emp.transport_allowance },
                        { label: "Other", value: emp.other_allowance },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="bg-bg-base rounded-lg p-3 border border-border"
                        >
                          <p className="text-xs text-text-muted mb-1">
                            {label}
                          </p>
                          <p className="text-sm font-semibold text-text-heading">
                            {fmtAED(Number(value))}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mb-4 p-3 bg-bg-base rounded-xl border border-border">
                      <div className="flex-1 text-center">
                        <p className="text-xs text-text-muted">Gross</p>
                        <p className="text-sm font-bold text-text-heading">
                          {fmtAED(gross)}
                        </p>
                      </div>
                      <Minus className="w-4 h-4 text-status-error shrink-0" />
                      <div className="flex-1 text-center">
                        <p className="text-xs text-text-muted">Deductions</p>
                        <p className="text-sm font-bold text-status-error">
                          {fmtAED(deduction)}
                        </p>
                      </div>
                      <Equal className="w-4 h-4 text-text-muted shrink-0" />
                      <div className="flex-1 text-center">
                        <p className="text-xs text-text-muted">Net Pay</p>
                        <p className="text-sm font-bold text-status-success">
                          {fmtAED(net)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                          Deduction (AED)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={deductions[emp.uuid] || ""}
                          onChange={(e) =>
                            setDeductions((prev) => ({
                              ...prev,
                              [emp.uuid]: e.target.value,
                            }))
                          }
                          placeholder="0.00"
                          className={inputCls}
                        />
                        <p className="text-xs text-text-muted mt-1">
                          Advance, leave, penalty
                        </p>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={notes[emp.uuid] || ""}
                          onChange={(e) =>
                            setNotes((prev) => ({
                              ...prev,
                              [emp.uuid]: e.target.value,
                            }))
                          }
                          placeholder="Optional note"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          <div className="space-y-6 sticky top-2">
            <Card>
              <h3 className="text-lg font-bold text-text-heading mb-5">
                Payroll Summary
              </h3>
              <div className="space-y-3.5">
                {[
                  { label: "Month", value: fmtMonth(month) },
                  { label: "Employees", value: String(employees.length) },
                  { label: "Total Gross", value: fmtAED(totalGross) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{label}</span>
                    <span className="font-semibold text-text-heading">
                      {value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary flex items-center gap-1">
                    <Minus className="w-3 h-3 text-status-error" /> Total
                    Deductions
                  </span>
                  <span className="font-semibold text-status-error">
                    {fmtAED(totalDeductions)}
                  </span>
                </div>
                <div className="border-t border-border pt-3.5 flex justify-between">
                  <span className="text-sm font-bold text-text-heading">
                    Total Net Pay
                  </span>
                  <span className="text-xl font-black text-secondary">
                    {fmtAED(totalNet)}
                  </span>
                </div>
              </div>
            </Card>

            <div className="bg-status-info-bg border border-status-info-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-status-info shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary leading-relaxed">
                  Once approved, this payroll run is saved. Ensure all amounts
                  are correct before processing.
                </p>
              </div>
            </div>

            <button
              onClick={handleRunPayroll}
              disabled={processing || employees.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-brand hover:bg-brand-hover text-on-brand rounded-xl font-bold text-sm transition-all hover:shadow-raised disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-brand border-t-transparent rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Approve & Process Payroll
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
