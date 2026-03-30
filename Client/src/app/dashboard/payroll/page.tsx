"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  ShieldCheck,
  PlayCircle,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Banknote,
  DollarSign,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import StatCard from "@/components/stat-card/StatCard";
import SectionCard from "@/components/section-card/SectionCard";
import EmptyState from "@/components/empty-state/EmptyState";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import { useSubscription } from "@/context/SubscriptionContext";
import { DUMMY_EMPLOYEES, DUMMY_RUNS } from "@/types/payroll.dummy";
import {
  Employee,
  PayrollRun,
  fmtAED,
  fmtMonth,
  currentYearMonth,
  computeGross,
} from "@/types/payroll.types";
import UpgradeLimitModal from "@/components/upgrade_limit_modal/UpgradeLimitModal";

export default function PayrollHub() {
  const router = useRouter();
  const { features, currentPlan, isLoading: subLoading } = useSubscription();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!subLoading && features !== null && !features?.payroll_reminders) {
      setShowUpgrade(true);
    }
  }, [subLoading, features]);

  useEffect(() => {
    if (subLoading) return;
    loadData();
  }, [subLoading]);

  const loadData = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setEmployees(DUMMY_EMPLOYEES);
    setRuns([...DUMMY_RUNS].sort((a, b) => b.month.localeCompare(a.month)));
    setLoading(false);
  };

  const activeEmployees = employees.filter((e) => e.status === "active");
  const totalMonthlyCost = activeEmployees.reduce(
    (s, e) => s + computeGross(e),
    0,
  );
  const recentRuns = runs.slice(0, 4);
  const currentMonth = currentYearMonth();
  const thisMonthRun = runs.find((r) => r.month === currentMonth);
  const pendingRuns = runs.filter((r) => r.status === "draft").length;

  const today = new Date();
  const payDate = new Date(today.getFullYear(), today.getMonth(), 25);
  if (payDate < today) payDate.setMonth(payDate.getMonth() + 1);
  const daysUntil = Math.ceil(
    (payDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const statusMeta: Record<
    string,
    { icon: React.ReactNode; color: string; bg: string; border: string }
  > = {
    draft: {
      icon: <Clock className="w-3.5 h-3.5" />,
      color: "text-status-warning",
      bg: "bg-status-warning-bg",
      border: "border-status-warning-border",
    },
    approved: {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      color: "text-status-info",
      bg: "bg-status-info-bg",
      border: "border-status-info-border",
    },
    processed: {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      color: "text-status-success",
      bg: "bg-status-success-bg",
      border: "border-status-success-border",
    },
  };

  const statCards = [
    {
      icon: <Users className="w-5 h-5" />,
      iconBg: "bg-status-info-bg",
      iconColor: "text-status-info",
      badgeText: `${activeEmployees.length} active`,
      badgeBg: "bg-status-info-bg",
      badgeColor: "text-status-info",
      title: "Total Employees",
      value: String(employees.length),
      subtitle: "On payroll",
    },
    {
      icon: <Banknote className="w-5 h-5" />,
      iconBg: "bg-status-success-bg",
      iconColor: "text-status-success",
      badgeText: "Monthly",
      badgeBg: "bg-status-success-bg",
      badgeColor: "text-status-success",
      title: "Monthly Payroll",
      value:
        totalMonthlyCost > 0
          ? `AED ${(totalMonthlyCost / 1000).toFixed(1)}K`
          : "—",
      subtitle: "Gross cost",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      iconBg: "bg-status-warning-bg",
      iconColor: "text-status-warning",
      badgeText: `${daysUntil}d`,
      badgeBg: "bg-status-warning-bg",
      badgeColor: "text-status-warning",
      title: "Next Payroll",
      value: `25 ${payDate.toLocaleDateString("en-US", { month: "short" })}`,
      subtitle: `${daysUntil} days remaining`,
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      iconBg: "bg-brand-light",
      iconColor: "text-secondary",
      badgeText: pendingRuns > 0 ? `${pendingRuns} pending` : "All clear",
      badgeBg:
        pendingRuns > 0 ? "bg-status-warning-bg" : "bg-status-success-bg",
      badgeColor:
        pendingRuns > 0 ? "text-status-warning" : "text-status-success",
      title: "WPS Status",
      value: pendingRuns > 0 ? "Action needed" : "Compliant",
      subtitle: "UAE Wage Protection",
    },
  ];

  if (subLoading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <PageHeader
          title="Payroll Management"
          description="Process salaries, manage employees, and stay WPS-compliant"
          showAIBadge
          icon={<Banknote size={24} />}
          buttons={[
            {
              text: "Add Employee",
              icon: <Plus size={18} />,
              onClick: () => router.push("/dashboard/payroll/employees/add"),
            },
            {
              text: "Run Payroll",
              icon: <PlayCircle size={18} />,
              onClick: () => router.push("/dashboard/payroll/run"),
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <LoadingSpinner size="w-8 h-8" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* This month */}
              <SectionCard title="This Month's Payroll" icon={Calendar}>
                {thisMonthRun ? (
                  <div className="flex items-center justify-between p-4 bg-bg-base rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-bold text-text-heading">
                        {fmtMonth(thisMonthRun.month)}
                      </p>
                      <p className="text-sm text-text-secondary mt-1">
                        {thisMonthRun.employee_count} employees ·{" "}
                        {fmtAED(thisMonthRun.total_amount)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${statusMeta[thisMonthRun.status].bg} ${statusMeta[thisMonthRun.status].color} ${statusMeta[thisMonthRun.status].border}`}
                      >
                        {statusMeta[thisMonthRun.status].icon}
                        {thisMonthRun.status.charAt(0).toUpperCase() +
                          thisMonthRun.status.slice(1)}
                      </span>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/payroll/history/${thisMonthRun.uuid}`,
                          )
                        }
                        className="text-sm text-secondary font-semibold hover:underline flex items-center gap-1"
                      >
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-8">
                    <PlayCircle className="w-12 h-12 text-border mb-3" />
                    <p className="text-sm font-semibold text-text-heading mb-1">
                      Payroll not run yet for {fmtMonth(currentMonth)}
                    </p>
                    <p className="text-sm text-text-muted mb-4">
                      Process this month&apos;s salaries for{" "}
                      {activeEmployees.length} active employee
                      {activeEmployees.length !== 1 ? "s" : ""}.
                    </p>
                    <button
                      onClick={() => router.push("/dashboard/payroll/run")}
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-on-brand rounded-lg font-semibold text-sm transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" /> Run Payroll Now
                    </button>
                  </div>
                )}
              </SectionCard>

              {/* Recent runs */}
              <SectionCard title="Recent Payroll Runs" icon={TrendingUp}>
                {recentRuns.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No payroll runs yet"
                    description="Run your first payroll to see history here."
                  />
                ) : (
                  <div className="divide-y divide-border">
                    {recentRuns.map((run) => (
                      <div
                        key={run.uuid}
                        className="flex items-center justify-between py-3.5 px-2 hover:bg-bg-base rounded-lg cursor-pointer transition-colors"
                        onClick={() =>
                          router.push(`/dashboard/payroll/history/${run.uuid}`)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-brand-light rounded-xl flex items-center justify-center shrink-0">
                            <DollarSign className="w-4 h-4 text-secondary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-heading">
                              {fmtMonth(run.month)}
                            </p>
                            <p className="text-xs text-text-muted">
                              {run.employee_count} employees
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-text-heading">
                            {fmtAED(run.total_amount)}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusMeta[run.status].bg} ${statusMeta[run.status].color} ${statusMeta[run.status].border}`}
                          >
                            {statusMeta[run.status].icon}
                            {run.status.charAt(0).toUpperCase() +
                              run.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard title="Quick Actions" icon={PlayCircle}>
                <div className="space-y-2">
                  {[
                    {
                      label: "Run This Month's Payroll",
                      icon: <PlayCircle className="w-4 h-4" />,
                      path: "/dashboard/payroll/run",
                      bg: "bg-brand text-on-brand hover:bg-brand-hover",
                    },
                    {
                      label: "Add New Employee",
                      icon: <Plus className="w-4 h-4" />,
                      path: "/dashboard/payroll/employees/add",
                      bg: "bg-bg-base border border-border text-text-heading hover:border-border-strong hover:shadow-card",
                    },
                    {
                      label: "View All Employees",
                      icon: <Users className="w-4 h-4" />,
                      path: "/dashboard/payroll/employees",
                      bg: "bg-bg-base border border-border text-text-heading hover:border-border-strong hover:shadow-card",
                    },
                    {
                      label: "Payroll History",
                      icon: <FileText className="w-4 h-4" />,
                      path: "/dashboard/payroll/history",
                      bg: "bg-bg-base border border-border text-text-heading hover:border-border-strong hover:shadow-card",
                    },
                  ].map((a, i) => (
                    <button
                      key={i}
                      onClick={() => router.push(a.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${a.bg}`}
                    >
                      {a.icon}
                      {a.label}
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Departments" icon={Users}>
                {employees.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-4">
                    No employees yet
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {Object.entries(
                      employees.reduce<Record<string, number>>((acc, e) => {
                        acc[e.department] = (acc[e.department] || 0) + 1;
                        return acc;
                      }, {}),
                    ).map(([dept, count]) => (
                      <div
                        key={dept}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-text-secondary">
                          {dept}
                        </span>
                        <span className="text-xs font-bold text-secondary bg-brand-light border border-secondary/20 px-2.5 py-0.5 rounded-full">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <div className="bg-status-warning-bg border border-status-warning-border rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-text-heading mb-1">
                      WPS Deadline
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      UAE WPS requires salaries paid by the{" "}
                      <strong>25th of each month</strong>. Late payments may
                      result in MoHRE penalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <UpgradeLimitModal
        isOpen={showUpgrade}
        onClose={() => {
          setShowUpgrade(false);
          router.push("/dashboard");
        }}
        featureLabel="Payroll Management"
        limitCount={0}
        planName={currentPlan?.name}
      />
    </DashboardLayout>
  );
}
