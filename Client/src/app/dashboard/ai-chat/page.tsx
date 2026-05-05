"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  Bot,
  Sparkles,
  Shield,
  Trash2,
  Search,
  MessageSquare,
  FileCheck,
  Building,
  Users,
  TrendingUp,
  FileText,
  Bell,
  ChevronRight,
  Calendar,
  Languages,
  BellPlus,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import MessageItem from "@/components/message-item/MessageItem";
import HistoryItem from "@/components/chat-history-item/HistoryItem";
import { renderContent } from "@/utils/renderContent";

// ================= TYPES ================= (exported for components)
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  confidence?: number;
  sources?: string[];
  reminderState?: "idle" | "saving" | "saved";
  savedReminder?: SavedReminder;
}

export interface ChatHistoryItem {
  uuid: string;
  user_id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export type ReminderType = "VAT" | "License" | "Payroll" | "Custom";
export type ReminderStatus = "pending";
export type RecurrenceRule = "none" | "monthly" | "quarterly" | "yearly";

export interface SavedReminder {
  id: string;
  title: string;
  description: string;
  type: ReminderType;
  reminder_date: string;
  notify_before: number;
  recurrence_rule: RecurrenceRule;
  status: ReminderStatus;
}

// ================= HELPERS =================
export const fmtTime = (d: Date) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const relativeDate = (s: string) => {
  const d = Math.floor((Date.now() - new Date(s).getTime()) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const typeColor: Record<ReminderType, string> = {
  VAT: "bg-status-error-bg text-status-error",
  License: "bg-status-warning-bg text-status-warning",
  Payroll: "bg-status-success-bg text-status-success",
  Custom: "bg-bg-base text-text-muted border border-border",
};

// Reads the AI message, detects type + deadline, builds reminder data
export const extractReminderData = (
  content: string,
  msgId: string,
): SavedReminder => {
  const lower = content.toLowerCase();

  let type: ReminderType = "Custom";
  let recurrence: RecurrenceRule = "none";
  let daysOut = 30;

  if (
    lower.includes("vat") ||
    lower.includes("fta") ||
    lower.includes("tax return")
  ) {
    type = "VAT";
    recurrence = "quarterly";
    daysOut = 28;
  } else if (
    lower.includes("license") ||
    lower.includes("licence") ||
    lower.includes("ded")
  ) {
    type = "License";
    recurrence = "yearly";
    daysOut = 90;
  } else if (
    lower.includes("payroll") ||
    lower.includes("wps") ||
    lower.includes("salary")
  ) {
    type = "Payroll";
    recurrence = "monthly";
    daysOut = 30;
  }

  // Try to find an explicit date like "28/10/2024" or "October 28"
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i,
  ];
  let detectedDate: string | null = null;
  for (const pattern of datePatterns) {
    const match = content.match(pattern);
    if (match) {
      const parsed = new Date(match[0]);
      if (!isNaN(parsed.getTime())) {
        detectedDate = parsed.toISOString().split("T")[0];
        break;
      }
    }
  }
  const deadline =
    detectedDate ||
    new Date(Date.now() + daysOut * 86400000).toISOString().split("T")[0];

  const cleanLines = content
    .split("\n")
    .map((l) => l.replace(/[*•\d.]/g, "").trim())
    .filter((l) => l.length > 10);
  const rawTitle = cleanLines[0] || `${type} Compliance Reminder`;
  const title =
    rawTitle.length > 55 ? rawTitle.substring(0, 52) + "..." : rawTitle;

  return {
    id: `r-${msgId}`,
    title,
    description: content.replace(/\n+/g, " ").substring(0, 120) + "...",
    type,
    reminder_date: deadline,
    notify_before: 3,
    recurrence_rule: recurrence,
    status: "pending",
  };
};

// ================= STATIC DATA =================
const QUICK_PROMPTS = [
  {
    icon: <FileCheck className="w-4 h-4" />,
    label: "VAT Filing",
    prompt: "What are the steps for VAT filing in UAE for Q3 2024?",
  },
  {
    icon: <Building className="w-4 h-4" />,
    label: "License Renewal",
    prompt: "What documents are needed for trade license renewal?",
  },
  {
    icon: <Users className="w-4 h-4" />,
    label: "Employee Visa",
    prompt: "Process for new employee visa sponsorship in UAE?",
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    label: "ESR Compliance",
    prompt: "What are the Economic Substance Regulations requirements?",
  },
  {
    icon: <Shield className="w-4 h-4" />,
    label: "AML Requirements",
    prompt: "What are AML requirements for SMEs in UAE?",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: "Corporate Tax",
    prompt: "How does UAE Corporate Tax apply to my business?",
  },
];

const WELCOME: ChatMessage = {
  id: "welcome",
  content:
    "Hello! I'm your UAE Compliance Assistant, powered by AI. I can help you navigate:\n\n• VAT filing and FTA regulations\n• Trade license renewals and DED procedures\n• Employment and visa compliance\n• ESR and AML requirements\n• Corporate tax guidance\n\nWhat would you like to know?",
  isUser: false,
  timestamp: new Date(),
  confidence: 100,
  sources: ["UAE Federal Tax Authority", "Department of Economic Development"],
};

// ================= PAGE =================
const ComplianceAssistancePage = () => {
  const { user } = useAuth();
  const userId = user?.user?.user_id;

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"chats" | "reminders">("chats");
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isNewChat, setIsNewChat] = useState(true);
  const [savedReminders, setSavedReminders] = useState<SavedReminder[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [input]);
  useEffect(() => {
    if (userId) fetchHistory();
  }, [userId]);

  //////////////////////////////////////////
  // Fetch User Chat History
  ////////////////////////////////////////
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axiosInstance.get(
        `/compliance_assistant_chat/user/history/${userId}`,
      );
      setHistory(res.data?.response || []);
    } catch (e) {
      console.error("fetchHistory failed:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  ///////////////////////////////////////////
  // Search In Chat History
  ///////////////////////////////////////////
  const handleSearch = async (kw: string) => {
    setSearchKeyword(kw);
    if (!kw.trim()) {
      fetchHistory();
      return;
    }
    try {
      const res = await axiosInstance.get(
        `/compliance_assistant_chat/search/${userId}?keyword=${encodeURIComponent(kw)}`,
      );
      setHistory(res.data?.response || []);
    } catch (e) {
      console.error("handleSearch failed:", e);
    }
  };

  /////////////////////////////////
  // Delete A Single Chat
  ////////////////////////////////
  const handleDeleteHistory = async (chatId: string) => {
    try {
      await axiosInstance.delete(
        `/compliance_assistant_chat/delete/${chatId}/${userId}`,
      );
      setHistory((p) => p.filter((h) => h.uuid !== chatId));
    } catch (e) {
      console.error("handleDeleteHistory failed:", e);
      toast.error("Failed to delete");
    }
  };

  /////////////////////////////
  // Clear All Chat History
  ////////////////////////////
  const handleClearHistory = async () => {
    if (!history.length) return;
    try {
      await axiosInstance.delete(`/compliance_assistant_chat/clear/${userId}`);
      setHistory([]);
      toast.success("History cleared");
    } catch (e) {
      console.error("handleClearHistory failed:", e);
      toast.error("Failed to clear");
    }
  };

  const handleLoadChat = (item: ChatHistoryItem) => {
    setMessages([
      WELCOME,
      {
        id: `${item.uuid}-q`,
        content: item.question,
        isUser: true,
        timestamp: new Date(item.timestamp),
      },
      {
        id: `${item.uuid}-a`,
        content: item.answer,
        isUser: false,
        timestamp: new Date(item.timestamp),
        confidence: 95,
        sources: ["UAE FTA Guidelines"],
        reminderState: "idle",
      },
    ]);
    setIsNewChat(false);
  };

  const handleNewChat = () => {
    setMessages([WELCOME]);
    setIsNewChat(true);
    setInput("");
  };

  /////////////////////////////
  // Ask Ai
  //////////////////////////////
  const handleSend = async (content?: string) => {
    const text = content || input;
    if (!text.trim() || isLoading) return;

    setMessages((p) => [
      ...p,
      {
        id: `u-${Date.now()}`,
        content: text,
        isUser: true,
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setIsLoading(true);
    setIsNewChat(false);

    try {
      const res = await axiosInstance.post(
        "/compliance_assistant_chat/ask-ai",
        { user_id: userId, question: text },
      );
      const data = res.data?.response;
      const id = data?.uuid || `a-${Date.now()}`;

      setMessages((p) => [
        ...p,
        {
          id,
          content: data?.answer || "No response received.",
          isUser: false,
          timestamp: new Date(data?.timestamp || Date.now()),
          confidence: 95,
          sources: ["UAE FTA Guidelines", "DED Portal"],
          reminderState: "idle",
        },
      ]);
      fetchHistory();
    } catch (e) {
      console.error("handleSend failed:", e);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── One-click reminder save ──
  const handleSetReminder = async (msgId: string) => {
    setMessages((p) =>
      p.map((m) => (m.id === msgId ? { ...m, reminderState: "saving" } : m)),
    );

    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;

    await new Promise((r) => setTimeout(r, 600)); // Simulate API call

    const reminder = extractReminderData(msg.content, msgId);

    setSavedReminders((p) => [reminder, ...p]);

    setMessages((p) =>
      p.map((m) =>
        m.id === msgId
          ? { ...m, reminderState: "saved", savedReminder: reminder }
          : m,
      ),
    );

    toast.success(
      `Reminder set — ${reminder.type} · ${new Date(reminder.reminder_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      {
        duration: 2500,
        position: "bottom-right",
      },
    );
  };

  const todayH = history.filter((h) => relativeDate(h.timestamp) === "Today");
  const yesterdayH = history.filter(
    (h) => relativeDate(h.timestamp) === "Yesterday",
  );
  const olderH = history.filter(
    (h) => !["Today", "Yesterday"].includes(relativeDate(h.timestamp)),
  );
  const isEmpty = messages.length === 1;

  return (
    <DashboardLayout>
      <div className="h-screen flex overflow-hidden bg-bg-base">
        {/* ═══════════ SIDEBAR ═══════════ */}
        <div className="w-72 flex flex-col bg-surface border-r border-border shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-on-brand" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-heading">
                  AI Compliance
                </p>
                <p className="text-[10px] text-text-muted flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5 text-status-success" /> UAE
                  Regulations Expert
                </p>
              </div>
            </div>
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand hover:bg-brand-hover text-on-brand rounded-lg text-sm font-semibold transition-all shadow-card hover:shadow-raised"
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["chats", "reminders"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSidebarTab(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors capitalize ${
                  sidebarTab === tab
                    ? "border-secondary text-secondary"
                    : "border-transparent text-text-muted hover:text-text-primary"
                }`}
              >
                {tab === "chats" ? (
                  <>
                    <MessageSquare className="w-3.5 h-3.5" /> Chats
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" /> Reminders
                    {savedReminders.length > 0 && (
                      <span className="bg-status-warning text-on-brand text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {savedReminders.length}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {sidebarTab === "chats" && (
              <div className="p-3 space-y-1">
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchKeyword}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-bg-base border border-border rounded-lg text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-border-focus"
                  />
                </div>

                {historyLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="w-5 h-5" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-10">
                    <MessageSquare className="w-8 h-8 text-border-strong mx-auto mb-2" />
                    <p className="text-xs text-text-muted">
                      No conversations yet
                    </p>
                  </div>
                ) : (
                  <>
                    {todayH.length > 0 && (
                      <>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2 py-1">
                          Today
                        </p>
                        {todayH.map((h) => (
                          <HistoryItem
                            key={h.uuid}
                            item={h}
                            onLoad={handleLoadChat}
                            onDelete={handleDeleteHistory}
                          />
                        ))}
                      </>
                    )}
                    {yesterdayH.length > 0 && (
                      <>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2 py-1 mt-2">
                          Yesterday
                        </p>
                        {yesterdayH.map((h) => (
                          <HistoryItem
                            key={h.uuid}
                            item={h}
                            onLoad={handleLoadChat}
                            onDelete={handleDeleteHistory}
                          />
                        ))}
                      </>
                    )}
                    {olderH.length > 0 && (
                      <>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2 py-1 mt-2">
                          Older
                        </p>
                        {olderH.map((h) => (
                          <HistoryItem
                            key={h.uuid}
                            item={h}
                            onLoad={handleLoadChat}
                            onDelete={handleDeleteHistory}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {sidebarTab === "reminders" && (
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                  <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest">
                    Saved from chat
                  </p>
                </div>

                {savedReminders.length === 0 ? (
                  <div className="text-center py-10">
                    <Bell className="w-8 h-8 text-border-strong mx-auto mb-2" />
                    <p className="text-xs text-text-muted">No reminders yet</p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      Click &quot;Set Reminder&quot; on any AI message
                    </p>
                  </div>
                ) : (
                  savedReminders.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 bg-bg-base rounded-xl border border-border"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs font-semibold text-text-heading leading-snug flex-1">
                          {r.title}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${typeColor[r.type]}`}
                        >
                          {r.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-text-muted">
                          <Calendar className="w-3 h-3" />
                          {new Date(r.reminder_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </div>
                        {r.recurrence_rule !== "none" && (
                          <span className="text-[10px] text-text-muted capitalize">
                            {r.recurrence_rule}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {sidebarTab === "chats" && history.length > 0 && (
            <div className="p-3 border-t border-border">
              <button
                onClick={handleClearHistory}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-status-error hover:bg-status-error-bg rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear all history
              </button>
            </div>
          )}
        </div>

        {/* ═══════════ CHAT AREA ═══════════ */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <div className="h-14 flex items-center justify-between px-6 bg-surface border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-on-brand" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-heading">
                  {isNewChat ? "New Conversation" : "Compliance Chat"}
                </p>
                <p className="text-[10px] text-status-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success inline-block animate-pulse" />
                  AI Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted bg-bg-base border border-border px-2.5 py-1 rounded-full font-medium">
                🇦🇪 UAE Regulations
              </span>
              <button className="text-[11px] font-semibold text-secondary flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-bg-base transition-colors">
                <Languages className="w-3.5 h-3.5" /> العربية
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isEmpty ? (
              <div className="max-w-3xl mx-auto px-6 pt-12 pb-4">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-raised">
                    <Bot className="w-8 h-8 text-on-brand" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-heading mb-2">
                    UAE Compliance Assistant
                  </h2>
                  <p className="text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
                    Ask anything about UAE regulations. Click{" "}
                    <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                      <BellPlus className="w-3.5 h-3.5" /> Set Reminder
                    </span>{" "}
                    on any response to save important deadlines instantly.
                  </p>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-5 mb-8 shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-brand rounded-md flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-on-brand" />
                    </div>
                    <span className="text-xs font-semibold text-text-heading">
                      Assistant
                    </span>
                  </div>
                  <div className="text-sm text-text-primary leading-relaxed">
                    {renderContent(WELCOME.content, false)}
                  </div>
                </div>

                <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
                  Quick Start
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {QUICK_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(p.prompt)}
                      className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-secondary hover:bg-brand-light text-left transition-all group shadow-card hover:shadow-raised"
                    >
                      <div className="w-8 h-8 bg-brand-light rounded-lg flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                        {p.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-heading">
                          {p.label}
                        </p>
                        <p className="text-[10px] text-text-muted mt-0.5 truncate">
                          {p.prompt}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-6 py-6 space-y-6">
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    onSetReminder={handleSetReminder}
                  />
                ))}

                {/* Typing */}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center shrink-0 shadow-card">
                      <Bot className="w-3.5 h-3.5 text-on-brand" />
                    </div>
                    <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
                      <div className="flex items-center gap-1.5">
                        {[0, 150, 300].map((delay, i) => (
                          <span
                            key={i}
                            className="w-2 h-2 bg-brand rounded-full animate-bounce"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-6 py-4 bg-surface border-t border-border shrink-0">
            <div>
              <div className="flex gap-3 items-center bg-bg-base border border-border rounded-xl px-4 py-3 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all shadow-card">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder="Ask about VAT, licenses, compliance..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 resize-none bg-transparent text-sm text-text-heading placeholder:text-text-muted focus:outline-none leading-relaxed max-h-40"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    input.trim() && !isLoading
                      ? "bg-brand hover:bg-brand-hover text-on-brand shadow-card hover:shadow-raised"
                      : "bg-border text-text-muted cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <LoadingSpinner size="w-4 h-4" color="border-text-muted" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-center text-[10px] text-text-muted mt-2">
                Enter to send · Shift+Enter for new line · Click &quot;Set
                Reminder&quot; on any response to save deadlines
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-border-strong);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-text-muted);
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ComplianceAssistancePage;
