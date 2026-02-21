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

// Types
interface Client {
  id: string;
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
              </div>

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
      </div>
    </DashboardLayout>
  );
};

export default AIReplyHubDashboard;
