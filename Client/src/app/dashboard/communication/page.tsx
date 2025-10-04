"use client";
import React, { useState, ChangeEvent } from "react";
import {
  MessageSquare,
  Instagram,
  TrendingUp,
  Clock,
  CheckCircle,
  Settings,
  Plus,
  Search,
  Brain,
  Sparkles,
  Database,
  BarChart3,
  X,
  Upload,
  FileText,
  Wand2,
  AlertCircle,
  Users,
  Mail,
  MessageCircle,
  LucideIcon,
} from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import StatCard from "@/app/components/stat-card/StatCard";
import Modal from "@/app/components/ui/Modal";
import ReplyCard from "@/app/components/auto-reply-card/ReplyCard";
import SocialAccounts from "@/app/components/social_accounts/SocialAccounts";
import Button from "@/app/components/ui/Button";

// Type definitions
interface Reply {
  id: number;
  platform: string;
  query: string;
  aiReply: string;
  confidence: number;
  status: "active" | "pending";
  timestamp: string;
  customerName: string;
}

interface TrainingCategory {
  name: string;
  count: number;
  icon: LucideIcon;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function AutoReplyHub() {
  const [activeTab, setActiveTab] = useState<string>("email");
  const [selectedReply, setSelectedReply] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showTrainModal, setShowTrainModal] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [trainingStep, setTrainingStep] = useState<number>(1);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [newFaq, setNewFaq] = useState<FAQ>({
    question: "",
    answer: "",
    category: "General",
  });
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);

  const suggestedReplies: Reply[] = [
    {
      id: 1,
      platform: "whatsapp",
      query: "What are your business hours?",
      aiReply:
        "Hello! We're available Monday to Friday, 9 AM - 6 PM GST. How can I assist you today?",
      confidence: 95,
      status: "active",
      timestamp: "2 min ago",
      customerName: "Ahmed K.",
    },
    {
      id: 2,
      platform: "whatsapp",
      query: "Do you provide VAT invoices?",
      aiReply:
        "Yes, we provide VAT-compliant invoices for all services. Your invoice will include our VAT registration number and 5% UAE VAT.",
      confidence: 98,
      status: "active",
      timestamp: "5 min ago",
      customerName: "Sara M.",
    },
    {
      id: 3,
      platform: "instagram",
      query: "How much does your service cost?",
      aiReply:
        "Great question! We offer flexible pricing starting from AED 99/month. Would you like me to share our complete pricing details?",
      confidence: 92,
      status: "pending",
      timestamp: "8 min ago",
      customerName: "Mohammed A.",
    },
    {
      id: 4,
      platform: "whatsapp",
      query: "Can you help with license renewal?",
      aiReply:
        "Absolutely! Our AI assistant can remind you about license renewals and guide you through the process. We support all UAE free zones and mainland licenses.",
      confidence: 96,
      status: "active",
      timestamp: "12 min ago",
      customerName: "Fatima R.",
    },
    {
      id: 5,
      platform: "instagram",
      query: "Do you offer free trial?",
      aiReply:
        "Yes! We offer a 14-day free trial with full access to our AI assistant, invoicing, and compliance features. No credit card required! 🚀",
      confidence: 99,
      status: "active",
      timestamp: "15 min ago",
      customerName: "Khalid S.",
    },
    // Email Replies
    {
      id: 6,
      platform: "email",
      query: "Can you share your company profile?",
      aiReply:
        "Sure! I've attached our latest company profile, including services, pricing, and compliance details. Please let me know if you'd like a personalized proposal.",
      confidence: 94,
      status: "active",
      timestamp: "20 min ago",
      customerName: "Emily R.",
    },
    {
      id: 7,
      platform: "email",
      query: "Do you offer bulk discounts for annual plans?",
      aiReply:
        "Yes, we do! Annual subscriptions come with a 15% discount compared to monthly plans. Would you like me to prepare a custom quotation for you?",
      confidence: 97,
      status: "active",
      timestamp: "25 min ago",
      customerName: "David L.",
    },
  ];

  const statsData = [
    {
      icon: <MessageSquare />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badgeText: "+12%",
      badgeBg: "bg-blue-50",
      badgeColor: "text-blue-500",
      title: "Messages Today",
      value: "247",
      subtitle: "vs yesterday",
    },
    {
      icon: <Clock />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      badgeText: "-8%",
      badgeBg: "bg-amber-50",
      badgeColor: "text-amber-500",
      title: "Avg Response Time",
      value: "< 30s",
      subtitle: "compared to last week",
    },
    {
      icon: <TrendingUp />,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      badgeText: "+3%",
      badgeBg: "bg-indigo-50",
      badgeColor: "text-indigo-500",
      title: "AI Accuracy",
      value: "96%",
      subtitle: "model performance",
    },
    {
      icon: <CheckCircle />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      badgeText: "+15%",
      badgeBg: "bg-emerald-50",
      badgeColor: "text-emerald-500",
      title: "Auto-Resolved",
      value: "189",
      subtitle: "issues today",
    },
  ];

  const trainingCategories: TrainingCategory[] = [
    { name: "General", count: 12, icon: MessageCircle },
    { name: "Billing", count: 8, icon: FileText },
    { name: "Product", count: 15, icon: Database },
    { name: "Support", count: 10, icon: Users },
  ];

  const filteredReplies = suggestedReplies
    .filter((reply) => reply.platform === activeTab)
    .filter(
      (reply) =>
        reply.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reply.aiReply.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reply.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map((f) => f.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
    }
  };

  const handleTrainAI = () => {
    setIsTraining(true);
    setTrainingProgress(0);

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setTrainingProgress(0);
            setIsTraining(false);
            setShowTrainModal(false);
            setTrainingStep(1);
          }, 1000);
          return 100;
        }

        return prev + 10;
      });
    }, 1000);
  };

  // Handler functions for ReplyCard actions
  const handleReplySelect = (replyId: number) => {
    setSelectedReply(replyId);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const updateNewFaq = (field: keyof FAQ, value: string) => {
    setNewFaq((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F4F7FA] p-6 mb-4">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-[#1B2A49]">
                    AI Communication Hub
                  </h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 rounded-full">
                    <Sparkles size={14} className="text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">
                      AI Powered
                    </span>
                  </div>
                </div>
                <p className="text-[#344767]">
                  Intelligent auto-replies powered by advanced machine learning
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  icon={<BarChart3 size={20} />}
                >
                  Analytics
                </Button>
                <Button
                  onClick={() => setShowTrainModal(true)}
                  icon={<Brain size={20} />}
                  className="bg-[#F6A821] hover:bg-[#e29819]"
                >
                  Train AI
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((item, index) => (
              <StatCard key={index} {...item} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Platform Tabs & Search */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex gap-2">
                    {/* Email */}
                    <button
                      onClick={() => setActiveTab("email")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "email"
                          ? "bg-[#D93025] text-white" // Gmail red for active
                          : "bg-[#F4F7FA] text-[#344767] hover:bg-[#FDECEA]" // Light red hover
                      }`}
                    >
                      <Mail size={16} />
                      Email
                    </button>
                    {/* WhatsApp */}
                    <button
                      onClick={() => setActiveTab("whatsapp")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "whatsapp"
                          ? "bg-[#25D366] text-white"
                          : "bg-[#F4F7FA] text-[#344767] hover:bg-[#DCF8C6]"
                      }`}
                    >
                      <MessageSquare size={16} />
                      WhatsApp
                    </button>

                    {/* Instagram */}
                    <button
                      onClick={() => setActiveTab("instagram")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "instagram"
                          ? "bg-gradient-to-r from-[#C13584] to-[#E1306C] text-white"
                          : "bg-[#F4F7FA] text-[#344767] hover:bg-[#FEEBF3]"
                      }`}
                    >
                      <Instagram size={16} />
                      Instagram
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#344767]"
                    />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
                    />
                  </div>
                </div>

                {/* Suggested Replies List */}
                <div className="space-y-4">
                  {filteredReplies.map((reply) => (
                    <ReplyCard
                      key={reply.id}
                      reply={reply}
                      isSelected={selectedReply === reply.id}
                      onSelect={() => handleReplySelect(reply.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Training Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm ">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={24} />
                  <h3 className="text-lg font-bold">AI Training Status</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Knowledge Base</span>
                      <span>87%</span>
                    </div>
                    <div className="w-full bg-gray-300/30 rounded-full h-2">
                      <div
                        className="bg-blue-400 rounded-full h-2"
                        style={{ width: "87%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Response Accuracy</span>
                      <span>96%</span>
                    </div>
                    <div className="w-full bg-gray-300/30 rounded-full h-2">
                      <div
                        className="bg-blue-400 rounded-full h-2"
                        style={{ width: "96%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/30">
                    <div className="text-sm">Last trained: 2 hours ago</div>
                    <div className="text-xs opacity-80">
                      Next auto-train: 4 hours
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <SocialAccounts />
              </div>

              {/* Training Categories */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
                <h3 className="text-lg font-bold text-[#1B2A49] mb-4">
                  Knowledge Categories
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {trainingCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F4F7FA] rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <cat.icon size={20} className="text-[#2E69A4] mb-2" />
                      <div className="text-sm font-semibold text-[#1B2A49]">
                        {cat.name}
                      </div>
                      <div className="text-xs text-[#344767]">
                        {cat.count} FAQs
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Settings */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#1B2A49]">
                    Quick Settings
                  </h3>
                  <Settings size={18} className="text-[#344767]" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#344767]">
                      Auto-reply enabled
                    </span>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2E69A4] transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#344767]">
                      AI learning mode
                    </span>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2E69A4] transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#344767]">
                      Smart notifications
                    </span>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2E69A4] transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Modal */}
        <Modal
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          title="AI Analytics Dashboard"
          size="xl"
          showCloseButton={true}
          closeOnOverlayClick={true}
          titleIcon={<BarChart3 size={24} className="text-white" />}
        >
          <div className="p-6 space-y-6">
            {/* Response Time Chart */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-[#1B2A49] mb-4">
                Response Time Trend
              </h3>
              <div className="space-y-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                  (day, idx) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-sm text-[#344767] w-24">{day}</span>
                      <div className="flex-1 bg-white rounded-full h-6 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full flex items-center justify-end pr-3"
                          style={{ width: `${65 + idx * 7}%` }}
                        >
                          <span className="text-xs text-white font-semibold">
                            {25 + idx * 3}s
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Platform Performance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 border border-[#E1E8F5]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1B2A49]">
                    WhatsApp Performance
                  </h3>
                  <MessageSquare size={20} className="text-green-600" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#344767]">Messages</span>
                      <span className="font-semibold text-[#1B2A49]">156</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 rounded-full h-2"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#344767]">AI Accuracy</span>
                      <span className="font-semibold text-[#1B2A49]">97%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 rounded-full h-2"
                        style={{ width: "97%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#E1E8F5]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1B2A49]">
                    Instagram Performance
                  </h3>
                  <Instagram size={20} className="text-pink-600" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#344767]">Messages</span>
                      <span className="font-semibold text-[#1B2A49]">91</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 rounded-full h-2"
                        style={{ width: "58%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#344767]">AI Accuracy</span>
                      <span className="font-semibold text-[#1B2A49]">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 rounded-full h-2"
                        style={{ width: "94%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Queries */}
            <div className="bg-white rounded-xl p-6 border border-[#E1E8F5]">
              <h3 className="text-lg font-bold text-[#1B2A49] mb-4">
                Top Customer Queries
              </h3>
              <div className="space-y-3">
                {[
                  {
                    query: "Business hours inquiry",
                    count: 43,
                    confidence: 98,
                  },
                  { query: "Pricing questions", count: 38, confidence: 92 },
                  {
                    query: "VAT invoice requests",
                    count: 32,
                    confidence: 97,
                  },
                  {
                    query: "Service availability",
                    count: 28,
                    confidence: 95,
                  },
                  {
                    query: "License renewal help",
                    count: 22,
                    confidence: 96,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-[#F4F7FA] rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#1B2A49] mb-1">
                        {item.query}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#344767]">
                          {item.count} times asked
                        </span>
                        <span className="text-xs text-purple-600">
                          AI: {item.confidence}%
                        </span>
                      </div>
                    </div>
                    <Sparkles size={18} className="text-[#F6A821]" />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Learning Progress */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">
                AI Learning Progress This Week
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-3xl font-bold mb-1">127</div>
                  <div className="text-sm opacity-90">New patterns learned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">89%</div>
                  <div className="text-sm opacity-90">Improvement rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">4.2k</div>
                  <div className="text-sm opacity-90">
                    Data points processed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Train AI Modal */}
        <Modal
          isOpen={showTrainModal}
          onClose={() => setShowTrainModal(false)}
          title="Train AI Assistant"
          size="lg"
          showCloseButton={true}
          closeOnOverlayClick={true}
          titleIcon={<Brain size={24} className="text-white" />}
        >
          <div className="p-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span
                  className={`text-sm font-semibold ${
                    trainingStep >= 1 ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  Upload Data
                </span>
                <span
                  className={`text-sm font-semibold ${
                    trainingStep >= 2 ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  Add FAQs
                </span>
                <span
                  className={`text-sm font-semibold ${
                    trainingStep >= 3 ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  Train & Review
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(trainingStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Upload Data */}
            {trainingStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2A49] mb-2">
                    Upload Training Documents
                  </h3>
                  <p className="text-sm text-[#344767] mb-4">
                    Upload PDFs, CSVs, or text files containing FAQs, product
                    information, or past conversations.
                  </p>
                </div>

                <div className="border-2 border-dashed border-[#2E69A4] rounded-xl p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    id="file-upload"
                  />

                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload size={48} className="text-[#2E69A4] mx-auto mb-4" />
                    <p className="text-[#1B2A49] font-semibold mb-2">
                      Drop files here or click to upload
                    </p>
                    <p className="text-sm text-[#344767]">
                      Supports: PDF, CSV, TXT, DOCX (Max 10MB)
                    </p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-[#1B2A49]">
                      Uploaded Files:
                    </h4>
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-[#F4F7FA] rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={18} className="text-[#2E69A4]" />
                          <span className="text-sm text-[#344767]">{file}</span>
                        </div>
                        <button onClick={() => removeUploadedFile(idx)}>
                          <X size={18} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setTrainingStep(2)}
                    className="bg-[#1B2A49] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Add FAQs */}
            {trainingStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2A49] mb-2">
                    Add Custom FAQs
                  </h3>
                  <p className="text-sm text-[#344767] mb-4">
                    Teach the AI how to respond to specific questions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-[#1B2A49] mb-2 block">
                      Question
                    </label>
                    <input
                      type="text"
                      value={newFaq.question}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateNewFaq("question", e.target.value)
                      }
                      placeholder="e.g., What payment methods do you accept?"
                      className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#1B2A49] mb-2 block">
                      AI Response
                    </label>
                    <textarea
                      value={newFaq.answer}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        updateNewFaq("answer", e.target.value)
                      }
                      placeholder="Write the ideal response the AI should give..."
                      rows={4}
                      className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#1B2A49] mb-2 block">
                      Category
                    </label>
                    <select
                      value={newFaq.category}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        updateNewFaq("category", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
                    >
                      <option>General</option>
                      <option>Billing</option>
                      <option>Product</option>
                      <option>Support</option>
                    </select>
                  </div>

                  <button className="w-full border-2 border-[#2E69A4] text-[#2E69A4] px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                    <Plus size={20} />
                    Add FAQ to Training
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1B2A49] mb-1">
                        AI Suggestion
                      </h4>
                      <p className="text-sm text-[#344767]">
                        Based on your recent conversations, we recommend adding
                        FAQs about &qout;delivery timeframes&qout; and
                        &qout;refund policy&qout;.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setTrainingStep(1)}
                    className="border-2 border-[#2E69A4] text-[#2E69A4] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setTrainingStep(3)}
                    className="bg-[#1B2A49] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Train & Review */}
            {trainingStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2A49] mb-2">
                    Review & Train AI
                  </h3>
                  <p className="text-sm text-[#344767] mb-4">
                    Review your training data and start the AI learning process.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <Database size={24} className="text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-[#1B2A49]">
                      {uploadedFiles.length}
                    </div>
                    <div className="text-sm text-[#344767]">
                      Documents Uploaded
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <MessageCircle size={24} className="text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-[#1B2A49]">15</div>
                    <div className="text-sm text-[#344767]">FAQs Ready</div>
                  </div>
                </div>

                {!isTraining ? (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          size={20}
                          className="text-amber-600 mt-1"
                        />
                        <div>
                          <h4 className="font-semibold text-[#1B2A49] mb-1">
                            Training Information
                          </h4>
                          <p className="text-sm text-[#344767]">
                            The AI will analyze your data and learn patterns.
                            This process takes 2-5 minutes. You can continue
                            using the platform while training runs in the
                            background.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="terms"
                          defaultChecked
                          className="w-4 h-4 text-[#2E69A4]"
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-[#344767]"
                        >
                          Enable continuous learning from new conversations
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="privacy"
                          defaultChecked
                          className="w-4 h-4 text-[#2E69A4]"
                        />
                        <label
                          htmlFor="privacy"
                          className="text-sm text-[#344767]"
                        >
                          Maintain customer privacy and data security
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setTrainingStep(2)}
                        className="border-2 border-[#2E69A4] text-[#2E69A4] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleTrainAI}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <Wand2 size={20} />
                        Start AI Training
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Brain size={40} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1B2A49] mb-2">
                        AI Training in Progress...
                      </h3>
                      <p className="text-sm text-[#344767]">
                        Analyzing patterns and learning from your data
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#344767]">
                          Training Progress
                        </span>
                        <span className="font-semibold text-[#1B2A49]">
                          {trainingProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full h-3 transition-all duration-300"
                          style={{ width: `${trainingProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {trainingProgress !== 100 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[#344767]">
                          {trainingProgress > 20 ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-[#2E69A4] border-t-transparent rounded-full animate-spin"></div>
                          )}
                          <span>Analyzing documents and FAQs</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#344767]">
                          {trainingProgress > 40 ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-[#2E69A4] border-t-transparent rounded-full animate-spin"></div>
                          )}
                          <span>Building knowledge graph</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#344767]">
                          {trainingProgress > 50 ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-[#2E69A4] border-t-transparent rounded-full animate-spin"></div>
                          )}
                          <span>Training neural network</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#344767]">
                          {trainingProgress > 80 ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-[#2E69A4] border-t-transparent rounded-full animate-spin"></div>
                          )}
                          <span>Optimizing response generation</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
                        <CheckCircle
                          size={48}
                          className="text-green-600 mx-auto mb-3"
                        />
                        <h3 className="text-lg font-bold text-green-900 mb-1">
                          Training Complete!
                        </h3>
                        <p className="text-sm text-green-700">
                          Your AI assistant is now smarter and ready to help
                          customers.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
