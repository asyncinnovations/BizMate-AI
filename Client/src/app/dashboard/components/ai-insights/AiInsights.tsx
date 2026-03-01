import React, { useEffect, useState } from "react";
import {
  Brain,
  CheckCircle,
  Lightbulb,
  Zap,
  Shield,
  Clock,
  Eye,
  AlertTriangle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// TypeScript interface
interface Invoice {
  uuid: string;
  invoice_number: string;
  customer_name: string;
  status: "paid" | "unpaid" | "draft" | "saved";
  total: number;
  invoice_date: string;
}

const AiInsights = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  /////////////////////////////////////
  // Recent invoices state
  /////////////////////////////////////
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

  /////////////////////////////////////
  // Fetch user invoices — show only 2 most recent
  // API returns response.data as a plain array (same as InvoiceListPage)
  /////////////////////////////////////
  const fetchRecentInvoices = async () => {
    try {
      const response = await axiosInstance.get(
        `/invoices/user/${user?.user.user_id}`,
      );
      if (response.status === 200) {
        const data = response.data;
        const invoices: Invoice[] = Array.isArray(data) ? data : [];
        // Sort by invoice_date descending, take first 2
        const sorted = [...invoices].sort(
          (a, b) =>
            new Date(b.invoice_date).getTime() -
            new Date(a.invoice_date).getTime(),
        );
        setRecentInvoices(sorted.slice(0, 2));
      }
    } catch (error) {
      console.log("Error fetching recent invoices for AI Insights", error);
    }
  };

  useEffect(() => {
    if (!loading && user?.user.user_id) {
      fetchRecentInvoices();
    }
  }, [loading, user?.user.user_id]);

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
        return <Shield className="w-4 h-4 text-status-warning" />;
      case "opportunity":
        return <Lightbulb className="w-4 h-4 text-status-success" />;
      case "efficiency":
        return <Zap className="w-4 h-4 text-status-info" />;
      default:
        return <Brain className="w-4 h-4 text-secondary" />;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-status-error-bg border-status-error-border";
      case "medium":
        return "bg-status-warning-bg border-status-warning-border";
      case "low":
        return "bg-status-info-bg border-status-info-border";
      default:
        return "bg-bg-base border-border";
    }
  };

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return (
          <div className="bg-status-success-bg rounded-full p-1.5">
            <CheckCircle className="w-4 h-4 text-status-success" />
          </div>
        );
      case "unpaid":
        return (
          <div className="bg-status-warning-bg rounded-full p-1.5">
            <Clock className="w-4 h-4 text-status-warning" />
          </div>
        );
      default:
        return (
          <div className="bg-bg-base rounded-full p-1.5">
            <AlertTriangle className="w-4 h-4 text-text-muted" />
          </div>
        );
    }
  };

  const getStatusLabel = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <p className="text-xs text-status-success font-medium">Paid</p>;
      case "unpaid":
        return (
          <p className="text-xs text-status-warning font-medium">Pending</p>
        );
      default:
        return (
          <p className="text-xs text-text-muted font-medium capitalize">
            {status}
          </p>
        );
    }
  };

  return (
    <div className="lg:col-span-2">
      <Card className="h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-heading flex items-center">
            <Brain className="w-5 h-5 mr-2 text-secondary" />
            AI Business Insights
          </h2>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-status-warning text-on-brand rounded-full text-xs font-medium">
              Live Analysis
            </span>
          </div>
        </div>

        {/* AI Insights List */}
        <div className="space-y-4">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getPriorityStyle(insight.priority)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-surface rounded-full p-1.5 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-text-heading">
                      {insight.title}
                    </h3>
                    <span className="px-2 py-1 bg-status-info-bg text-status-info rounded-full text-xs font-medium">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">
                    {insight.message}
                  </p>
                  <div className="flex space-x-2">
                    <Button className="rounded text-sm px-3 py-1">
                      View Details
                    </Button>
                    <Button className="rounded bg-transparent text-sm px-3 py-1 border border-secondary text-secondary hover:bg-secondary hover:text-on-brand">
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
            <h3 className="font-medium text-text-heading">Recent Invoices</h3>
            <button
              onClick={() => router.push("/dashboard/invoicing")}
              className="text-secondary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <div
                  key={invoice.uuid}
                  className="flex items-center justify-between p-3 bg-bg-base rounded-lg border border-border hover:border-border-strong hover:shadow-card transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(invoice.status)}
                    <div>
                      <p className="font-medium text-text-heading text-sm">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-xs text-text-muted">
                        {invoice.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium text-text-heading text-sm">
                        AED {Number(invoice.total).toLocaleString()}
                      </p>
                      {getStatusLabel(invoice.status)}
                    </div>
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/invoicing/preview/${invoice.uuid}`,
                        )
                      }
                      className="p-1.5 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all duration-200"
                      title="View invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-text-muted text-sm">
                No invoices yet
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AiInsights;
