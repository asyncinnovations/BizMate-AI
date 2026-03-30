"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  ArrowLeft,
  Save,
  DollarSign,
  Building2,
  CreditCard,
  User,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import Card from "@/components/ui/Card";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/select";
import toast from "react-hot-toast";
import {
  EmployeeFormData,
  ContractType,
  DEPARTMENTS,
  fmtAED,
} from "@/types/payroll.types";

const EMPTY_FORM: Omit<EmployeeFormData, "user_id"> = {
  full_name: "",
  email: "",
  phone: "",
  emirates_id: "",
  designation: "",
  department: DEPARTMENTS[0],
  joining_date: "",
  contract_type: "full_time",
  basic_salary: "",
  housing_allowance: "",
  transport_allowance: "",
  other_allowance: "",
  bank_name: "",
  iban: "",
};

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

export default function AddEmployeePage() {
  const router = useRouter();
  const [form, setForm] =
    useState<Omit<EmployeeFormData, "user_id">>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof EMPTY_FORM, string>>
  >({});
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const gross =
    (Number(form.basic_salary) || 0) +
    (Number(form.housing_allowance) || 0) +
    (Number(form.transport_allowance) || 0) +
    (Number(form.other_allowance) || 0);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.designation.trim()) e.designation = "Designation is required";
    if (!form.joining_date) e.joining_date = "Joining date is required";
    if (!form.basic_salary || Number(form.basic_salary) <= 0)
      e.basic_salary = "Basic salary must be greater than 0";
    if (!form.bank_name.trim()) e.bank_name = "Bank name is required";
    if (!form.iban.trim()) e.iban = "IBAN is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return toast.error("Please fill all required fields");
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Employee added successfully!");
    router.push("/dashboard/payroll/employees");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <PageHeader
          title="Add Employee"
          description="Add a new employee to your payroll system"
          icon={<UserPlus size={24} />}
          buttons={[
            {
              text: "Back",
              icon: <ArrowLeft size={18} />,
              onClick: () => router.back(),
            },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Single card — all sections inside */}
          <div className="lg:col-span-2">
            <Card>
              {/* ── Personal ── */}
              <SectionHead icon={User} title="Personal Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="Full Name"
                  name="full_name"
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="e.g. Ahmed Al Maktoum"
                  error={errors.full_name}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="ahmed@company.ae"
                  error={errors.email}
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+971 50 000 0000"
                />
                <InputField
                  label="Emirates ID"
                  name="emirates_id"
                  type="text"
                  value={form.emirates_id}
                  onChange={(e) => set("emirates_id", e.target.value)}
                  placeholder="784-XXXX-XXXXXXX-X"
                />
              </div>

              <div className="border-t border-border my-7" />

              {/* ── Employment ── */}
              <SectionHead icon={Building2} title="Employment Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="Designation"
                  name="designation"
                  type="text"
                  required
                  value={form.designation}
                  onChange={(e) => set("designation", e.target.value)}
                  placeholder="e.g. Senior Engineer"
                  error={errors.designation}
                />
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                    Department
                  </label>
                  <Select
                    value={form.department}
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
                  required
                  value={form.joining_date}
                  onChange={(e) => set("joining_date", e.target.value)}
                  error={errors.joining_date}
                />
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                    Contract Type
                  </label>
                  <Select
                    value={form.contract_type}
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

              <div className="border-t border-border my-7" />

              {/* ── Salary ── */}
              <SectionHead icon={DollarSign} title="Salary Breakdown (AED)" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="Basic Salary (AED)"
                  name="basic_salary"
                  type="number"
                  required
                  value={String(form.basic_salary)}
                  onChange={(e) => set("basic_salary", e.target.value)}
                  placeholder="0.00"
                  error={errors.basic_salary}
                />
                <InputField
                  label="Housing Allowance (AED)"
                  name="housing_allowance"
                  type="number"
                  value={String(form.housing_allowance)}
                  onChange={(e) => set("housing_allowance", e.target.value)}
                  placeholder="0.00"
                />
                <InputField
                  label="Transport Allowance (AED)"
                  name="transport_allowance"
                  type="number"
                  value={String(form.transport_allowance)}
                  onChange={(e) => set("transport_allowance", e.target.value)}
                  placeholder="0.00"
                />
                <InputField
                  label="Other Allowance (AED)"
                  name="other_allowance"
                  type="number"
                  value={String(form.other_allowance)}
                  onChange={(e) => set("other_allowance", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="border-t border-border my-7" />

              {/* ── Banking ── */}
              <SectionHead icon={CreditCard} title="Banking Details (WPS)" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="Bank Name"
                  name="bank_name"
                  type="text"
                  required
                  value={form.bank_name}
                  onChange={(e) => set("bank_name", e.target.value)}
                  placeholder="e.g. Emirates NBD"
                  error={errors.bank_name}
                />
                <InputField
                  label="IBAN"
                  name="iban"
                  type="text"
                  required
                  value={form.iban}
                  onChange={(e) => set("iban", e.target.value)}
                  placeholder="AE00 0000 0000 0000 0000 000"
                  error={errors.iban}
                />
              </div>
              <p className="text-xs text-text-muted mt-3">
                IBAN is required for UAE WPS (Wage Protection System) salary
                transfers.
              </p>

              <div className="border-t border-border my-6" />

              {/* ── Actions ── */}
              <div className="flex gap-3">
                <Button
                  className="bg-transparent border border-border text-text-secondary hover:bg-bg-base"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={saving}
                  startIcon={<Save className="w-4 h-4" />}
                >
                  {saving ? "Saving…" : "Add Employee"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sticky top-2">
            <Card>
              <h3 className="text-lg font-bold text-text-heading mb-5">
                Salary Preview
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Basic Salary",
                    value: Number(form.basic_salary) || 0,
                  },
                  {
                    label: "Housing Allowance",
                    value: Number(form.housing_allowance) || 0,
                  },
                  {
                    label: "Transport Allowance",
                    value: Number(form.transport_allowance) || 0,
                  },
                  {
                    label: "Other Allowance",
                    value: Number(form.other_allowance) || 0,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-text-secondary">{label}</span>
                    <span className="font-semibold text-text-heading">
                      {fmtAED(value)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-text-heading">
                    Gross Monthly
                  </span>
                  <span className="text-base font-black text-secondary">
                    {fmtAED(gross)}
                  </span>
                </div>
              </div>
            </Card>
            <Card>
              <h3 className="text-base font-bold text-text-heading mb-3">
                Notes
              </h3>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                {[
                  "Fields marked * are required.",
                  "IBAN must be a valid UAE IBAN for WPS.",
                  "Salary amounts in AED.",
                  "Employee added as active by default.",
                ].map((n, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 shrink-0" />
                    {n}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
