import React from "react";

import { FileText, Users, Calendar, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const ClientManagement = () => {
  const clients = [
    {
      name: "Al Manara Trading LLC",
      email: "contact@almanara.ae",
      phone: "+971 50 123 4567",
      status: "active",
      outstanding: "AED 8,500",
      lastContact: "2 days ago",
      avatar: "AM",
      color: "bg-secondary",
    },
    {
      name: "Emirates Solutions",
      email: "accounts@emirates.ae",
      phone: "+971 52 987 6543",
      status: "overdue",
      outstanding: "AED 12,300",
      lastContact: "5 days ago",
      avatar: "ES",
      color: "bg-status-error",
    },
    {
      name: "Emirates Solutions",
      email: "accounts@emirates.ae",
      phone: "+971 52 987 6543",
      status: "overdue",
      outstanding: "AED 12,300",
      lastContact: "5 days ago",
      avatar: "ES",
      color: "bg-status-error",
    },
    {
      name: "Dubai Tech Partners",
      email: "info@dubaitech.ae",
      phone: "+971 55 456 7890",
      status: "active",
      outstanding: "AED 3,200",
      lastContact: "1 week ago",
      avatar: "DT",
      color: "bg-status-success",
    },
    {
      name: "Abu Dhabi Holdings",
      email: "finance@adholdings.ae",
      phone: "+971 56 789 0123",
      status: "pending",
      outstanding: "AED 5,700",
      lastContact: "3 days ago",
      avatar: "AD",
      color: "bg-brand",
    },
  ];

  return (
    <Card className="xl:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-heading flex items-center">
          <Users className="w-5 h-5 mr-2 text-secondary" />
          Client Management
        </h2>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-brand-light text-secondary rounded-full text-xs font-medium">
            24 Active Clients
          </span>
          <Button className="text-sm px-3 rounded py-1">+ Add Client</Button>
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-4 max-h-110 overflow-y-auto pr-2">
        {clients.map((client, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-bg-base rounded-lg border border-border hover:border-border-strong hover:shadow-card transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`${client.color} rounded-full w-10 h-10 flex items-center justify-center text-on-brand font-semibold text-sm`}
              >
                {client.avatar}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-text-secondary">
                    {client.name}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      client.status === "active"
                        ? "bg-status-success-bg text-status-success"
                        : client.status === "overdue"
                          ? "bg-status-error-bg text-status-error"
                          : "bg-status-warning-bg text-status-warning"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
                <p className="text-sm text-text-muted">{client.email}</p>
                <p className="text-xs text-text-muted">{client.phone}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-text-secondary">
                {client.outstanding}
              </p>
              <p className="text-xs text-text-muted">Outstanding</p>
              <p className="text-xs text-text-muted mt-1">
                Contact: {client.lastContact}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Button
          startIcon={<MessageCircle className="w-3 h-3" />}
          className="justify-center p-2 bg-status-info-bg text-status-info hover:bg-status-info hover:text-on-brand text-xs font-medium transition-colors"
        >
          Message All
        </Button>

        <Button
          startIcon={<FileText className="w-3 h-3" />}
          className="justify-center p-2 bg-status-success-bg text-status-success hover:bg-status-success hover:text-on-brand text-xs font-medium transition-colors"
        >
          Send Invoices
        </Button>

        <Button
          startIcon={<Calendar className="w-3 h-3" />}
          className="justify-center p-2 bg-brand-light text-secondary hover:bg-brand hover:text-on-brand text-xs font-medium transition-colors"
        >
          Schedule Follow-up
        </Button>
      </div>
    </Card>
  );
};

export default ClientManagement;
