"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Eye,
  Banknote,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import StatCard from "@/components/stat-card/StatCard";
import EmptyState from "@/components/empty-state/EmptyState";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/select";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";
import { DUMMY_EMPLOYEES } from "@/types/payroll.dummy";
import {
  Employee,
  CONTRACT_TYPE_LABELS,
  fmtAED,
  computeGross,
} from "@/types/payroll.types";

export default function EmployeeListPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterDept, setFilterDept] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setEmployees(DUMMY_EMPLOYEES);
    setLoading(false);
  };

  const handleToggleStatus = (emp: Employee) => {
    const newStatus = emp.status === "active" ? "inactive" : "active";
    setEmployees((prev) =>
      prev.map((e) => (e.uuid === emp.uuid ? { ...e, status: newStatus } : e)),
    );
    toast.success(`Employee marked as ${newStatus}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setEmployees((prev) => prev.filter((e) => e.uuid !== deleteTarget.uuid));
    toast.success("Employee deleted");
    setDeleteTarget(null);
    setDeleting(false);
  };

  const activeCount = employees.filter((e) => e.status === "active").length;
  const inactiveCount = employees.filter((e) => e.status === "inactive").length;
  const totalPayroll = employees
    .filter((e) => e.status === "active")
    .reduce((s, e) => s + computeGross(e), 0);
  const deptCount = new Set(employees.map((e) => e.department)).size;
  const departments = [
    "all",
    ...Array.from(new Set(employees.map((e) => e.department))),
  ];

  const statCards = [
    {
      icon: <Users className="w-5 h-5" />,
      iconBg: "bg-status-info-bg",
      iconColor: "text-status-info",
      badgeText: `${employees.length} total`,
      badgeBg: "bg-status-info-bg",
      badgeColor: "text-status-info",
      title: "Total Employees",
      value: String(employees.length),
      subtitle: "On payroll roster",
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      iconBg: "bg-status-success-bg",
      iconColor: "text-status-success",
      badgeText: "active",
      badgeBg: "bg-status-success-bg",
      badgeColor: "text-status-success",
      title: "Active Employees",
      value: String(activeCount),
      subtitle: "Currently employed",
    },
    {
      icon: <UserX className="w-5 h-5" />,
      iconBg: "bg-status-error-bg",
      iconColor: "text-status-error",
      badgeText: "inactive",
      badgeBg: "bg-status-error-bg",
      badgeColor: "text-status-error",
      title: "Inactive Employees",
      value: String(inactiveCount),
      subtitle: "Deactivated accounts",
    },
    {
      icon: <Banknote className="w-5 h-5" />,
      iconBg: "bg-brand-light",
      iconColor: "text-secondary",
      badgeText: `${deptCount} depts`,
      badgeBg: "bg-brand-light",
      badgeColor: "text-secondary",
      title: "Monthly Cost",
      value:
        totalPayroll > 0 ? `AED ${(totalPayroll / 1000).toFixed(1)}K` : "—",
      subtitle: "Gross — active only",
    },
  ];

  const filtered = employees.filter((e) => {
    const matchSearch =
      search === "" ||
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    const matchDept = filterDept === "all" || e.department === filterDept;
    return matchSearch && matchStatus && matchDept;
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <PageHeader
          title="Employees"
          description="Manage your payroll employees"
          icon={<Users size={24} />}
          buttons={[
            {
              text: "Add Employee",
              icon: <Plus size={18} />,
              onClick: () => router.push("/dashboard/payroll/employees/add"),
            },
          ]}
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
                  <Users className="w-5 h-5 text-text-heading" />
                  Payroll Employees
                </h2>
                <p className="text-text-secondary mt-1">
                  Showing {filtered.length} employee
                  {filtered.length !== 1 ? "s" : ""} based on your current
                  search and filters
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary w-full lg:w-80 bg-bg-base text-text-secondary transition-all duration-200"
                  />
                </div>
                <Select
                  value={filterStatus}
                  onChange={(value) =>
                    setFilterStatus(value as "all" | "active" | "inactive")
                  }
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  className="w-full sm:w-40"
                />
                <Select
                  value={filterDept}
                  onChange={setFilterDept}
                  options={departments.map((d) => ({
                    value: d,
                    label: d === "all" ? "All Departments" : d,
                  }))}
                  className="w-full sm:w-52"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-16">
              <LoadingSpinner size="w-8 h-8" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No employees match your filters"
              description="Try adjusting your search or filters"
              ctaLabel="Add Employee"
              onCTAClick={() => router.push("/dashboard/payroll/employees/add")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand">
                  <tr>
                    {[
                      "Employee",
                      "Department",
                      "Contract",
                      "Gross Salary",
                      "Status",
                      "Actions",
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
                  {filtered.map((emp) => (
                    <tr
                      key={emp.uuid}
                      className="hover:bg-brand-light/30 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
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
                            <p className="text-sm font-semibold text-text-heading">
                              {emp.full_name}
                            </p>
                            <p className="text-sm text-text-muted">
                              {emp.designation}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-secondary">
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-bg-base border border-border text-text-secondary">
                          {CONTRACT_TYPE_LABELS[emp.contract_type]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-text-heading">
                          {fmtAED(computeGross(emp))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border ${
                            emp.status === "active"
                              ? "bg-status-success-bg text-status-success border-status-success-border"
                              : "bg-status-error-bg text-status-error border-status-error-border"
                          }`}
                        >
                          {emp.status.charAt(0).toUpperCase() +
                            emp.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            title="View"
                            onClick={() =>
                              router.push(
                                `/dashboard/payroll/employees/${emp.uuid}`,
                              )
                            }
                            className="p-2 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            title="Edit"
                            onClick={() =>
                              router.push(
                                `/dashboard/payroll/employees/${emp.uuid}`,
                              )
                            }
                            className="p-2 text-text-muted hover:text-status-info hover:bg-status-info-bg rounded-lg transition-all duration-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            title={
                              emp.status === "active"
                                ? "Deactivate"
                                : "Activate"
                            }
                            onClick={() => handleToggleStatus(emp)}
                            className={`p-2 rounded-lg transition-all duration-200 text-text-muted ${
                              emp.status === "active"
                                ? "hover:bg-status-warning-bg hover:text-status-warning"
                                : "hover:bg-status-success-bg hover:text-status-success"
                            }`}
                          >
                            {emp.status === "active" ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            title="Delete"
                            onClick={() => setDeleteTarget(emp)}
                            className="p-2 text-text-muted hover:text-status-error hover:bg-status-error-bg rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Employee"
        size="sm"
        showCloseButton
      >
        <div className="p-6">
          <p className="text-sm text-text-secondary mb-1">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text-heading">
              {deleteTarget?.full_name}
            </span>
            ?
          </p>
          <p className="text-xs text-status-error mb-6">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-transparent border border-border text-text-secondary hover:bg-bg-base"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2.5 px-4 bg-status-error text-on-brand rounded-md font-semibold text-sm hover:opacity-90 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
