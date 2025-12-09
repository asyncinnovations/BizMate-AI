"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MessageCircle,
  Send,
  Check,
  CheckCheck,
  Zap,
  MoreVertical,
  MessageSquare,
  Users,
  Mail,
  Settings,
  RefreshCw,
  Copy,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
<<<<<<< HEAD

// Types
interface Client {
  id: string;
=======
import StatCard from "@/components/stat-card/StatCard";
import Modal from "@/components/ui/Modal";
import ReplyCard from "@/components/auto-reply-card/ReplyCard";
import SocialAccounts from "@/components/social_accounts/SocialAccounts";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/page-header/PageHeader";

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
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
  name: string;
  platform: "whatsapp" | "instagram" | "facebook" | "email";
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  aiEnabled: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  type: "incoming" | "outgoing";
  status: "sent" | "delivered" | "read";
}

interface Platform {
  name: string;
  icon: "whatsapp" | "instagram" | "facebook" | "email";
  connected: boolean;
  lastSync: string;
  color: string;
}

// Dummy data
const dummyClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    platform: "whatsapp",
    lastMessage: "Thanks for the update! When can I expect delivery?",
    timestamp: "2 min ago",
    unreadCount: 3,
    aiEnabled: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    platform: "instagram",
    lastMessage: "Do you have this in other colors?",
    timestamp: "1 hour ago",
    unreadCount: 1,
    aiEnabled: false,
  },
  {
    id: "3",
    name: "Emma Davis",
    platform: "facebook",
    lastMessage: "The package arrived damaged",
    timestamp: "3 hours ago",
    unreadCount: 0,
    aiEnabled: true,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    platform: "whatsapp",
    lastMessage: "Can you help me with my account?",
    timestamp: "5 hours ago",
    unreadCount: 2,
    aiEnabled: false,
  },
  {
    id: "5",
    name: "Priya Sharma",
    platform: "email",
    lastMessage: "Thank you for your assistance!",
    timestamp: "1 day ago",
    unreadCount: 0,
    aiEnabled: true,
  },
];

const dummyMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1-1",
      text: "Hi, I ordered a product last week and wanted to check the status",
      timestamp: "10:30 AM",
      type: "incoming",
      status: "read",
    },
    {
      id: "1-2",
      text: "Hello Sarah! I can check that for you. Your order #12345 is currently being processed and will ship tomorrow.",
      timestamp: "10:32 AM",
      type: "outgoing",
      status: "read",
    },
    {
      id: "1-3",
      text: "Thanks for the update! When can I expect delivery?",
      timestamp: "10:33 AM",
      type: "incoming",
      status: "read",
    },
    {
      id: "1-4",
      text: "Great, that helps. Do you provide tracking information?",
      timestamp: "10:34 AM",
      type: "incoming",
      status: "read",
    },
    {
      id: "1-5",
      text: "Yes, we'll send tracking as soon as it ships",
      timestamp: "10:35 AM",
      type: "outgoing",
      status: "read",
    },
  ],
  "2": [
    {
      id: "2-1",
      text: "Hi, I saw your new collection online",
      timestamp: "9:15 AM",
      type: "incoming",
      status: "read",
    },
    {
      id: "2-2",
      text: "Do you have this in other colors?",
      timestamp: "9:20 AM",
      type: "incoming",
      status: "delivered",
    },
  ],
  "3": [
    {
      id: "3-1",
      text: "The package arrived damaged",
      timestamp: "8:45 AM",
      type: "incoming",
      status: "read",
    },
    {
      id: "3-2",
      text: "I'm sorry to hear that! Can you send photos of the damage? We'll arrange a replacement immediately.",
      timestamp: "8:50 AM",
      type: "outgoing",
      status: "read",
    },
  ],
};

const dummyAISuggestions: Record<string, string> = {
  "1": "We'll provide tracking information within 24 hours of shipment. You'll receive an email with all the details once your order ships.",
  "2": "Yes! This item comes in blue, black, and red. Would you like to see photos of the other colors?",
  "3": "I apologize for the inconvenience. Please send photos of the damaged items and we'll process a replacement immediately.",
};

const platformIcons = {
  whatsapp: MessageCircle,
  instagram: MessageSquare,
  facebook: Users,
  email: Mail,
};

const platformColors = {
  whatsapp: "#25D366",
  instagram: "#E4405F",
  facebook: "#1877F2",
  email: "#EA4335",
};

const platformBgColors = {
  whatsapp: "#DCF8C6",
  instagram: "#FCE4EC",
  facebook: "#E7F3FF",
  email: "#FCE8E6",
};

const platformLabels = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
  email: "Email",
};

const connectedPlatforms: Platform[] = [
  {
    name: "WhatsApp",
    icon: "whatsapp",
    connected: true,
    lastSync: "2 min ago",
    color: "#25D366",
  },
  {
    name: "Instagram",
    icon: "instagram",
    connected: true,
    lastSync: "5 min ago",
    color: "#E4405F",
  },
  {
    name: "Facebook",
    icon: "facebook",
    connected: true,
    lastSync: "1 hour ago",
    color: "#1877F2",
  },
  {
    name: "Email",
    icon: "email",
    connected: true,
    lastSync: "10 min ago",
    color: "#EA4335",
  },
];

const AIReplyHubDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(dummyClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    dummyClients[0]
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiSuggestion, setAISuggestion] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [aiAutoReply, setAiAutoReply] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filter clients based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = dummyClients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setClients(filtered);
    } else {
      setClients(dummyClients);
    }
  }, [searchQuery]);

  // Load messages and AI suggestions when client is selected
  useEffect(() => {
    if (selectedClient) {
      const clientMessages = dummyMessages[selectedClient.id] || [];
      setMessages(clientMessages);

      const suggestion = dummyAISuggestions[selectedClient.id] || "";
      setAISuggestion(suggestion);

      setAiAutoReply(selectedClient.aiEnabled);

      // Clear unread count for selected client
      setClients((prev) =>
        prev.map((client) =>
          client.id === selectedClient.id
            ? { ...client, unreadCount: 0 }
            : client
        )
      );
    }
  }, [selectedClient]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedClient) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "outgoing",
      status: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    // Simulate status updates
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMsg.id ? { ...msg, status: "read" } : msg
        )
      );
    }, 3000);
  };

  const handleInsertAISuggestion = () => {
    if (aiSuggestion) {
      setNewMessage(aiSuggestion);
    }
  };

  const handleRegenerateSuggestion = () => {
    if (!selectedClient) return;
    // Simulate AI regeneration
    const newSuggestion = `Alternative response: ${
      dummyAISuggestions[selectedClient.id]
    }`;
    setAISuggestion(newSuggestion);
  };

  const handleToggleAI = () => {
    if (!selectedClient) return;

    setAiAutoReply(!aiAutoReply);
    setClients((prev) =>
      prev.map((client) =>
        client.id === selectedClient.id
          ? { ...client, aiEnabled: !aiAutoReply }
          : client
      )
    );
  };

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check size={14} style={{ color: "#6B7280" }} />;
      case "delivered":
        return <CheckCheck size={14} style={{ color: "#6B7280" }} />;
      case "read":
        return <CheckCheck size={14} style={{ color: "#2E69A4" }} />;
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: Client["platform"]) => {
    const IconComponent = platformIcons[platform];
    return (
      <IconComponent size={12} style={{ color: platformColors[platform] }} />
    );
  };

  const getAvatarLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getLatestUnansweredMessage = () => {
    const incomingMessages = messages.filter((msg) => msg.type === "incoming");
    return incomingMessages[incomingMessages.length - 1];
  };

  return (
    <DashboardLayout>
<<<<<<< HEAD
      <div
        className="h-screen flex overflow-hidden"
        style={{ backgroundColor: "#F4F7FA" }}
      >
        {/* Left Sidebar - Clients List */}
        <div
          className="w-1/4 flex flex-col"
          style={{
            backgroundColor: "#FFFFFF",
            borderRight: "1px solid #E1E8F5",
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "#E1E8F5" }}
          >
            <h1 className="text-xl font-bold" style={{ color: "#1B2A49" }}>
              Conversations
            </h1>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <div
              className="flex items-center px-3 py-2 rounded-lg border transition-all"
              style={{
                backgroundColor: "#F4F7FA",
                borderColor: "#E1E8F5",
              }}
            >
              <Search size={16} style={{ color: "#2E69A4" }} className="mr-2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm placeholder-gray-400 focus:outline-none w-full"
                style={{ color: "#344767" }}
              />
            </div>
          </div>

          {/* Clients List */}
          <div className="flex-1 overflow-y-auto">
            {clients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="px-4 py-3 cursor-pointer transition-colors border-b"
                style={{
                  backgroundColor:
                    selectedClient?.id === client.id ? "#F0F3F8" : "#FFFFFF",
                  borderColor: "#E1E8F5",
                }}
                onMouseEnter={(e) => {
                  if (selectedClient?.id !== client.id) {
                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClient?.id !== client.id) {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#2E69A4" }}
                  >
                    {getAvatarLetter(client.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "#1B2A49" }}
                      >
                        {client.name}
                      </p>
                      {client.unreadCount > 0 && (
                        <span
                          className="text-white text-xs px-2 py-1 rounded-full font-bold"
                          style={{
                            fontSize: "10px",
                            backgroundColor: "#2E69A4",
                          }}
                        >
                          {client.unreadCount}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs mt-1 truncate"
                      style={{ color: "#6B7280" }}
                    >
                      {client.lastMessage}
                    </p>

                    {/* Platform Badge and AI Badge in one row */}
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: platformBgColors[client.platform],
                          color: platformColors[client.platform],
                        }}
                      >
                        {getPlatformIcon(client.platform)}
                        <span>{platformLabels[client.platform]}</span>
                      </div>

                      {client.aiEnabled && (
                        <span
                          className="text-xs px-2 py-1 rounded font-medium inline-flex items-center gap-1"
                          style={{
                            backgroundColor: "#E8F4FD",
                            color: "#2E69A4",
                          }}
                        >
                          <Zap size={10} />
                          <span>AI</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex-shrink-0">
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      {client.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Chat Area */}
        <div
          className="w-1/2 flex flex-col"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {/* Chat Header */}
          {selectedClient && (
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: "#E1E8F5", backgroundColor: "#FFFFFF" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: "#2E69A4" }}
                >
                  {getAvatarLetter(selectedClient.name)}
                </div>
                <div>
                  <h2
                    className="text-base font-semibold"
                    style={{ color: "#1B2A49" }}
                  >
                    {selectedClient.name}
                  </h2>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {platformLabels[selectedClient.platform]}
                  </p>
                </div>
              </div>
              <button
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: "#344767" }}
              >
                <MoreVertical size={18} />
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "incoming" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                    message.type === "incoming" ? "text-gray-800" : "text-white"
                  }`}
                  style={{
                    backgroundColor:
                      message.type === "incoming" ? "#F3F4F6" : "#2E69A4",
                  }}
                >
                  <p className="text-sm break-words">{message.text}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span
                      className="text-xs opacity-70"
                      style={{
                        color:
                          message.type === "incoming"
                            ? "#6B7280"
                            : "rgba(255,255,255,0.8)",
                      }}
                    >
                      {message.timestamp}
                    </span>
                    {message.type === "outgoing" &&
                      getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input - Updated to textarea with button inside */}
          <div
            className="px-6 py-4 border-t"
            style={{ borderColor: "#E1E8F5" }}
          >
            <div className="relative">
              <textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-1 transition-all text-sm resize-none"
                style={{
                  borderColor: "#E1E8F5",
                  color: "#344767",
                  backgroundColor: "#F9FAFB",
                  minHeight: "80px",
                  maxHeight: "120px",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2E69A4";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E1E8F5";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="absolute bottom-3 right-3 p-2 text-white rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#2E69A4" }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Assistant Panel */}
        <div
          className="w-1/4 flex flex-col border-l p-6 overflow-y-auto"
          style={{ borderColor: "#E1E8F5", backgroundColor: "#FFFFFF" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold" style={{ color: "#1B2A49" }}>
              AI Assistant
            </h3>
            <Settings
              size={18}
              style={{ color: "#2E69A4", cursor: "pointer" }}
            />
          </div>

          {/* AI Toggle */}
          <div
            className="mb-6 p-4 rounded-lg"
            style={{ backgroundColor: "#F9FAFB", border: "1px solid #E1E8F5" }}
          >
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-sm font-semibold"
                style={{ color: "#344767" }}
              >
                Auto-Reply
              </label>
              <button
                onClick={handleToggleAI}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{
                  backgroundColor: aiAutoReply ? "#2E69A4" : "#D1D5DB",
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    aiAutoReply ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              {aiAutoReply ? "✓ Active" : "○ Inactive"}
            </p>
          </div>

          {/* AI Reply Context */}
          <div className="mb-6">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#344767" }}
            >
              Reply Context
            </label>
            <div
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: "#F9FAFB",
                borderColor: "#E1E8F5",
              }}
            >
              <p className="text-sm" style={{ color: "#344767" }}>
                {getLatestUnansweredMessage()?.text ||
                  "No recent messages to reply to"}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={{ color: "#6B7280" }}>
                  Latest message from client
                </span>
                <Zap size={14} style={{ color: "#2E69A4" }} />
              </div>
            </div>
          </div>

          {/* AI Suggested Reply */}
          {aiAutoReply && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: "#344767" }}
                >
                  Suggested Response
                </label>
                <button
                  onClick={handleRegenerateSuggestion}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: "#2E69A4" }}
                >
                  <RefreshCw size={12} />
                  <span>Regenerate</span>
                </button>
=======
      <div className="min-h-screen p-4 mb-4">
        <div className="w-full">
          {/* Header */}
          <PageHeader
            title="AI Communication Hub"
            description="Intelligent auto-replies powered by advanced machine learning"
            showAIBadge={true}
            icon={<MessageSquare size={24} />}
            buttons={[
              {
                text: "Analytics",
                onClick: () => setShowAnalytics(!showAnalytics),
                icon: <BarChart3 size={20} />,
              },
              {
                text: "Upload Info",
                onClick: () => setShowTrainModal(true),
                icon: <Brain size={20} />,
                className: "bg-[#F6A821] hover:bg-[#e29819]",
              },
            ]}
          />

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
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
              </div>
            </div>

<<<<<<< HEAD
              <div
                className="p-3 rounded-lg border mb-3"
                style={{
                  backgroundColor: "#F9FAFB",
                  borderColor: "#E1E8F5",
                }}
              >
                <p className="text-sm" style={{ color: "#344767" }}>
                  {aiSuggestion || "No AI suggestion available"}
                </p>
              </div>

              {/* Buttons in Single Row */}
              <div className="flex gap-2">
                <button
                  onClick={handleInsertAISuggestion}
                  disabled={!aiSuggestion}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-white rounded-lg transition-all hover:shadow-md disabled:opacity-50 font-medium text-sm"
                  style={{ backgroundColor: "#2E69A4" }}
                >
                  <Copy size={14} />
                  <span>Insert</span>
                </button>
              </div>
            </div>
          )}

          {!aiAutoReply && (
            <div
              className="p-4 rounded-lg border-2 text-center mb-6"
              style={{ backgroundColor: "#F0F3F8", borderColor: "#2E69A4" }}
            >
              <p className="text-sm font-medium" style={{ color: "#1B2A49" }}>
                Enable AI to get smart suggestions for this conversation.
              </p>
            </div>
          )}

          {/* Connected Accounts Overview */}
          <div className="mb-6">
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#1B2A49" }}
            >
              Connected Accounts
            </h4>
            <div className="space-y-3">
              {connectedPlatforms.map((platform, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderColor: "#E1E8F5",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.icon === "whatsapp" && (
                        <MessageCircle size={18} />
                      )}
                      {platform.icon === "instagram" && (
                        <MessageSquare size={18} />
                      )}
                      {platform.icon === "facebook" && <Users size={18} />}
                      {platform.icon === "email" && <Mail size={18} />}
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#344767" }}
                      >
                        {platform.name}
                      </p>
                      <p className="text-xs" style={{ color: "#6B7280" }}>
                        Last sync: {platform.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        backgroundColor: "#E8F4FD",
                        color: "#2E69A4",
                      }}
                    >
                      ● Connected
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
=======
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
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
      </div>
    </DashboardLayout>
  );
};

export default AIReplyHubDashboard;
