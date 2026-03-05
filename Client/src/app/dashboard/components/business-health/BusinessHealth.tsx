import React from "react";
import { Target, AlertTriangle, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const BusinessHealth = () => {
  return (
    <Card className="xl:col-span-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-heading flex items-center">
          <div className="bg-brand rounded-full p-1.5 mr-2">
            <Target className="w-4 h-4 text-on-brand" />
          </div>
          Business Health
        </h2>
        <span className="px-3 py-1 bg-status-success-bg text-status-success rounded-full text-sm font-medium border border-status-success-border">
          Good
        </span>
      </div>

      <div className="space-y-4">
        {/* Overall Score */}
        <div className="bg-status-success-bg rounded-lg p-4 border border-status-success-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Overall Score
            </span>
            <span className="text-status-success text-sm font-semibold">+5.2%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-text-secondary">78/100</span>
          </div>
          <div className="w-full bg-border rounded-full h-2 mt-2">
            <div
              className="bg-brand h-2 rounded-full"
              style={{ width: "78%" }}
            ></div>
          </div>
          <p className="text-xs text-text-muted mt-1">Better than last month</p>
        </div>

        {/* Compliance Readiness */}
        <div className="bg-status-warning-bg rounded-lg p-4 border border-status-warning-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Compliance
            </span>
            <Shield className="w-4 h-4 text-status-warning" />
          </div>
          <span className="text-2xl font-bold text-text-secondary">65%</span>
          <div className="w-full bg-border rounded-full h-2 mt-2">
            <div
              className="bg-status-warning h-2 rounded-full"
              style={{ width: "65%" }}
            ></div>
          </div>
          <p className="text-xs text-text-muted mt-1">3 actions required</p>
        </div>

        {/* Risk Assessment */}
        <div className="bg-status-error-bg rounded-lg p-4 border border-status-error-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Risk Level
            </span>
            <AlertTriangle className="w-4 h-4 text-status-error" />
          </div>
          <span className="text-2xl font-bold text-text-secondary">Medium</span>
          <p className="text-status-error font-semibold">
            2 alerts – monitor closely
          </p>
        </div>
      </div>

      <Button className="w-full mt-8">View Detailed Report</Button>
    </Card>
  );
};

export default BusinessHealth;