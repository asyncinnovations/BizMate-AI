import React from "react";
import { Target, AlertTriangle, Shield } from "lucide-react";
import Button from "@/app/components/ui/Button";

const BusinessHealth = () => {
  return (
    <div className="xl:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#1B2A49] flex items-center">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-1.5 mr-2">
            <Target className="w-4 h-4 text-white" />
          </div>
          Business Health
        </h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Good
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Overall Score
            </span>
            <span className="text-green-600 text-sm font-semibold">+5.2%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-[#344767]">78/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
              style={{ width: "78%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Better than last month</p>
        </div>

        {/* Compliance Readiness */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Compliance
            </span>
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-[#344767]">65%</span>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-[#F6A821] h-2 rounded-full"
              style={{ width: "65%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">3 actions required</p>
        </div>

        {/* Risk Assessment */}
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Risk Level
            </span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-2xl font-bold text-[#344767]">Medium</span>
          <p className="text-red-600 font-semibold">
            2 alerts – monitor closely
          </p>
        </div>
      </div>

      <Button className="w-full mt-6">View Detailed Report</Button>
    </div>
  );
};

export default BusinessHealth;
