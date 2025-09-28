"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Clock,
  Download,
  AlertCircle,
  Calendar,
  FileText,
  HelpCircle,
  Languages,
  Search,
  Building,
  FileCheck,
  Users,
  Settings,
  Star,
  Bot,
  Sparkles,
  Shield,
  TrendingUp,
  Bell,
  BellOff,
} from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  hasReminder?: boolean;
  isPinned?: boolean;
  confidence?: number;
  sources?: string[];
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  category: string;
  status: "pending" | "completed" | "overdue";
  messageId?: string;
}

interface ConversationHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messageCount: number;
  category: string;
  rating?: number;
}

const ComplianceAssistancePage = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Welcome to your AI Compliance Assistant! I specialize in UAE business regulations, VAT compliance, license renewals, and government procedures. I'm here to provide accurate, up-to-date guidance tailored to your business needs.\n\nHow can I help you today?",
      isUser: false,
      timestamp: new Date(),
      confidence: 100,
      sources: [
        "UAE Federal Tax Authority",
        "Department of Economic Development",
      ],
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "reminders" | "history" | "templates"
  >("reminders");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "VAT Filing Deadline - Q3 2024",
      description: "Quarterly VAT return submission to FTA",
      deadline: "2024-10-28",
      priority: "high",
      category: "tax",
      status: "pending",
    },
    {
      id: "2",
      title: "Trade License Renewal",
      description: "Annual renewal with DED",
      deadline: "2024-11-15",
      priority: "high",
      category: "licensing",
      status: "pending",
    },
    {
      id: "3",
      title: "ESR Notification",
      description: "Economic Substance Regulation submission",
      deadline: "2024-12-31",
      priority: "medium",
      category: "reporting",
      status: "pending",
    },
  ]);

  const conversationHistory: ConversationHistory[] = [
    {
      id: "1",
      title: "VAT Calculation for Services",
      preview: "How to calculate VAT for consulting services in UAE?",
      timestamp: new Date("2024-09-25"),
      messageCount: 4,
      category: "tax",
      rating: 5,
    },
    {
      id: "2",
      title: "License Renewal Process",
      preview: "Steps for Dubai trade license renewal requirements...",
      timestamp: new Date("2024-09-20"),
      messageCount: 6,
      category: "licensing",
      rating: 4,
    },
    {
      id: "3",
      title: "Employee Contract Clauses",
      preview: "Mandatory requirements for UAE employment contracts",
      timestamp: new Date("2024-09-15"),
      messageCount: 5,
      category: "hr",
      rating: 5,
    },
  ];

  const quickTemplates = [
    {
      title: "VAT Filing Query",
      prompt: "What are the steps for VAT filing in UAE for Q3 2024?",
      category: "tax",
      description: "Complete filing process",
    },
    {
      title: "License Renewal",
      prompt: "What documents are needed for trade license renewal?",
      category: "licensing",
      description: "Required documents",
    },
    {
      title: "Employee Visa",
      prompt: "Process for new employee visa sponsorship?",
      category: "hr",
      description: "Visa requirements",
    },
  ];

  const sampleResponses = [
    "According to UAE Federal Tax Authority guidelines, VAT returns must be filed within 28 days after the tax period. For Q3 2024, deadline is October 28th.\n\n**Required:**\n• TRN Number\n• Financial records\n• Supporting invoices\n• Bank statements\n\n**Steps:**\n1. Log into FTA portal\n2. Access VAT return form\n3. Enter taxable supplies\n4. Review calculations\n5. Submit before deadline",
    "Trade license renewal in Dubai requires several documents:\n\n**Documents:**\n• DED application form\n• Current license copy\n• Passport copies\n• Valid tenancy contract\n\n**Timeline:**\n• Preparation: 2-3 days\n• Processing: 5-7 days\n• Approval: 1-2 days",
    "UAE VAT operates at 5% for most taxable supplies:\n\n**Standard Rate (5%):**\n• Goods and services\n• Restaurant meals\n• Professional services\n\n**Zero-Rated:**\n• Exports\n• International transport\n• Residential sales",
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || newMessage;
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const randomResponse =
      sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: randomResponse,
      isUser: false,
      timestamp: new Date(),
      confidence: Math.floor(Math.random() * 15) + 85,
      sources: ["UAE FTA Guidelines", "DED Portal"],
    };

    setChatMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleReminder = (messageId: string, messageContent: string) => {
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, hasReminder: !msg.hasReminder } : msg
      )
    );

    // Check if reminder already exists for this message
    const existingReminder = reminders.find(
      (reminder) => reminder.messageId === messageId
    );

    if (existingReminder) {
      // Remove reminder if it exists
      setReminders((prev) =>
        prev.filter((reminder) => reminder.messageId !== messageId)
      );
    } else {
      // Add new reminder
      const newReminder: Reminder = {
        id: `reminder-${Date.now()}`,
        title: `Reminder: ${messageContent.split("\n")[0].substring(0, 30)}...`,
        description: messageContent.substring(0, 100) + "...",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 7 days from now
        priority: "medium",
        category: "general",
        status: "pending",
        messageId: messageId,
      };
      setReminders((prev) => [...prev, newReminder]);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-emerald-500";
      default:
        return "bg-slate-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tax":
        return <FileCheck className="h-3 w-3" />;
      case "licensing":
        return <Building className="h-3 w-3" />;
      case "hr":
        return <Users className="h-3 w-3" />;
      case "reporting":
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-2 w-2 ${
          i < rating ? "text-amber-400 fill-current" : "text-slate-300"
        }`}
      />
    ));
  };

  return (
    <DashboardLayout>
      <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
        {/* Compact Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1b2a49] rounded-lg flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-slate-900">
                      Compliance Assistant
                    </h1>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <Shield className="h-3 w-3 text-emerald-500" />
                      AI-powered UAE regulations expert
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 px-3 py-1.5 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium">
                  <Languages className="h-3 w-3" />
                  العربية
                </button>
                <button className="px-4 py-1.5 bg-[#1b2a49] text-white rounded-lg text-xs font-medium hover:bg-[#1b2a49]">
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Compact Sidebar */}
          <div
            className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 w-80`}
          >
            {
              <>
                {/* Sidebar Tabs */}
                <div className="p-3 border-b border-slate-200">
                  <div className="flex p-1 bg-slate-100 rounded-lg">
                    <button
                      onClick={() => setActiveTab("reminders")}
                      className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 rounded-md ${
                        activeTab === "reminders"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <AlertCircle className="h-3 w-3" />
                      Reminders
                    </button>
                    <button
                      onClick={() => setActiveTab("history")}
                      className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 rounded-md ${
                        activeTab === "history"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      History
                    </button>
                    <button
                      onClick={() => setActiveTab("templates")}
                      className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 rounded-md ${
                        activeTab === "templates"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <FileText className="h-3 w-3" />
                      Templates
                    </button>
                  </div>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {activeTab === "reminders" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Deadlines
                        </h3>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          {
                            reminders.filter((r) => r.status === "pending")
                              .length
                          }{" "}
                          pending
                        </span>
                      </div>
                      {reminders.map((reminder) => (
                        <div
                          key={reminder.id}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-white rounded">
                                {getCategoryIcon(reminder.category)}
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900">
                                  {reminder.title}
                                </h4>
                                <p className="text-xs text-slate-600 mt-0.5">
                                  {reminder.description}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#1b2a49] flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(reminder.deadline).toLocaleDateString()}
                            </span>
                            <div
                              className={`w-2 h-2 rounded-full ${getPriorityColor(
                                reminder.priority
                              )}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "history" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">
                          History
                        </h3>
                        <div className="relative">
                          <Search className="h-3 w-3 absolute left-2 top-1.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search..."
                            className="pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg w-32 focus:outline-none focus:border-[#1b2a49]"
                          />
                        </div>
                      </div>
                      {conversationHistory.map((conversation) => (
                        <div
                          key={conversation.id}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-2 flex-1">
                              <div className="p-1.5 bg-white rounded">
                                {getCategoryIcon(conversation.category)}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-semibold text-slate-900 mb-1">
                                  {conversation.title}
                                </h4>
                                <p className="text-xs text-slate-600 line-clamp-2">
                                  {conversation.preview}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              {conversation.timestamp.toLocaleDateString()}
                            </span>
                            {conversation.rating && (
                              <div className="flex items-center gap-0.5">
                                {renderStars(conversation.rating)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "templates" && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Templates
                      </h3>
                      {quickTemplates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(template.prompt)}
                          className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white rounded">
                              {getCategoryIcon(template.category)}
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-slate-900">
                                {template.title}
                              </h4>
                              <p className="text-xs text-slate-600">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="p-3 border-t border-slate-200">
                  <div className="grid grid-cols-4 gap-2">
                    <button className="flex flex-col items-center p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-xs">
                      <FileText className="h-3 w-3 text-[#1b2a49] mb-1" />
                      <span>Docs</span>
                    </button>
                    <button className="flex flex-col items-center p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-xs">
                      <Download className="h-3 w-3 text-emerald-600 mb-1" />
                      <span>Export</span>
                    </button>
                    <button className="flex flex-col items-center p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-xs">
                      <Calendar className="h-3 w-3 text-amber-600 mb-1" />
                      <span>Calendar</span>
                    </button>
                    <button className="flex flex-col items-center p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-xs">
                      <HelpCircle className="h-3 w-3 text-purple-600 mb-1" />
                      <span>Help</span>
                    </button>
                  </div>
                </div>
              </>
            }
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="border-b border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#1f4c78] to-[#1b2a49] rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      AI Compliance Assistant
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        Online
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600">
                      UAE business regulations • Fast responses
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-slate-100 rounded">
                    <Settings className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages - Wider Container */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="max-w-5xl mx-auto space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3xl ${
                        message.isUser ? "ml-16" : "mr-16"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {!message.isUser && (
                          <div className="w-6 h-6 bg-[#1b2a49] rounded flex items-center justify-center">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span className="text-xs font-medium text-slate-700">
                          {message.isUser ? "You" : "Assistant"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {!message.isUser && message.confidence && (
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            {message.confidence}%
                          </span>
                        )}
                      </div>
                      <div
                        className={`rounded-xl px-4 py-3 ${
                          message.isUser
                            ? "bg-[#1b2a49] text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        <div className="text-sm leading-6 whitespace-pre-wrap">
                          {message.content.split("\n").map((line, index) => {
                            if (line.startsWith("**") && line.endsWith("**")) {
                              return (
                                <div
                                  key={index}
                                  className={`font-semibold mt-2 mb-1 ${
                                    message.isUser
                                      ? "text-blue-100"
                                      : "text-slate-800"
                                  }`}
                                >
                                  {line.slice(2, -2)}
                                </div>
                              );
                            } else if (line.startsWith("• ")) {
                              return (
                                <div
                                  key={index}
                                  className={`ml-3 ${
                                    message.isUser
                                      ? "text-blue-50"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {line}
                                </div>
                              );
                            } else if (line.match(/^\d+\./)) {
                              return (
                                <div
                                  key={index}
                                  className={`ml-3 font-medium ${
                                    message.isUser
                                      ? "text-blue-50"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {line}
                                </div>
                              );
                            }
                            return (
                              line && (
                                <div key={index} className="mb-1">
                                  {line}
                                </div>
                              )
                            );
                          })}
                        </div>
                        {!message.isUser && message.sources && (
                          <div className="mt-2 pt-2 border-t border-slate-200/40">
                            <div className="flex flex-wrap gap-1">
                              {message.sources.map((source, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-white/80 text-slate-600 px-2 py-0.5 rounded"
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div
                        className={`flex items-center gap-2 mt-1 text-xs ${
                          message.isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!message.isUser && (
                          <>
                            <button className="text-slate-500 hover:text-slate-700">
                              Copy
                            </button>
                            <button className="text-slate-500 hover:text-slate-700">
                              Save
                            </button>
                            <button
                              onClick={() =>
                                toggleReminder(message.id, message.content)
                              }
                              className={`flex items-center gap-1 ${
                                message.hasReminder
                                  ? "text-amber-600 hover:text-amber-700"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              {message.hasReminder ? (
                                <>
                                  <Bell className="h-3 w-3" />
                                  Reminder Set
                                </>
                              ) : (
                                <>
                                  <BellOff className="h-3 w-3" />
                                  Set Reminder
                                </>
                              )}
                            </button>
                            <button className="text-slate-500 hover:text-slate-700">
                              Helpful
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl mr-16">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-[#1b2a49] rounded flex items-center justify-center">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-slate-700">
                          Assistant
                        </span>
                        <span className="text-xs text-slate-500">
                          typing...
                        </span>
                      </div>
                      <div className="bg-slate-100 rounded-xl px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-[#1b2a49] rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-[#1b2a49] rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-[#1b2a49] rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-slate-200 p-4">
              <div className="max-w-5xl mx-auto">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="relative bg-white border border-slate-200 rounded-lg focus-within:[#1b2a49]">
                      <textarea
                        placeholder="Ask about UAE compliance, VAT, licenses..."
                        className="w-full border-0 rounded-lg px-3 py-2 pr-12 focus:outline-none resize-none text-sm"
                        rows={2}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={isLoading || !newMessage.trim()}
                        className={`absolute right-2 bottom-2 p-1.5 rounded ${
                          isLoading || !newMessage.trim()
                            ? "text-slate-400"
                            : "bg-[#1b2a49] text-white hover:bg-[#1b2a49]"
                        }`}
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                      <span>Press Enter to send</span>
                      <span>Shift+Enter for new line</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceAssistancePage;
