"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  type PieLabelRenderProps,
} from "recharts";
import {
  DollarSign,
  FileText,
  Clock,
  MessageSquare,
  Loader2,
} from "lucide-react";
import StatCard from "@/components/stat-card/StatCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";


// ─── Types ───────────────────────────────────────────────────────────────────

interface Invoice {
  uuid: string;
  id: number;
  user_id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  status: string; // "draft" | "paid" | "pending" | "overdue"
  custom_fields: object[];
  invoice_items: object[];
  created_at: string;
  updated_at: string;
}

interface AiReminder {
  uuid: string;
  id: number;
  user_id: string;
  title: string;
  description?: string;
  type: "VAT" | "License" | "Payroll" | "Custom";
  reminder_date: string;
  notify_before: number;
  notify_channels: { email: boolean; whatsapp: boolean; push: boolean };
  notified: boolean;
  recurrence_rule: "none" | "monthly" | "quarterly" | "yearly";
  status: "pending" | "sent" | "completed" | "missed";
  created_at: string;
  updated_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const safeNum = (v: unknown): number => {
  const n = parseFloat(String(v ?? "0"));
  return isNaN(n) ? 0 : n;
};

const safeDate = (v: unknown): Date | null => {
  if (!v) return null;
  const str = String(v).includes("T") ? String(v) : `${String(v)}T00:00:00`;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

function buildRevenueData(invoices: Invoice[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();

  const map: Record<string, number> = {};
  for (let m = 0; m < 12; m++) map[String(m).padStart(2, "0")] = 0;

  invoices.forEach((inv) => {
    const date = safeDate(inv.invoice_date);
    if (!date) return;
    if (date.getFullYear() !== currentYear) return;
    const mKey = String(date.getMonth()).padStart(2, "0");
    if ((inv.status || "").toLowerCase().trim() === "paid")
      map[mKey] += safeNum(inv.total);
  });

  return Object.keys(map)
    .sort()
    .map((mKey) => {
      const monthIdx = parseInt(mKey, 10);
      return {
        month: MONTH_LABELS[monthIdx],
        revenue: monthIdx <= currentMonthIdx ? map[mKey] : null,
      };
    });
}

function buildInvoiceStatusData(invoices: Invoice[]) {
  const counts: Record<string, number> = {
    paid: 0,
    pending: 0,
    overdue: 0,
    draft: 0,
  };
  invoices.forEach((inv) => {
    const s = (inv.status || "draft").toLowerCase().trim();
    counts[s] = (counts[s] || 0) + 1;
  });

  const colorMap: Record<string, string> = {
    paid: "var(--color-status-success)",
    pending: "var(--color-status-warning)",
    overdue: "var(--color-status-error)",
    draft: "var(--color-text-muted)",
  };

  const all = Object.entries(counts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: colorMap[name] || "var(--color-status-info)",
  }));

  return {
    pieData: all.filter((d) => d.value > 0),
    legendData: all,
  };
}

function buildInvoicePatternData(invoices: Invoice[]) {
  const counts: Record<string, number> = {
    Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0,
  };

  invoices.forEach((inv) => {
    const date = safeDate(inv.created_at);
    if (!date) return;
    const day = DAY_LABELS[date.getDay()];
    counts[day] = (counts[day] || 0) + 1;
  });

  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    count: counts[day] || 0,
  }));
}

function buildSummary(invoices: Invoice[]) {
  const totalRevenue = invoices
    .filter((i) => (i.status || "").toLowerCase().trim() === "paid")
    .reduce((sum, i) => sum + safeNum(i.total), 0);

  const activeInvoices = invoices.filter(
    (i) => (i.status || "").toLowerCase() !== "draft",
  ).length;

  const pendingPayments = invoices
    .filter((i) => (i.status || "").toLowerCase().trim() !== "paid")
    .reduce((sum, i) => sum + safeNum(i.total), 0);

  return { totalRevenue, activeInvoices, pendingPayments };
}

/**
 * Build Reminder Completion data for the current week (Mon→Sun).
 * Uses real reminder data from the API, counting reminders whose
 * reminder_date falls within the current Mon–Sun week.
 */
function buildReminderWeekData(reminders: AiReminder[]) {
  const now = new Date();
  // Find Monday of the current week
  const todayDow = now.getDay(); // 0=Sun…6=Sat
  const diffToMonday = todayDow === 0 ? -6 : 1 - todayDow;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const todayIdx = todayDow === 0 ? 6 : todayDow - 1; // Mon=0…Sun=6

  // Build per-day buckets for Mon(0) → Sun(6)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (dayLabel, i) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const dayStart = new Date(dayDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Only count days up to today
      if (i > todayIdx) {
        return { day: dayLabel, completed: 0, missed: 0, total: 0 };
      }

      const dayReminders = reminders.filter((r) => {
        const rd = safeDate(r.reminder_date);
        return rd && rd >= dayStart && rd <= dayEnd;
      });

      const completed = dayReminders.filter(
        (r) => r.status === "completed",
      ).length;
      const missed = dayReminders.filter((r) => r.status === "missed").length;
      const total = dayReminders.length;

      return { day: dayLabel, completed, missed, total };
    },
  );

  const totalCompleted = days.reduce((s, d) => s + d.completed, 0);
  const totalMissed = days.reduce((s, d) => s + d.missed, 0);
  const totalAll = days.reduce((s, d) => s + d.total, 0);

  return {
    days,
    completed: totalCompleted,
    missed: totalMissed,
    total: totalAll,
    todayIdx,
  };
}

// ─── Shared pie label renderer — typed with PieLabelRenderProps ──────────────
const renderPiePercent = ({ percent }: PieLabelRenderProps) =>
  `${(((percent as number) || 0) * 100).toFixed(0)}%`;

// ─── Component ────────────────────────────────────────────────────────────────

const AnalyticsPage = () => {
  const { user } = useAuth();
  const userId = user?.user?.user_id;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reminders, setReminders] = useState<AiReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remindersError, setRemindersError] = useState<string | null>(null);

  // ── Fetch invoices ──────────────────────────────────────────────────────────
  const fetchInvoices = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/invoices/user/${userId}`);
      const list: Invoice[] = res.data?.response || res.data || [];
      setInvoices(list);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Fetch reminders ─────────────────────────────────────────────────────────
  const fetchReminders = useCallback(async () => {
    if (!userId) return;
    try {
      setRemindersLoading(true);
      setRemindersError(null);
      // GET /ai_reminder/user/:id — returns all reminders for the given user
      const res = await axiosInstance.get(`/ai_reminder/user/${userId}`);
      const list: AiReminder[] = res.data?.response || res.data || [];
      setReminders(list);
    } catch (err: unknown) {
      setRemindersError((err as Error)?.message || "Failed to load reminders.");
    } finally {
      setRemindersLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInvoices();
    fetchReminders();
  }, [fetchInvoices, fetchReminders]);

  // ── Derived / dynamic data ──────────────────────────────────────────────────
  const revenueData = buildRevenueData(invoices);
  const { pieData: invoiceStatusPie, legendData: invoiceStatusLegend } =
    buildInvoiceStatusData(invoices);
  const invoicePatternData = buildInvoicePatternData(invoices);
  const summary = buildSummary(invoices);

  // DYNAMIC — built from real API reminder data
  const reminderWeek = buildReminderWeekData(reminders);

  const formatAED = (val: number) =>
    val >= 1000 ? `AED ${(val / 1000).toFixed(1)}K` : `AED ${val.toFixed(0)}`;

  // ── Static data ────────────────────────────────────────────────────────────

  const aiWeekData = (() => {
    const now = new Date();
    const todayDow = now.getDay();
    const todayIdx = todayDow === 0 ? 6 : todayDow - 1;
    const baseCounts = [24, 31, 18, 42, 27, 9, 5];
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
      day,
      queries: i <= todayIdx ? baseCounts[i] : 0,
      isToday: i === todayIdx,
    }));
  })();

  const myExpenseData = [
    { category: "Office Rent",        amount: 3200, color: "var(--color-secondary)" },
    { category: "Software & Tools",   amount: 1800, color: "#7c3aed" },
    { category: "Marketing",          amount: 2400, color: "#db2777" },
    { category: "Utilities",          amount: 800,  color: "var(--color-status-warning)" },
    { category: "Miscellaneous",      amount: 1600, color: "var(--color-status-success)" },
  ];

  // ── Stat cards ────────────────────────────────────────────────────────────
  const statCardsData = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      iconBg: "bg-status-success-bg",
      iconColor: "text-status-success",
      badgeText: "+14.6%",
      badgeBg: "bg-status-success-bg",
      badgeColor: "text-status-success",
      title: "My Total Revenue",
      value: loading ? "—" : formatAED(summary.totalRevenue),
      subtitle: "Year to date",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      iconBg: "bg-status-info-bg",
      iconColor: "text-status-info",
      badgeText: "+37.5%",
      badgeBg: "bg-status-info-bg",
      badgeColor: "text-status-info",
      title: "My Invoices",
      value: loading ? "—" : String(summary.activeInvoices),
      subtitle: "Active invoices",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      iconBg: "bg-status-warning-bg",
      iconColor: "text-status-warning",
      badgeText: "-22.1%",
      badgeBg: "bg-status-error-bg",
      badgeColor: "text-status-error",
      title: "Pending Payments",
      value: loading ? "—" : formatAED(summary.pendingPayments),
      subtitle: "Awaiting clearance",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      iconBg: "bg-brand-light",
      iconColor: "text-secondary",
      badgeText: "+45.8%",
      badgeBg: "bg-status-success-bg",
      badgeColor: "text-status-success",
      title: "AI Queries Used",
      value: "173",
      subtitle: "This month",
    },
  ];

  // ── Loading / error overlay helpers ──────────────────────────────────────
  const ChartLoader = () => (
    <div className="flex items-center justify-center h-[300px] gap-2 text-text-muted">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Loading data…</span>
    </div>
  );

  const ChartError = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-[300px]">
      <p className="text-sm text-status-error">{message}</p>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="p-4 min-h-screen mb-4">
        {/* Header */}
        <PageHeader
          title="My Business Analytics"
          description="Welcome back! Here's what's happening with your business today."
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCardsData.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              iconBg={card.iconBg}
              iconColor={card.iconColor}
              badgeText={card.badgeText}
              badgeBg={card.badgeBg}
              badgeColor={card.badgeColor}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
            />
          ))}
        </div>

        {/* Row 1 — Revenue (wide) + Invoice Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* ── Revenue Growth (DYNAMIC) ───────────────────────────────── */}
          <div className="lg:col-span-2 bg-surface rounded-xl p-6 shadow-card border border-border">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-text-heading mb-1">
                  Revenue Growth
                </h2>
                <p className="text-text-muted text-sm">
                  Total invoice amounts by month
                </p>
              </div>
              <div className="text-end">
                <h5 className="text-lg font-bold text-text-heading mb-1">
                  {loading ? "—" : formatAED(summary.totalRevenue)}
                </h5>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-status-success-bg text-status-success border border-status-success-border">
                  +14.6%
                </span>
              </div>
            </div>

            {loading ? (
              <ChartLoader />
            ) : error ? (
              <ChartError message={error} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="var(--color-secondary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-text-muted)"
                    style={{ fontSize: "12px" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--color-text-muted)"
                    style={{ fontSize: "12px" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "var(--shadow-raised)",
                    }}
                    formatter={(value) =>
                      value !== null
                        ? [`AED ${Number(value).toLocaleString()}`, ""]
                        : ["—", ""]
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-secondary)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Total Revenue"
                    dot={false}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── My Invoice Status (DYNAMIC) ───────────────────────────── */}
          <div className="bg-surface rounded-xl p-6 shadow-card border border-border">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-text-heading mb-1">
                My Invoice Status
              </h2>
              <p className="text-text-muted text-sm">
                Current status of your invoices
              </p>
            </div>

            {loading ? (
              <ChartLoader />
            ) : error ? (
              <ChartError message={error} />
            ) : (
              <div className="flex flex-col items-center">
                {invoiceStatusPie.length === 0 ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <p className="text-sm text-text-muted">No invoices yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={invoiceStatusPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        labelLine={false}
                        label={renderPiePercent}
                        dataKey="value"
                      >
                        {invoiceStatusPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          boxShadow: "var(--shadow-raised)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="w-full space-y-2 mt-2">
                  {invoiceStatusLegend.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-2.5 h-2.5 rounded-full mr-2.5"
                          style={{
                            backgroundColor:
                              item.value > 0 ? item.color : "var(--color-border)",
                          }}
                        />
                        <span
                          className={`text-xs ${item.value > 0 ? "text-text-secondary" : "text-text-muted"}`}
                        >
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-semibold ${item.value > 0 ? "text-text-heading" : "text-text-muted"}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 2 — AI Usage full width */}
        <div className="mb-6">
          <div className="bg-surface rounded-xl p-6 shadow-card border border-border">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-text-heading mb-1">
                  AI Usage This Week
                </h2>
                <p className="text-text-muted text-sm">
                  Daily AI queries — current week
                </p>
              </div>
              <div className="text-end">
                <h5 className="text-lg font-bold text-text-heading mb-1">
                  {aiWeekData.reduce((s, d) => s + d.queries, 0)} queries
                </h5>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-light text-secondary border border-border">
                  This week
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={aiWeekData} barSize={32}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="var(--color-text-muted)"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-text-muted)"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "var(--shadow-raised)",
                  }}
                  formatter={(value) => [value, "Queries"]}
                />
                <Bar dataKey="queries" radius={[6, 6, 0, 0]} name="Queries">
                  {aiWeekData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.isToday
                          ? "var(--color-brand)"
                          : entry.queries === Math.max(...aiWeekData.map((d) => d.queries))
                            ? "var(--color-secondary)"
                            : "var(--color-status-info-border)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3 justify-center">
              {[
                { color: "var(--color-brand)",               label: "Today" },
                { color: "var(--color-secondary)",           label: "Peak day" },
                { color: "var(--color-status-info-border)",  label: "Other days" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-[11px] text-text-muted">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3 — Expense Breakdown + Reminder Completion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* ── My Expense Breakdown (STATIC) ────────────────────────────── */}
          <div className="bg-surface rounded-xl p-6 shadow-card border border-border">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text-heading mb-1">
                My Expense Breakdown
              </h2>
              <p className="text-text-muted text-sm">
                Where your money is going
              </p>
            </div>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={myExpenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {myExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "var(--shadow-raised)",
                    }}
                    formatter={(value) => [`AED ${value}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3 ml-6">
                {myExpenseData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-text-secondary">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-text-heading">
                      AED {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Reminder Completion (DYNAMIC) ────────────────────────────── */}
          <div className="bg-surface rounded-xl p-6 shadow-card border border-border">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text-heading mb-1">
                Reminder Completion
              </h2>
              <p className="text-text-muted text-sm">
                Current week — completed vs missed
              </p>
            </div>

            {remindersLoading ? (
              <div className="flex items-center justify-center h-[250px] gap-2 text-text-muted">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading reminders…</span>
              </div>
            ) : remindersError ? (
              <div className="flex items-center justify-center h-[250px]">
                <p className="text-sm text-status-error">{remindersError}</p>
              </div>
            ) : (
              <div className="flex items-center">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed", value: reminderWeek.completed },
                        { name: "Missed",    value: reminderWeek.missed },
                      ].filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      paddingAngle={2}
                      labelLine={false}
                      label={renderPiePercent}
                    >
                      <Cell fill="var(--color-status-success)" />
                      <Cell fill="var(--color-status-error)" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        boxShadow: "var(--shadow-raised)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {reminderWeek.total === 0 ? (
                  <div className="flex-1 flex items-center justify-center ml-6">
                    <p className="text-sm text-text-muted text-center">
                      No reminders
                      <br />
                      scheduled this week
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 space-y-3 ml-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3 bg-status-success" />
                        <span className="text-sm text-text-secondary">Completed</span>
                      </div>
                      <span className="text-sm font-semibold text-text-heading">
                        {reminderWeek.completed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3 bg-status-error" />
                        <span className="text-sm text-text-secondary">Missed</span>
                      </div>
                      <span className="text-sm font-semibold text-text-heading">
                        {reminderWeek.missed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                      <span className="text-sm text-text-muted">Total</span>
                      <span className="text-sm font-semibold text-text-heading">
                        {reminderWeek.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">Completion rate</span>
                      <span className="text-sm font-bold text-status-success">
                        {reminderWeek.total > 0
                          ? Math.round(
                              (reminderWeek.completed / reminderWeek.total) * 100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Row 4 — Invoice Creation Pattern full width */}
        <div className="mb-6">
          <div className="bg-surface rounded-xl p-6 shadow-card border border-border">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text-heading mb-1">
                My Invoice Creation Pattern
              </h2>
              <p className="text-text-muted text-sm">
                When you typically create invoices during the week
              </p>
            </div>
            {loading ? (
              <ChartLoader />
            ) : error ? (
              <ChartError message={error} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={invoicePatternData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="var(--color-text-muted)"
                    style={{ fontSize: "12px" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--color-text-muted)"
                    style={{ fontSize: "12px" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "var(--shadow-raised)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                    name="Invoices Created"
                  >
                    {invoicePatternData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.count ===
                          Math.max(...invoicePatternData.map((d) => d.count))
                            ? "var(--color-brand)"
                            : "var(--color-secondary)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;