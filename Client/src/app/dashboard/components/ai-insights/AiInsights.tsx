import React from "react";
import {
  Brain,
  CheckCircle,
  Lightbulb,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import Button from "@/app/components/ui/Button";

const AiInsights = () => {
  // AI Insights data
  const aiInsights = [
    {
      id: 1,
      type: "compliance",
      title: "VAT Regulation Update",
      message:
        "New VAT guidelines effective next month. Update your billing system to avoid penalties.",
      confidence: 92,
      priority: "high",
    },
    {
      id: 2,
      type: "opportunity",
      title: "Growth Opportunity",
      message:
        "Based on revenue trends, consider expanding to Abu Dhabi free zone. 25% growth potential.",
      confidence: 85,
      priority: "medium",
    },
    {
      id: 3,
      type: "efficiency",
      title: "Process Optimization",
      message:
        "Automate 70% of customer queries using AI templates. Save 10+ hours weekly.",
      confidence: 78,
      priority: "medium",
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "compliance":
        return <Shield className="w-4 h-4 text-amber-600" />;
      case "opportunity":
        return <Lightbulb className="w-4 h-4 text-green-600" />;
      case "efficiency":
        return <Zap className="w-4 h-4 text-blue-600" />;
      default:
        return <Brain className="w-4 h-4 text-purple-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-amber-50 border-amber-200";
      case "low":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI Business Insights
          </h2>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-[#F6A821] text-white rounded-full text-xs font-medium">
              Live Analysis
            </span>
          </div>
        </div>

        {/* AI Insights List */}
        <div className="space-y-4">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getPriorityColor(
                insight.priority
              )}`}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-white rounded-full p-1.5 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-800">
                      {insight.title}
                    </h3>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {insight.message}
                  </p>
                  <div className="flex space-x-2">
                    <Button className="rounded text-sm px-3 py-1">
                      View Details
                    </Button>
                    <Button className="rounded bg-transparent text-sm px-3 py-1 border border-[#2E69A4] text-[#2E69A4] hover:bg-[#2E69A4] hover:text-white">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Invoices */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800">Recent Invoices</h3>
            <button className="text-[#2E69A4] text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-1.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">INV-001</p>
                  <p className="text-sm text-gray-600">Al Manara Trading LLC</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">AED 2,500</p>
                <p className="text-xs text-green-600">Paid</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 rounded-full p-1.5">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">INV-002</p>
                  <p className="text-sm text-gray-600">Emirates Solutions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">AED 3,200</p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
