"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  ArrowRight,
  Clock,
  CheckCircle2,
  DollarSign,
  Banknote,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import StatCard from "@/components/stat-card/StatCard";
import EmptyState from "@/components/empty-state/EmptyState";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/select";
import { DUMMY_RUNS } from "@/types/payroll.dummy";
import { PayrollRun, fmtAED, fmtMonth } from "@/types/payroll.types";

export default function PayrollHistoryPage() {
  const router = useRouter();
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "approved" | "processed"
  >("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setRuns([...DUMMY_RUNS].sort((a, b) => b.month.localeCompare(a.month)));
    setLoading(false);
  };

  const processedRuns = runs.filter((r) => r.status === "processed");
  const pendingRuns = runs.filter(
    (r) => r.status === "draft" || r.status === "approved",
  );
  const totalPaid = processedRuns.reduce((s, r) => s + r.total_amount, 0);
  const avgMonthly =
    processedRuns.length > 0 ? totalPaid / processedRuns.length : 0;

  const statCards = [
    {
      icon: <FileText className="w-5 h-5" />,
      iconBg: "bg-status-info-bg",
      iconColor: "text-status-info",
      badgeText: `${runs.length} total`,
      badgeBg: "bg-status-info-bg",
      badgeColor: "text-status-info",
      title: "Total Runs",
      value: String(runs.length),
      subtitle: "All payroll cycles",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      iconBg: "bg-status-success-bg",
      iconColor: "text-status-success",
      badgeText: "done",
      badgeBg: "bg-status-success-bg",
      badgeColor: "text-status-success",
      title: "Processed",
      value: String(processedRuns.length),
      subtitle: "Completed payrolls",
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      iconBg: "bg-status-warning-bg",
      iconColor: "text-status-warning",
      badgeText: "pending",
      badgeBg: "bg-status-warning-bg",
      badgeColor: "text-status-warning",
      title: "Pending",
      value: String(pendingRuns.length),
      subtitle: "Draft or approved",
    },
    {
      icon: <Banknote className="w-5 h-5" />,
      iconBg: "bg-brand-light",
      iconColor: "text-secondary",
      badgeText: "cumulative",
      badgeBg: "bg-brand-light",
      badgeColor: "text-secondary",
      title: "Total Paid Out",
      value: totalPaid > 0 ? `AED ${(totalPaid / 1000).toFixed(0)}K` : "—",
      subtitle: `Avg ${avgMonthly > 0 ? fmtAED(Math.round(avgMonthly)) : "—"}/mo`,
    },
  ];

  const statusMeta: Record<
    string,
    {
      icon: React.ReactNode;
      color: string;
      bg: string;
      border: string;
      label: string;
    }
  > = {
    draft: {
      icon: <Clock className="w-3.5 h-3.5" />,
      color: "text-status-warning",
      bg: "bg-status-warning-bg",
      border: "border-status-warning-border",
      label: "Draft",
    },
    approved: {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      color: "text-status-info",
      bg: "bg-status-info-bg",
      border: "border-status-info-border",
      label: "Approved",
    },
    processed: {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      color: "text-status-success",
      bg: "bg-status-success-bg",
      border: "border-status-success-border",
      label: "Processed",
    },
  };

  const filteredRuns =
    statusFilter === "all"
      ? runs
      : runs.filter((run) => run.status === statusFilter);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <PageHeader
          title="Payroll History"
          description="View all past payroll runs and download payslips"
          icon={<FileText size={24} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border bg-surface">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-text-heading flex items-center gap-2">
                  <FileText className="w-5 h-5 text-text-heading" />
                  Payroll Run Archive
                </h2>
                <p className="text-text-secondary mt-1">
                  Review processed cycles, pending runs, and payroll totals in
                  one place
                </p>
              </div>
              <Select
                value={statusFilter}
                onChange={(value) =>
                  setStatusFilter(
                    value as "all" | "draft" | "approved" | "processed",
                  )
                }
                options={[
                  { value: "all", label: "All Status" },
                  { value: "draft", label: "Draft" },
                  { value: "approved", label: "Approved" },
                  { value: "processed", label: "Processed" },
                ]}
                className="w-full sm:w-48"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-16">
              <LoadingSpinner size="w-8 h-8" />
            </div>
          ) : filteredRuns.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={
                statusFilter === "all"
                  ? "No payroll runs yet"
                  : "No payroll runs match this status"
              }
              description={
                statusFilter === "all"
                  ? "Process your first payroll to see history here"
                  : "Try another status filter or process a new payroll run"
              }
              ctaLabel="Run Payroll"
              onCTAClick={() => router.push("/dashboard/payroll/run")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand">
                  <tr>
                    {[
                      "Month",
                      "Employees",
                      "Total Net Pay",
                      "Status",
                      "Processed Date",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {filteredRuns.map((run) => {
                    const meta = statusMeta[run.status];
                    return (
                      <tr
                        key={run.uuid}
                        className="hover:bg-brand-light/30 transition-all duration-200 cursor-pointer group"
                        onClick={() =>
                          router.push(`/dashboard/payroll/history/${run.uuid}`)
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-status-info-bg rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-light transition-colors duration-200">
                              <DollarSign className="w-4 h-4 text-secondary" />
                            </div>
                            <span className="text-sm font-semibold text-text-heading">
                              {fmtMonth(run.month)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-text-secondary">
                            {run.employee_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-text-heading">
                            {fmtAED(run.total_amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}
                          >
                            {meta.icon}
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-text-muted">
                            {run.processed_date
                              ? new Date(run.processed_date).toLocaleDateString(
                                  "en-AE",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors duration-200" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
