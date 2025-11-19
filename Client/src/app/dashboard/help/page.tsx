"use client";

import React from "react";
import {
  Search,
  MessageCircle,
  FileText,
  Bell,
  Calculator,
  Users,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Video,
  MessageSquare,
  CreditCard,
  Shield,
  HeadphonesIcon,
  Bot,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AIHelpCenter = () => {
  const popularArticles = [
    {
      icon: <Calculator className="w-5 h-5" />,
      title: "How to create VAT-compliant invoices",
      description:
        "Step-by-step guide to generating invoices with automatic VAT calculation",
      category: "Invoicing",
      readTime: "3 min read",
    },
    {
      icon: <Bot className="w-5 h-5" />,
      title: "Training your AI assistant for business queries",
      description:
        "Customize AI responses for your specific business needs and compliance questions",
      category: "AI Assistant",
      readTime: "5 min read",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Setting up compliance reminders",
      description:
        "Configure automatic alerts for VAT filing, license renewals, and payroll deadlines",
      category: "Reminders",
      readTime: "4 min read",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "WhatsApp auto-reply setup guide",
      description:
        "Connect your WhatsApp Business account and configure AI-powered responses",
      category: "Communication",
      readTime: "6 min read",
    },
  ];

  const supportChannels = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "AI Chat Support",
      description: "Instant help from our AI support assistant",
      availability: "Available 24/7",
      action: "Start AI Chat",
      color: "bg-blue-500",
    },
    {
      icon: <HeadphonesIcon className="w-5 h-5" />,
      title: "Human Support",
      description: "Connect with our support specialists",
      availability: "Mon-Fri, 9AM-6PM GST",
      action: "Contact Support",
      color: "bg-green-500",
    },
    {
      icon: <Video className="w-5 h-5" />,
      title: "Video Tutorials",
      description: "Step-by-step video guides and demos",
      availability: "On-demand",
      action: "Watch Tutorials",
      color: "bg-purple-500",
    },
  ];

  return (
      <DashboardLayout>
        <div className="min-h-screen p-6 mb-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              {/* Help Center Search */}
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    How can we help you today?
                  </h2>
                  <p className="text-gray-600">
                    Search for articles, guides, and troubleshooting help
                  </p>
                </div>

                {/* Search Container */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-1">
                  <div className="relative">
                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Input Field */}
                    <input
                      type="text"
                      placeholder="Search help articles, guides, or FAQs..."
                      className="w-full pl-12 pr-32 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-500 text-base"
                    />

                    {/* Search Button */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                      <button className="bg-[#1B2A49] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Popular searches:
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition-colors cursor-pointer">
                      &qout;How to update my invoice information?&qout;
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition-colors cursor-pointer">
                      &qout;Understanding VAT return process&qout;
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Articles */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#1B2A49]">
                  Popular Help Articles
                </h2>
                <button className="text-[#2E69A4] hover:text-[#1B2A49] font-medium flex items-center">
                  View all articles
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {popularArticles.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-[#E1E8F5] p-6 hover:shadow-md transition-shadow group cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-50 rounded-lg text-[#2E69A4] group-hover:scale-110 transition-transform">
                        {article.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#2E69A4] bg-blue-50 px-3 py-1 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {article.readTime}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[#1B2A49] mb-2 group-hover:text-[#2E69A4] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-[#344767] text-sm mb-3">
                          {article.description}
                        </p>
                        <div className="flex items-center text-[#2E69A4] text-sm font-medium">
                          Read guide
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Support Channels */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-[#1B2A49] mb-6">
                Get Help & Support
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {supportChannels.map((channel, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] rounded-2xl p-6 text-white hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg ${channel.color} mr-3`}>
                        {channel.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{channel.title}</h3>
                        <p className="text-blue-100 text-sm">
                          {channel.availability}
                        </p>
                      </div>
                    </div>
                    <p className="text-blue-100 text-sm mb-6">
                      {channel.description}
                    </p>
                    <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/20">
                      {channel.action}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Resources */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1B2A49] mb-6">
                Quick Resources
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: <FileText className="w-4 h-4" />,
                    text: "Compliance Guides",
                    count: "12 guides",
                  },
                  {
                    icon: <Video className="w-4 h-4" />,
                    text: "Video Tutorials",
                    count: "8 videos",
                  },
                  {
                    icon: <BookOpen className="w-4 h-4" />,
                    text: "API Documentation",
                    count: "Full docs",
                  },
                  {
                    icon: <Download className="w-4 h-4" />,
                    text: "Mobile App Guide",
                    count: "iOS & Android",
                  },
                  {
                    icon: <CreditCard className="w-4 h-4" />,
                    text: "Billing Help",
                    count: "5 articles",
                  },
                  {
                    icon: <Shield className="w-4 h-4" />,
                    text: "Security FAQ",
                    count: "3 articles",
                  },
                  {
                    icon: <Users className="w-4 h-4" />,
                    text: "Team Management",
                    count: "4 guides",
                  },
                  {
                    icon: <HelpCircle className="w-4 h-4" />,
                    text: "FAQ Center",
                    count: "25+ answers",
                  },
                ].map((resource, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-[#E1E8F5] hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-[#2E69A4] group-hover:text-[#1B2A49]">
                        {resource.icon}
                      </div>
                      <span className="text-[#344767] group-hover:text-[#1B2A49] font-medium">
                        {resource.text}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {resource.count}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </DashboardLayout>
  );
};

// Add the missing Download icon import
const Download = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default AIHelpCenter;
