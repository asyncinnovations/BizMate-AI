"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  UserCircle,
  ArrowLeft,
  Save,
  Edit2,
  DollarSign,
  Building2,
  CreditCard,
  User,
  FileText,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import Card from "@/components/ui/Card";
import SectionCard from "@/components/section-card/SectionCard";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/select";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import toast from "react-hot-toast";
import { DUMMY_EMPLOYEES, DUMMY_RUNS } from "@/types/payroll.dummy";
import {
  Employee,
  ContractType,
  DEPARTMENTS,
  CONTRACT_TYPE_LABELS,
  fmtAED,
  computeGross,
  fmtMonth,
} from "@/types/payroll.types";

function SectionHead({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-light shrink-0">
        <Icon className="w-4 h-4 text-secondary" />
      </div>
      <h3 className="text-sm font-bold text-text-heading uppercase tracking-widest">
        {title}
      </h3>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm text-text-heading">{value || "—"}</p>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const empId = params?.uuid as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Employee>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Payslip history derived from dummy runs
  const payslips = DUMMY_RUNS.flatMap((run) =>
    run.employees
      .filter((e) => e.employee_uuid === empId)
      .map((e) => ({
        month: run.month,
        net_salary: e.net_salary,
        run_uuid: run.uuid,
      })),
  ).sort((a, b) => b.month.localeCompare(a.month));

  useEffect(() => {
    loadEmployee();
  }, [empId]);

  const loadEmployee = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const emp = DUMMY_EMPLOYEES.find((e) => e.uuid === empId) || null;
    setEmployee(emp);
    setForm(emp ? { ...emp } : {});
    setLoading(false);
  };

  const set = (key: keyof Employee, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setEmployee((prev) => (prev ? ({ ...prev, ...form } as Employee) : prev));
    setEditing(false);
    setSaving(false);
    toast.success("Employee updated successfully!");
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  if (!employee)
    return (
      <DashboardLayout>
        <div className="p-4 text-center py-20 text-text-muted">
          Employee not found.
        </div>
      </DashboardLayout>
    );

  const gross = computeGross(
    editing ? ({ ...employee, ...form } as Employee) : employee,
  );
  // const currentEmployee = editing
  //   ? ({ ...employee, ...form } as Employee)
  //   : employee;

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <PageHeader
          title={employee.full_name}
          description={`${employee.designation} · ${employee.department}`}
          icon={<UserCircle size={24} />}
          buttons={[
            {
              text: "Back",
              icon: <ArrowLeft size={18} />,
              onClick: () => router.back(),
            },
            editing
              ? {
                  text: "Cancel",
                  icon: <ArrowLeft size={18} />,
                  onClick: () => {
                    setEditing(false);
                    setForm({ ...employee });
                  },
                }
              : {
                  text: "Edit",
                  icon: <Edit2 size={18} />,
                  onClick: () => setEditing(true),
                },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Single card — all sections */}
          <div className="lg:col-span-2">
            <Card>
              {/* ── Personal ── */}
              <SectionHead icon={User} title="Personal Information" />
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Full Name"
                    name="full_name"
                    type="text"
                    required
                    value={String(form.full_name || "")}
                    onChange={(e) => set("full_name", e.target.value)}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={String(form.email || "")}
                    onChange={(e) => set("email", e.target.value)}
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    type="text"
                    value={String(form.phone || "")}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                  <InputField
                    label="Emirates ID"
                    name="emirates_id"
                    type="text"
                    value={String(form.emirates_id || "")}
                    onChange={(e) => set("emirates_id", e.target.value)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow label="Full Name" value={employee.full_name} />
                  <InfoRow label="Email" value={employee.email} />
                  <InfoRow label="Phone" value={employee.phone} />
                  <InfoRow label="Emirates ID" value={employee.emirates_id} />
                </div>
              )}

              <div className="border-t border-border my-7" />

              {/* ── Employment ── */}
              <SectionHead icon={Building2} title="Employment Details" />
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Designation"
                    name="designation"
                    type="text"
                    value={String(form.designation || "")}
                    onChange={(e) => set("designation", e.target.value)}
                  />
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                      Department
                    </label>
                    <Select
                      value={form.department || ""}
                      onChange={(value) => set("department", value)}
                      options={DEPARTMENTS.map((d) => ({
                        value: d,
                        label: d,
                      }))}
                      className="w-full"
                    />
                  </div>
                  <InputField
                    label="Joining Date"
                    name="joining_date"
                    type="date"
                    value={String(form.joining_date || "")}
                    onChange={(e) => set("joining_date", e.target.value)}
                  />
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                      Contract Type
                    </label>
                    <Select
                      value={form.contract_type || ""}
                      onChange={(value) =>
                        set("contract_type", value as ContractType)
                      }
                      options={[
                        { value: "full_time", label: "Full Time" },
                        { value: "part_time", label: "Part Time" },
                        { value: "contract", label: "Contract" },
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow label="Designation" value={employee.designation} />
                  <InfoRow label="Department" value={employee.department} />
                  <InfoRow
                    label="Joining Date"
                    value={new Date(employee.joining_date).toLocaleDateString(
                      "en-AE",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )}
                  />
                  <InfoRow
                    label="Contract Type"
                    value={CONTRACT_TYPE_LABELS[employee.contract_type]}
                  />
                </div>
              )}

              <div className="border-t border-border my-7" />

              {/* ── Salary ── */}
              <SectionHead icon={DollarSign} title="Salary Breakdown (AED)" />
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Basic Salary (AED)"
                    name="basic_salary"
                    type="number"
                    value={String(form.basic_salary || "")}
                    onChange={(e) => set("basic_salary", e.target.value)}
                  />
                  <InputField
                    label="Housing Allowance (AED)"
                    name="housing_allowance"
                    type="number"
                    value={String(form.housing_allowance || "")}
                    onChange={(e) => set("housing_allowance", e.target.value)}
                  />
                  <InputField
                    label="Transport Allowance (AED)"
                    name="transport_allowance"
                    type="number"
                    value={String(form.transport_allowance || "")}
                    onChange={(e) => set("transport_allowance", e.target.value)}
                  />
                  <InputField
                    label="Other Allowance (AED)"
                    name="other_allowance"
                    type="number"
                    value={String(form.other_allowance || "")}
                    onChange={(e) => set("other_allowance", e.target.value)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Basic", value: employee.basic_salary },
                    { label: "Housing", value: employee.housing_allowance },
                    { label: "Transport", value: employee.transport_allowance },
                    { label: "Other", value: employee.other_allowance },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-bg-base rounded-xl p-3 border border-border text-center"
                    >
                      <p className="text-xs text-text-muted mb-1">{label}</p>
                      <p className="text-sm font-bold text-text-heading">
                        {fmtAED(Number(value))}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-border my-7" />

              {/* ── Banking ── */}
              <SectionHead icon={CreditCard} title="Banking (WPS)" />
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Bank Name"
                    name="bank_name"
                    type="text"
                    value={String(form.bank_name || "")}
                    onChange={(e) => set("bank_name", e.target.value)}
                  />
                  <InputField
                    label="IBAN"
                    name="iban"
                    type="text"
                    value={String(form.iban || "")}
                    onChange={(e) => set("iban", e.target.value)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow label="Bank Name" value={employee.bank_name} />
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                      IBAN
                    </p>
                    <p className="text-sm text-text-heading font-mono">
                      {employee.iban || "—"}
                    </p>
                  </div>
                </div>
              )}

              {/* Save / cancel — only when editing */}
              {editing && (
                <>
                  <div className="border-t border-border my-6" />
                  <div className="flex gap-3">
                    <Button
                      className="bg-transparent border border-border text-text-secondary hover:bg-bg-base"
                      onClick={() => {
                        setEditing(false);
                        setForm({ ...employee });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSave}
                      disabled={saving}
                      startIcon={<Save className="w-4 h-4" />}
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gross cost card */}
            <Card>
              <h3 className="text-base font-bold text-text-heading mb-4">
                Monthly Cost
              </h3>
              <div className="text-center py-4">
                <p className="text-3xl font-black text-secondary">
                  {fmtAED(gross)}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Gross monthly salary
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
                <span className="text-text-secondary">Status</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${employee.status === "active" ? "bg-status-success-bg text-status-success border-status-success-border" : "bg-status-error-bg text-status-error border-status-error-border"}`}
                >
                  {employee.status.charAt(0).toUpperCase() +
                    employee.status.slice(1)}
                </span>
              </div>
            </Card>

            {/* Payslip history */}
            <SectionCard title="Payslip History" icon={FileText}>
              {payslips.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">
                  No payslips yet
                </p>
              ) : (
                <div className="space-y-2.5">
                  {payslips.map((slip, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-bg-base rounded-lg border border-border hover:border-border-strong cursor-pointer transition-colors"
                      onClick={() =>
                        router.push(
                          `/dashboard/payroll/history/${slip.run_uuid}`,
                        )
                      }
                    >
                      <span className="text-sm font-medium text-text-secondary">
                        {fmtMonth(slip.month)}
                      </span>
                      <span className="text-sm font-bold text-secondary">
                        {fmtAED(slip.net_salary)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
