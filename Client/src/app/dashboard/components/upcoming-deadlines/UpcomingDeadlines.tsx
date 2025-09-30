import React from "react";
import { Calendar, AlertTriangle, Users, Building2 } from "lucide-react";
import Button from "@/app/components/ui/Button";

const UpcomingDeadlines = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Upcoming Deadlines
        </h2>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
          <div className="bg-red-100 rounded-full p-1.5 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">VAT Filing</p>
            <p className="text-sm text-gray-600">Due in 5 days</p>
            <p className="text-xs text-red-600 mt-1">Q3 2025 Return</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
          <div className="bg-yellow-100 rounded-full p-1.5 mt-0.5">
            <Building2 className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">Trade License Renewal</p>
            <p className="text-sm text-gray-600">Due in 23 days</p>
            <p className="text-xs text-yellow-600 mt-1">License #123456</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">Employee Insurance</p>
            <p className="text-sm text-gray-600">Due in 45 days</p>
            <p className="text-xs text-blue-600 mt-1">Annual renewal</p>
          </div>
        </div>
      </div>

      <Button className="w-full mt-6 py-2">View All Reminders</Button>
    </div>
  );
};

export default UpcomingDeadlines;
