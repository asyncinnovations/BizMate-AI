import React from "react";

import { FileText, Users, Calendar, MessageCircle } from "lucide-react";
import Button from "@/app/components/ui/Button";

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
      color: "bg-blue-500",
    },
    {
      name: "Emirates Solutions",
      email: "accounts@emirates.ae",
      phone: "+971 52 987 6543",
      status: "overdue",
      outstanding: "AED 12,300",
      lastContact: "5 days ago",
      avatar: "ES",
      color: "bg-red-500",
    },
    {
      name: "Emirates Solutions",
      email: "accounts@emirates.ae",
      phone: "+971 52 987 6543",
      status: "overdue",
      outstanding: "AED 12,300",
      lastContact: "5 days ago",
      avatar: "ES",
      color: "bg-red-500",
    },
    {
      name: "Dubai Tech Partners",
      email: "info@dubaitech.ae",
      phone: "+971 55 456 7890",
      status: "active",
      outstanding: "AED 3,200",
      lastContact: "1 week ago",
      avatar: "DT",
      color: "bg-green-500",
    },
    {
      name: "Abu Dhabi Holdings",
      email: "finance@adholdings.ae",
      phone: "+971 56 789 0123",
      status: "pending",
      outstanding: "AED 5,700",
      lastContact: "3 days ago",
      avatar: "AD",
      color: "bg-purple-500",
    },
  ];
  return (
    <div className="xl:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#1B2A49] flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          Client Management
        </h2>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
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
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-[#E1E8F5] hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`${client.color} rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold`}
              >
                {client.avatar}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-[#344767]">{client.name}</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      client.status === "active"
                        ? "bg-green-100 text-green-800"
                        : client.status === "overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{client.email}</p>
                <p className="text-xs text-gray-500">{client.phone}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-[#344767]">
                {client.outstanding}
              </p>
              <p className="text-xs text-gray-500">Outstanding</p>
              <p className="text-xs text-gray-400 mt-1">
                Contact: {client.lastContact}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Button
          icon={<MessageCircle className="w-3 h-3" />}
          className="justify-center p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium"
        >
          Message All
        </Button>

        <Button
          icon={<FileText className="w-3 h-3" />}
          className="justify-center p-2 bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium"
        >
          Send Invoices
        </Button>

        <Button
          icon={<Calendar className="w-3 h-3" />}
          className="justify-center p-2 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-medium"
        >
          Schedule Follow-up
        </Button>
      </div>
    </div>
  );
};

export default ClientManagement;
