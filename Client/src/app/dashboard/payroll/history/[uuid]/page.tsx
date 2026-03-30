"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  Download,
  CheckCircle2,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import toast from "react-hot-toast";
import { DUMMY_RUNS } from "@/types/payroll.dummy";
import { PayrollRun, fmtAED, fmtMonth } from "@/types/payroll.types";

export default function PayrollRunDetailPage() {
  const router = useRouter();
  const params = useParams();
  const runId = params?.uuid as string;

  const [run, setRun] = useState<PayrollRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    loadRun();
  }, [runId]);

  const loadRun = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setRun(DUMMY_RUNS.find((r) => r.uuid === runId) || null);
    setLoading(false);
  };

  const handleApprove = async () => {
    setApproving(true);
    await new Promise((r) => setTimeout(r, 600));
    setRun((prev) =>
      prev
        ? {
            ...prev,
            status: "processed",
            processed_date: new Date().toISOString(),
          }
        : prev,
    );
    toast.success("Payroll approved and marked as processed!");
    setApproving(false);
  };

  const handleDownloadPayslip = (empName: string) => {
    toast.success(
      `Payslip for ${empName} will be available once backend API is ready`,
    );
  };

  const statusMeta = {
    draft: {
      icon: <Clock className="w-4 h-4" />,
      color: "text-status-warning",
      bg: "bg-status-warning-bg",
      border: "border-status-warning-border",
      label: "Draft",
    },
    approved: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-status-info",
      bg: "bg-status-info-bg",
      border: "border-status-info-border",
      label: "Approved",
    },
    processed: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-status-success",
      bg: "bg-status-success-bg",
      border: "border-status-success-border",
      label: "Processed",
    },
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  if (!run)
    return (
      <DashboardLayout>
        <div className="p-4 text-center py-20 text-text-muted">
          Payroll run not found.
        </div>
      </DashboardLayout>
    );

  const meta = statusMeta[run.status];

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <PageHeader
          title={`Payroll — ${fmtMonth(run.month)}`}
          description={`${run.employee_count} employees · ${fmtAED(run.total_amount)} total net pay`}
          icon={<FileText size={24} />}
          buttons={[
            {
              text: "Back to History",
              icon: <ArrowLeft size={18} />,
              onClick: () => router.push("/dashboard/payroll/history"),
            },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-border bg-surface">
                <h2 className="text-lg sm:text-xl font-bold text-text-heading flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-text-heading" />
                  Employee Breakdown
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Detailed gross, deductions, net pay, and bank details for
                  this payroll run
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-brand">
                    <tr>
                      {[
                        "Employee",
                        "Gross",
                        "Deductions",
                        "Net Pay",
                        "Bank",
                        "Payslip",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 sm:px-6 sm:py-4 text-left text-[11px] sm:text-xs font-medium text-on-brand uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-surface divide-y divide-border">
                    {run.employees.map((emp) => (
                      <tr
                        key={emp.employee_uuid}
                        className="hover:bg-brand-light/30 transition-all duration-200 group"
                      >
                        <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand flex items-center justify-center text-on-brand text-[11px] sm:text-xs font-bold shrink-0">
                              {emp.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-text-heading">
                                {emp.full_name}
                              </p>
                              <p className="text-xs sm:text-sm text-text-muted">
                                {emp.designation}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span className="text-xs sm:text-sm font-medium text-text-heading">
                            {fmtAED(emp.gross_salary)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span
                            className={`text-xs sm:text-sm font-medium ${emp.deductions > 0 ? "text-status-error" : "text-text-muted"}`}
                          >
                            {emp.deductions > 0
                              ? `- ${fmtAED(emp.deductions)}`
                              : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span className="text-xs sm:text-sm font-bold text-status-success">
                            {fmtAED(emp.net_salary)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div>
                            <p className="text-xs font-semibold text-text-heading">
                              {emp.bank_name}
                            </p>
                            <p className="text-[11px] sm:text-xs text-text-muted font-mono">
                              {emp.iban.slice(0, 12)}…
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDownloadPayslip(emp.full_name)}
                            className="inline-flex items-center gap-1.5 px-2 py-1.5 sm:p-2 text-[11px] sm:text-xs font-semibold text-secondary hover:text-brand-hover hover:bg-brand-light rounded-lg transition-all duration-200"
                          >
                            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {run.employees.some((e) => e.notes) && (
                <div className="px-4 py-4 sm:px-6 sm:py-5 border-t border-border space-y-2">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
                    Notes
                  </p>
                  {run.employees
                    .filter((e) => e.notes)
                    .map((e) => (
                      <div
                        key={e.employee_uuid}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="font-semibold text-text-heading shrink-0">
                          {e.full_name}:
                        </span>
                        <span className="text-text-secondary">{e.notes}</span>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold text-text-heading mb-5">
                Run Summary
              </h3>
              <div className="space-y-3.5">
                {[
                  { label: "Month", value: fmtMonth(run.month) },
                  { label: "Employees", value: String(run.employee_count) },
                  { label: "Total Net", value: fmtAED(run.total_amount) },
                  {
                    label: "Deductions",
                    value: fmtAED(
                      run.employees.reduce((s, e) => s + e.deductions, 0),
                    ),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{label}</span>
                    <span className="font-semibold text-text-heading">
                      {value}
                    </span>
                  </div>
                ))}
                {run.processed_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Processed</span>
                    <span className="font-semibold text-text-heading">
                      {new Date(run.processed_date).toLocaleDateString(
                        "en-AE",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                )}
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>
                </div>
              </div>
            </Card>

            {run.status === "draft" && (
              <button
                onClick={handleApprove}
                disabled={approving}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-brand hover:bg-brand-hover text-on-brand rounded-xl font-bold text-sm transition-all hover:shadow-raised disabled:opacity-50"
              >
                {approving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-brand border-t-transparent rounded-full animate-spin" />
                    Approving…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Approve Payroll
                  </>
                )}
              </button>
            )}

            {run.status === "processed" && (
              <button
                onClick={() =>
                  toast.success(
                    "WPS report download will be available once backend is ready",
                  )
                }
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-brand hover:bg-brand-hover text-on-brand rounded-xl font-bold text-sm transition-all hover:shadow-raised"
              >
                <Download className="w-4 h-4" />
                Download WPS Report
              </button>
            )}

            <Card>
              <h3 className="text-base font-bold text-text-heading mb-4">
                By Department
              </h3>
              <div className="space-y-2.5">
                {Object.entries(
                  run.employees.reduce<Record<string, number>>((acc, e) => {
                    acc[e.department] = (acc[e.department] || 0) + e.net_salary;
                    return acc;
                  }, {}),
                ).map(([dept, total]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{dept}</span>
                    <span className="text-sm font-semibold text-text-heading">
                      {fmtAED(total)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
