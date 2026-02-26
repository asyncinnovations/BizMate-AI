"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search, Send, Check, CheckCheck, Zap, MoreVertical,
  MessageSquare, Mail, Settings, RefreshCw, Copy,
  MessageCircle, Sparkles, ChevronUp, ChevronDown,
  Phone, Video,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// ================= TYPES =================
type Platform = "whatsapp" | "instagram" | "email";
type MsgStatus = "sent" | "delivered" | "read";

interface Client {
  id: string;
  name: string;
  platform: Platform;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  aiEnabled: boolean;
  online?: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  type: "incoming" | "outgoing";
  status: MsgStatus;
}

// ================= PLATFORM CONFIG — all platform tokens =================
const PLATFORM_CFG: Record<Platform, {
  label: string;
  icon: React.ReactNode;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}> = {
  whatsapp: {
    label: "WhatsApp",
    icon: <MessageCircle className="w-3.5 h-3.5" />,
    badgeBg: "bg-status-success-bg",
    badgeText: "text-status-success",
    badgeBorder: "border-status-success-border",
  },
  instagram: {
    label: "Instagram",
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    badgeBg: "bg-status-warning-bg",
    badgeText: "text-status-warning",
    badgeBorder: "border-status-warning-border",
  },
  email: {
    label: "Email",
    icon: <Mail className="w-3.5 h-3.5" />,
    badgeBg: "bg-status-info-bg",
    badgeText: "text-status-info",
    badgeBorder: "border-status-info-border",
  },
};

// Icon background tokens per platform (used for the round icon in right panel)
const PLATFORM_ICON_BG: Record<Platform, string> = {
  whatsapp: "bg-status-success text-on-brand",
  instagram: "bg-status-warning text-on-brand",
  email: "bg-status-info    text-on-brand",
};

// ================= DUMMY DATA =================
const CLIENTS: Client[] = [
  { id: "1", name: "Sarah Johnson", platform: "whatsapp", lastMessage: "Thanks! When can I expect delivery?", timestamp: "2m", unreadCount: 3, aiEnabled: true, online: true },
  { id: "2", name: "Mike Chen", platform: "instagram", lastMessage: "Do you have this in other colors?", timestamp: "1h", unreadCount: 1, aiEnabled: false, online: true },
  { id: "3", name: "Emma Davis", platform: "email", lastMessage: "The package arrived damaged.", timestamp: "3h", unreadCount: 0, aiEnabled: true, online: false },
  { id: "4", name: "Alex Rodriguez", platform: "whatsapp", lastMessage: "Can you help me with my account?", timestamp: "5h", unreadCount: 2, aiEnabled: false, online: false },
  { id: "5", name: "Priya Sharma", platform: "email", lastMessage: "Thank you for your assistance!", timestamp: "1d", unreadCount: 0, aiEnabled: true, online: false },
  { id: "6", name: "Liam Torres", platform: "instagram", lastMessage: "Is there a discount for bulk orders?", timestamp: "2d", unreadCount: 0, aiEnabled: false, online: false },
];

const MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "1-1", text: "Hi, I ordered a product last week and wanted to check the status.", timestamp: "10:30 AM", type: "incoming", status: "read" },
    { id: "1-2", text: "Hello Sarah! Your order #12345 is being processed and will ship tomorrow.", timestamp: "10:32 AM", type: "outgoing", status: "read" },
    { id: "1-3", text: "Thanks for the update! When can I expect delivery?", timestamp: "10:33 AM", type: "incoming", status: "read" },
    { id: "1-4", text: "Great, that helps. Do you provide tracking information?", timestamp: "10:34 AM", type: "incoming", status: "read" },
    { id: "1-5", text: "Yes, we'll send tracking as soon as it ships.", timestamp: "10:35 AM", type: "outgoing", status: "read" },
  ],
  "2": [
    { id: "2-1", text: "Hi, I saw your new collection online.", timestamp: "9:15 AM", type: "incoming", status: "read" },
    { id: "2-2", text: "Do you have this in other colors?", timestamp: "9:20 AM", type: "incoming", status: "delivered" },
  ],
  "3": [
    { id: "3-1", text: "The package arrived damaged.", timestamp: "8:45 AM", type: "incoming", status: "read" },
    { id: "3-2", text: "I'm sorry! Can you send photos? We'll arrange a replacement immediately.", timestamp: "8:50 AM", type: "outgoing", status: "read" },
  ],
  "4": [{ id: "4-1", text: "Can you help me with my account?", timestamp: "7:00 AM", type: "incoming", status: "delivered" }],
  "5": [
    { id: "5-1", text: "Thank you for your assistance!", timestamp: "Yesterday", type: "incoming", status: "read" },
    { id: "5-2", text: "You're welcome, Priya! Feel free to reach out anytime.", timestamp: "Yesterday", type: "outgoing", status: "read" },
  ],
  "6": [{ id: "6-1", text: "Is there a discount for bulk orders?", timestamp: "2 days ago", type: "incoming", status: "read" }],
};

const AI_SUGGESTIONS: Record<string, string> = {
  "1": "We'll provide tracking information within 24 hours of shipment. You'll receive an email with all the details once your order ships.",
  "2": "Yes! This item comes in blue, black, and red. Would you like to see photos of the other colors?",
  "3": "I apologize for the inconvenience. Please send photos of the damaged items and we'll process a replacement immediately.",
  "4": "Of course! I'd be happy to help with your account. Could you describe the specific issue you're experiencing?",
  "5": "Thank you for your kind words, Priya! We look forward to serving you again.",
  "6": "Yes, we offer bulk discounts for 10+ units. Let me know the quantity and I'll prepare a custom quote.",
};

// ================= HELPERS =================
const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// Avatar colors — all platform tokens
const AVATAR_TOKENS = [
  "bg-secondary",
  "bg-status-success",
  "bg-status-warning",
  "bg-status-info",
  "bg-brand",
];
const avatarToken = (name: string) => AVATAR_TOKENS[name.charCodeAt(0) % AVATAR_TOKENS.length];

const PlatformBadge: React.FC<{ platform: Platform }> = ({ platform }) => {
  const c = PLATFORM_CFG[platform];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.badgeBg} ${c.badgeText} ${c.badgeBorder}`}>
      {c.icon}{c.label}
    </span>
  );
};

const StatusIcon: React.FC<{ status: MsgStatus }> = ({ status }) => {
  if (status === "sent") return <Check className="w-3.5 h-3.5 text-on-brand/50" />;
  if (status === "delivered") return <CheckCheck className="w-3.5 h-3.5 text-on-brand/50" />;
  return <CheckCheck className="w-3.5 h-3.5 text-status-info" />;
};

// ================= PAGE =================
const AIReplyHubDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [selected, setSelected] = useState<Client>(CLIENTS[0]);
  const [messages, setMessages] = useState<Message[]>(MESSAGES["1"]);
  const [aiSuggestion, setAiSuggestion] = useState(AI_SUGGESTIONS["1"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [aiAutoReply, setAiAutoReply] = useState(true);
  const [suggestionOpen, setSuggestionOpen] = useState(true);
  const [inserted, setInserted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [newMessage]);

  const filtered = clients.filter((c) =>
    !searchQuery ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectClient = (client: Client) => {
    setSelected(client);
    setMessages(MESSAGES[client.id] || []);
    setAiSuggestion(AI_SUGGESTIONS[client.id] || "");
    setAiAutoReply(client.aiEnabled);
    setInserted(false);
    setNewMessage("");
    setSuggestionOpen(true);
    setClients((p) => p.map((c) => c.id === client.id ? { ...c, unreadCount: 0 } : c));
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "outgoing",
      status: "sent",
    };
    setMessages((p) => [...p, msg]);
    setNewMessage("");
    setInserted(false);
    setTimeout(() => setMessages((p) => p.map((m) => m.id === msg.id ? { ...m, status: "delivered" } : m)), 900);
    setTimeout(() => setMessages((p) => p.map((m) => m.id === msg.id ? { ...m, status: "read" } : m)), 2500);
  };

  const handleInsert = () => {
    setNewMessage(aiSuggestion);
    setInserted(true);
    setSuggestionOpen(false);
    textareaRef.current?.focus();
  };

  const handleRegenerate = () => {
    setAiSuggestion("Alternative: " + (AI_SUGGESTIONS[selected.id] || ""));
    setInserted(false);
  };

  const handleToggleAI = () => {
    const next = !aiAutoReply;
    setAiAutoReply(next);
    setClients((p) => p.map((c) => c.id === selected.id ? { ...c, aiEnabled: next } : c));
  };

  const latestIncoming = [...messages].reverse().find((m) => m.type === "incoming");
  const totalUnread = clients.reduce((s, c) => s + c.unreadCount, 0);

  return (
    <DashboardLayout>
      <div className="h-screen flex overflow-hidden bg-bg-base">

        {/* ═══════ LEFT — CONVERSATIONS ═══════ */}
        <div className="w-[290px] shrink-0 flex flex-col bg-surface border-r border-border">

          <div className="px-4 pt-4 pb-3 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-base font-bold text-text-heading">Conversations</h1>
                {totalUnread > 0 && (
                  <p className="text-[10px] text-text-muted mt-0.5">{totalUnread} unread</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-bg-base border border-border rounded-xl focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
              <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-text-heading placeholder:text-text-muted focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-8 h-8 text-border-strong mx-auto mb-2" />
                <p className="text-xs text-text-muted">No conversations found</p>
              </div>
            ) : filtered.map((client) => {
              const isSelected = selected.id === client.id;
              return (
                <button
                  key={client.id}
                  onClick={() => selectClient(client)}
                  className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${isSelected ? "bg-brand-light border-l-2 border-l-secondary" : "hover:bg-bg-base"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-on-brand text-sm font-bold ${avatarToken(client.name)}`}>
                        {getInitials(client.name)}
                      </div>
                      {client.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-success border-2 border-surface rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm font-semibold truncate ${isSelected ? "text-secondary" : "text-text-heading"}`}>
                          {client.name}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0 ml-1">
                          {client.unreadCount > 0 && (
                            <span className="text-[9px] font-bold bg-secondary text-on-secondary px-1.5 py-0.5 rounded-full">
                              {client.unreadCount}
                            </span>
                          )}
                          <span className="text-[10px] text-text-muted">{client.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-text-secondary truncate mb-1.5">{client.lastMessage}</p>
                      <div className="flex items-center gap-2">
                        <PlatformBadge platform={client.platform} />
                        {client.aiEnabled && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-light text-secondary border border-secondary/20">
                            <Zap className="w-2.5 h-2.5" /> AI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════ CENTER — CHAT ═══════ */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <div className="h-[65px] px-5 flex items-center justify-between border-b border-border bg-surface shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-on-brand text-sm font-bold ${avatarToken(selected.name)}`}>
                  {getInitials(selected.name)}
                </div>
                {selected.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-success border-2 border-surface rounded-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-text-heading">{selected.name}</h2>
                  <PlatformBadge platform={selected.platform} />
                </div>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {selected.online ? "Online now" : "Last seen recently"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-base transition-colors text-text-muted"><Phone className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-base transition-colors text-text-muted"><Video className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-base transition-colors text-text-muted"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 custom-scrollbar bg-bg-base">
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-text-muted font-medium px-2 py-0.5 bg-surface border border-border rounded-full">Today</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "incoming" ? "justify-start" : "justify-end"}`}>
                {msg.type === "incoming" && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-on-brand text-[10px] font-bold mr-2 mt-auto shrink-0 ${avatarToken(selected.name)}`}>
                    {getInitials(selected.name)}
                  </div>
                )}
                <div className="max-w-[68%]">
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-card ${msg.type === "incoming"
                    ? "bg-surface border border-border text-text-primary rounded-tl-sm"
                    : "bg-brand text-on-brand rounded-tr-sm"
                    }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${msg.type === "outgoing" ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] text-text-muted">{msg.timestamp}</span>
                    {msg.type === "outgoing" && <StatusIcon status={msg.status} />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* AI suggestion strip — above input */}
          {aiAutoReply && (
            <div className="border-t border-border bg-surface shrink-0">
              <button
                onClick={() => setSuggestionOpen((o) => !o)}
                className="w-full flex items-center gap-2 px-5 py-2.5 hover:bg-bg-base transition-colors"
              >
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="w-5 h-5 bg-brand rounded-md flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-on-brand" />
                  </div>
                  <span className="text-[11px] font-bold text-secondary">AI Suggestion</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse ml-0.5" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!suggestionOpen && inserted && (
                    <span className="text-[10px] text-status-success font-semibold">Inserted ✓</span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRegenerate(); setSuggestionOpen(true); }}
                    className="text-text-muted hover:text-secondary transition-colors p-0.5"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  {suggestionOpen
                    ? <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                    : <ChevronUp className="w-3.5 h-3.5 text-text-muted" />}
                </div>
              </button>

              {suggestionOpen && (
                <div className="px-5 pb-3">
                  <div className="flex items-start gap-3 p-3 bg-brand-light border border-secondary/20 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <p className="flex-1 text-xs text-text-primary leading-relaxed">
                      {aiSuggestion || "No suggestion available"}
                    </p>
                    <button
                      onClick={handleInsert}
                      disabled={!aiSuggestion}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${inserted
                        ? "bg-status-success-bg text-status-success border border-status-success-border cursor-default"
                        : "bg-brand text-on-brand hover:bg-brand-hover shadow-card hover:shadow-raised disabled:opacity-50"
                        }`}
                    >
                      {inserted
                        ? <><CheckCheck className="w-3.5 h-3.5" /> Done</>
                        : <><Copy className="w-3.5 h-3.5" /> Use</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input */}
          <div className="px-5 py-4 pb-6 border-t border-border bg-surface shrink-0">
            <div className="flex items-center gap-3 bg-bg-base border border-border rounded-xl px-4 py-3 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all shadow-card">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={`Message via ${PLATFORM_CFG[selected.platform].label}...`}
                value={newMessage}
                onChange={(e) => { setNewMessage(e.target.value); if (inserted) setInserted(false); }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="flex-1 resize-none bg-transparent text-sm text-text-heading placeholder:text-text-muted focus:outline-none leading-relaxed max-h-28"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${newMessage.trim()
                  ? "bg-brand hover:bg-brand-hover text-on-brand shadow-card hover:shadow-raised"
                  : "bg-border text-text-muted cursor-not-allowed"
                  }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-text-muted mt-1.5 text-center">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* ═══════ RIGHT — AI PANEL ═══════ */}
        <div className="w-[260px] shrink-0 flex flex-col bg-surface border-l border-border overflow-y-auto custom-scrollbar">

          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-on-brand" />
                </div>
                <h3 className="text-sm font-bold text-text-heading">AI Assistant</h3>
              </div>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-base transition-colors text-text-muted">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-5">

            {/* Auto-reply toggle */}
            <div className="p-4 bg-bg-base rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-text-heading">Auto-Reply</p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {aiAutoReply ? "AI is active" : "Manual only"}
                  </p>
                </div>
                <button
                  onClick={handleToggleAI}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiAutoReply ? "bg-secondary" : "bg-border-strong"
                    }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${aiAutoReply ? "translate-x-6" : "translate-x-1"
                    }`} />
                </button>
              </div>
              {aiAutoReply && (
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                  <span className="text-[10px] text-status-success font-semibold">Monitoring this chat</span>
                </div>
              )}
            </div>

            {/* Latest client message */}
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Client Message</p>
              <div className="p-3 bg-bg-base rounded-xl border border-border">
                <p className="text-xs text-text-primary leading-relaxed">
                  {latestIncoming?.text || "No incoming messages yet"}
                </p>
                {latestIncoming && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-[10px] text-text-muted">{latestIncoming.timestamp}</span>
                    <PlatformBadge platform={selected.platform} />
                  </div>
                )}
              </div>
            </div>

            {/* AI paused */}
            {!aiAutoReply && (
              <div className="p-4 bg-bg-base border-2 border-dashed border-border rounded-xl text-center">
                <Zap className="w-6 h-6 text-border-strong mx-auto mb-2" />
                <p className="text-xs font-semibold text-text-heading mb-1">AI is paused</p>
                <p className="text-[10px] text-text-muted">Enable Auto-Reply to get smart suggestions.</p>
              </div>
            )}

            {/* Connected platforms */}
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">
                Connected Platforms
              </p>
              <div className="space-y-2">
                {(["whatsapp", "instagram", "email"] as Platform[]).map((p) => {
                  const cfg = PLATFORM_CFG[p];
                  const icBg = PLATFORM_ICON_BG[p];
                  const count = clients.filter((c) => c.platform === p).length;
                  return (
                    <div key={p} className="flex items-center gap-3 p-3 bg-bg-base rounded-xl border border-border">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${icBg}`}>
                        {React.cloneElement(cfg.icon as React.ReactElement, { className: "w-4 h-4" })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-heading">{cfg.label}</p>
                        <p className="text-[10px] text-text-muted">{count} conversation{count !== 1 ? "s" : ""}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full border shrink-0 ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}>
                        Live
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-border-strong); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }
      `}</style>
    </DashboardLayout>
  );
};

export default AIReplyHubDashboard;