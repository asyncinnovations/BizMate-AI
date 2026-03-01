import React from "react";
import { Wallet, Building2, Users, Plus, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const ExpenseTracking = () => {
  const expenses = [
    {
      title: "Office Rent",
      subtitle: "Monthly recurring",
      amount: "AED 4,500",
      bg: "bg-status-error-bg border border-status-error-border",
      iconBg: "bg-status-error-bg",
      icon: <Building2 className="w-4 h-4 text-status-error" />,
    },
    {
      title: "Marketing Ads",
      subtitle: "Google & Social Media",
      amount: "AED 1,250",
      bg: "bg-status-warning-bg border border-status-warning-border",
      iconBg: "bg-status-warning-bg",
      icon: <Users className="w-4 h-4 text-status-warning" />,
    },
    {
      title: "Software Subscriptions",
      subtitle: "AI Assistant Premium",
      amount: "AED 299",
      bg: "bg-status-info-bg border border-status-info-border",
      iconBg: "bg-status-info-bg",
      icon: <Zap className="w-4 h-4 text-status-info" />,
    },
  ];

  return (
    <Card className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-heading">
          Expense Tracking
        </h2>
        <Wallet className="w-5 h-5 text-text-secondary" />
      </div>

      {/* Monthly Expense Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">This Month Expenses</span>
          <span className="text-lg font-bold text-text-secondary">
            AED 8,750
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div className="bg-secondary h-2 rounded-full w-3/4"></div>
        </div>
        <p className="text-xs text-text-muted mt-1">
          75% of monthly budget used
        </p>
      </div>

      {/* Scrollable Expense List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {expenses.map((expense, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-lg ${expense.bg}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`${expense.iconBg} rounded-full p-1.5`}>
                {expense.icon}
              </div>
              <div>
                <p className="font-medium text-text-secondary">
                  {expense.title}
                </p>
                <p className="text-sm text-text-muted">{expense.subtitle}</p>
              </div>
            </div>
            <span className="font-semibold text-text-secondary">
              {expense.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Button at bottom */}
      <div className="mt-4">
        <Button
          className="w-full py-2 bg-brand hover:bg-brand-hover text-on-brand"
          startIcon={<Plus className="w-4 h-4" />}
        >
          Add Expense
        </Button>
      </div>
    </Card>
  );
};

export default ExpenseTracking;
