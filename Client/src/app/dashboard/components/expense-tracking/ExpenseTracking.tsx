import React from "react";
import { Wallet, Building2, Users, Plus, Zap } from "lucide-react";
import Button from "@/app/components/ui/Button";

const ExpenseTracking = () => {
  const expenses = [
    {
      title: "Office Rent",
      subtitle: "Monthly recurring",
      amount: "AED 4,500",
      bg: "bg-red-50 border border-red-100",
      iconBg: "bg-red-100",
      icon: <Building2 className="w-4 h-4 text-red-600" />,
    },
    {
      title: "Marketing Ads",
      subtitle: "Google & Social Media",
      amount: "AED 1,250",
      bg: "bg-yellow-50 border border-yellow-100",
      iconBg: "bg-yellow-100",
      icon: <Users className="w-4 h-4 text-yellow-600" />,
    },
    {
      title: "Software Subscriptions",
      subtitle: "AI Assistant Premium",
      amount: "AED 299",
      bg: "bg-blue-50 border border-blue-100",
      iconBg: "bg-blue-100",
      icon: <Zap className="w-4 h-4 text-blue-600" />,
    },
  ];
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-[#E1E8F5] flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#1B2A49]">
          Expense Tracking
        </h2>
        <Wallet className="w-5 h-5 text-[#344767]" />
      </div>

      {/* Monthly Expense Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#6B7C93]">This Month Expenses</span>
          <span className="text-lg font-bold text-[#344767]">AED 8,750</span>
        </div>
        <div className="w-full bg-[#E1E8F5] rounded-full h-2">
          <div className="bg-[#2E69A4] h-2 rounded-full w-3/4"></div>
        </div>
        <p className="text-xs text-[#6B7C93] mt-1">
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
                <p className="font-medium text-[#344767]">{expense.title}</p>
                <p className="text-sm text-[#6B7C93]">{expense.subtitle}</p>
              </div>
            </div>
            <span className="font-semibold text-[#344767]">
              {expense.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Button at bottom */}
      <div className="mt-4">
        <Button
          className="w-full py-2 bg-gradient-to-r from-[#2E69A4] to-[#1B2A49]"
          icon={<Plus className="w-4 h-4" />}
        >
          Add Expense
        </Button>
      </div>
    </div>
  );
};

export default ExpenseTracking;
