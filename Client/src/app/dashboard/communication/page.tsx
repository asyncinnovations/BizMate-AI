"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Send,
  Check,
  CheckCheck,
  Zap,
  MoreVertical,
  MessageSquare,
  Mail,
  Settings,
  RefreshCw,
  Copy,
  MessageCircle,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Phone,
  Video,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

// ================= TYPES =================
type Platform = "whatsapp" | "instagram" | "email";
type MsgStatus = "sent" | "delivered" | "read" | "failed";

// ── API shapes ──
interface ApiChatPartner {
  client_uuid: string;
  client_name: string;
  whatsapp_number: string | null;
  email: string | null;
  message: string | null;
  direction: "inbound" | "outbound" | null;
  status: MsgStatus | null;
  platform: Platform | null;
  sent_at: string | null;
}

interface ApiMessage {
  id: number;
  uuid: string;
  user_id: string;
  client_id: string;
  platform: Platform;
  direction: "inbound" | "outbound";
  message: string;
  ai_reply: string | null;
  ai_reply_enable: boolean;
  ai_model: string | null;
  sent_at: string;
  received_at: string | null;
  status: MsgStatus;
  error_message: string | null;
}

// ── UI shapes ──
interface Client {
  id: string; // client_uuid
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
  uuid: string;
  text: string;
  timestamp: string;
  type: "incoming" | "outgoing";
  status: MsgStatus;
  ai_reply?: string | null;
  ai_reply_enable?: boolean;
}

// ================= PLATFORM CONFIG =================
const PLATFORM_CFG: Record<
  Platform,
  {
    label: string;
    icon: React.ReactNode;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }
> = {
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

const PLATFORM_ICON_BG: Record<Platform, string> = {
  whatsapp: "bg-status-success text-on-brand",
  instagram: "bg-status-warning text-on-brand",
  email: "bg-status-info    text-on-brand",
};

// ================= HELPERS =================
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const AVATAR_TOKENS = [
  "bg-secondary",
  "bg-status-success",
  "bg-status-warning",
  "bg-status-info",
  "bg-brand",
];
const avatarToken = (name: string) =>
  AVATAR_TOKENS[name.charCodeAt(0) % AVATAR_TOKENS.length];

const formatTimestamp = (isoString: string | null): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "1d";
  return `${diffDays}d`;
};

const formatMessageTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

// Map API message → UI message
const mapApiMessage = (msg: ApiMessage): Message => ({
  id: String(msg.id),
  uuid: msg.uuid,
  text: msg.message,
  timestamp: formatMessageTime(msg.sent_at),
  type: msg.direction === "inbound" ? "incoming" : "outgoing",
  status: msg.status,
  ai_reply: msg.ai_reply,
  ai_reply_enable: msg.ai_reply_enable,
});

// Map API partner → UI client
const mapApiPartner = (partner: ApiChatPartner): Client => ({
  id: partner.client_uuid,
  name: partner.client_name || "Unknown",
  platform: partner.platform || "whatsapp",
  lastMessage: partner.message || "No messages yet",
  timestamp: formatTimestamp(partner.sent_at),
  unreadCount: 0,
  aiEnabled: true,
  online: false,
});

// ================= SUB-COMPONENTS =================
const PlatformBadge: React.FC<{ platform: Platform }> = ({ platform }) => {
  const c = PLATFORM_CFG[platform];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.badgeBg} ${c.badgeText} ${c.badgeBorder}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
};

const StatusIcon: React.FC<{ status: MsgStatus }> = ({ status }) => {
  if (status === "sent")
    return <Check className="w-3.5 h-3.5 text-on-brand/50" />;
  if (status === "delivered")
    return <CheckCheck className="w-3.5 h-3.5 text-on-brand/50" />;
  if (status === "failed")
    return <AlertCircle className="w-3.5 h-3.5 text-status-error" />;
  return <CheckCheck className="w-3.5 h-3.5 text-status-info" />;
};

// ================= PAGE =================
const AIReplyHubDashboard: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user?.user_id;

  // ── Data ──
  const [clients, setClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState("");

  // ── UI state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [aiAutoReply, setAiAutoReply] = useState(true);
  const [suggestionOpen, setSuggestionOpen] = useState(true);
  const [inserted, setInserted] = useState(false);

  // ── Loading flags ──
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingAiSuggestion, setLoadingAiSuggestion] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [togglingAI, setTogglingAI] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Auto-scroll on new messages ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Auto-resize textarea ──
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [newMessage]);

  //////////////////////////////////////////////
  // Fetch chat history for a client
  /////////////////////////////////////////////////
  const loadChatHistory = useCallback(
    async (client: Client) => {
      if (!userId) return;
      setSelected(client);
      setMessages([]);
      setAiSuggestion("");
      setInserted(false);
      setNewMessage("");
      setSuggestionOpen(true);
      setLoadingMessages(true);

      try {
        const res = await axiosInstance.get(
          `/reply_hub_chat/history/${userId}/${client.id}`,
        );
        console.log("Fetch chat history response:", res.data);
        const data: ApiMessage[] = res.data?.result ?? res.data ?? [];
        const mapped = data.map(mapApiMessage);
        setMessages(mapped);

        // Sync ai_reply_enable from latest message
        if (data.length > 0) {
          const latest = data[data.length - 1];
          setAiAutoReply(latest.ai_reply_enable);
          setClients((prev) =>
            prev.map((c) =>
              c.id === client.id
                ? { ...c, aiEnabled: latest.ai_reply_enable }
                : c,
            ),
          );
        }

        // Pre-fill AI suggestion from latest inbound that already has one
        const lastInboundWithAI = [...data]
          .reverse()
          .find((m) => m.direction === "inbound" && m.ai_reply);
        if (lastInboundWithAI) {
          setAiSuggestion(lastInboundWithAI.ai_reply!);
        }

        // Mark unread inbound messages as read — fire-and-forget
        const unread = data.filter(
          (m) => m.direction === "inbound" && m.status !== "read",
        );
        for (const msg of unread) {
          axiosInstance
            .patch(`/reply_hub_chat/mark_as_read/${msg.uuid}`)
            .catch(() => {});
        }

        // Clear unread badge in sidebar
        setClients((prev) =>
          prev.map((c) => (c.id === client.id ? { ...c, unreadCount: 0 } : c)),
        );
      } catch (error) {
        console.error("loadChatHistory error:", error);
        toast.error("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    },
    [userId],
  );

  // ── Fetch chat partners on mount ──────────────────────────────────────────

  const fetchChatPartners = useCallback(async () => {
    if (!userId) return;
    setLoadingClients(true);
    try {
      const res = await axiosInstance.get(
        `/reply_hub_chat/chat_partner/${userId}`,
      );
      console.log("Fetch chat partners response:", res.data);
      const data: ApiChatPartner[] = res.data?.result ?? res.data ?? [];
      const mapped = data.map(mapApiPartner);
      setClients(mapped);
      // Auto-select first conversation
      if (mapped.length > 0) loadChatHistory(mapped[0]);
    } catch (error) {
      console.error("fetchChatPartners error:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoadingClients(false);
    }
  }, [userId, loadChatHistory]);

  useEffect(() => {
    fetchChatPartners();
  }, [fetchChatPartners]);

  // ── Send message ──────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!newMessage.trim() || !selected || sendingMessage || !userId) return;

    const text = newMessage.trim();
    setNewMessage("");
    setInserted(false);
    setSendingMessage(true);

    // Optimistic message so UI feels instant
    const tempId = `temp-${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      uuid: "",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "outgoing",
      status: "sent",
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await axiosInstance.post("/reply_hub_chat/create", {
        user_id: userId,
        client_id: selected.id,
        message: text,
        platform: selected.platform,
        direction: "outbound",
        ai_reply_enable: aiAutoReply,
      });
      console.log("Create message response:", res.data);
      const created: ApiMessage = res.data?.result ?? res.data;

      // Replace optimistic entry with real one from server
      const realMsg = mapApiMessage(created);
      setMessages((prev) => prev.map((m) => (m.id === tempId ? realMsg : m)));

      // Update last message preview in sidebar
      setClients((prev) =>
        prev.map((c) =>
          c.id === selected.id
            ? { ...c, lastMessage: text, timestamp: "now" }
            : c,
        ),
      );

      // Simulate delivery → read status progression
      setTimeout(async () => {
        try {
          await axiosInstance.patch(
            `/reply_hub_chat/update-status/${created.uuid}`,
            { status: "delivered" },
          );
          setMessages((prev) =>
            prev.map((m) =>
              m.uuid === created.uuid ? { ...m, status: "delivered" } : m,
            ),
          );
        } catch {}
      }, 1000);

      setTimeout(async () => {
        try {
          await axiosInstance.patch(
            `/reply_hub_chat/update-status/${created.uuid}`,
            { status: "read" },
          );
          setMessages((prev) =>
            prev.map((m) =>
              m.uuid === created.uuid ? { ...m, status: "read" } : m,
            ),
          );
        } catch {}
      }, 2500);
    } catch (error) {
      console.error("handleSend error:", error);
      toast.error("Failed to send message");
      // Show failure indicator on the optimistic bubble
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m)),
      );
    } finally {
      setSendingMessage(false);
    }
  };

  // ── Generate / regenerate AI suggestion ──────────────────────────────────

  const handleRegenerate = async () => {
    if (!selected) return;

    // Find latest inbound message that has a uuid to send to the API
    const lastInbound = [...messages]
      .reverse()
      .find((m) => m.type === "incoming" && m.uuid);

    if (!lastInbound?.uuid) {
      toast.error("No incoming message to generate a reply for");
      return;
    }

    setLoadingAiSuggestion(true);
    setInserted(false);
    setSuggestionOpen(true);

    try {
      const res = await axiosInstance.post(
        `/reply_hub_chat/generate-ai-reply/${lastInbound.uuid}`,
      );
      console.log("Generate AI reply response:", res.data);
      const updated: ApiMessage = res.data?.result ?? res.data;

      if (updated?.ai_reply) {
        setAiSuggestion(updated.ai_reply);
        // Sync ai_reply into messages list so re-selecting stays consistent
        setMessages((prev) =>
          prev.map((m) =>
            m.uuid === lastInbound.uuid
              ? { ...m, ai_reply: updated.ai_reply }
              : m,
          ),
        );
        toast.success("AI suggestion generated");
      }
    } catch (error) {
      console.error("handleRegenerate error:", error);
      toast.error("Failed to generate AI suggestion");
    } finally {
      setLoadingAiSuggestion(false);
    }
  };

  // ── Toggle AI auto-reply ──────────────────────────────────────────────────

  const handleToggleAI = async () => {
    if (!selected || togglingAI) return;
    const next = !aiAutoReply;

    // Optimistic update
    setAiAutoReply(next);
    setClients((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, aiEnabled: next } : c)),
    );

    // Persist against most recent message uuid
    const lastMsg = [...messages].reverse().find((m) => m.uuid);
    if (!lastMsg?.uuid) return;

    setTogglingAI(true);
    try {
      const res = await axiosInstance.patch(
        `/reply_hub_chat/toggle-ai-reply/${lastMsg.uuid}?enable=${next}`,
      );
      console.log("Toggle AI reply response:", res.data);
    } catch (error) {
      console.error("handleToggleAI error:", error);
      toast.error("Failed to toggle AI reply");
      // Revert on failure
      setAiAutoReply(!next);
      setClients((prev) =>
        prev.map((c) =>
          c.id === selected.id ? { ...c, aiEnabled: !next } : c,
        ),
      );
    } finally {
      setTogglingAI(false);
    }
  };

  // ── Insert suggestion into compose box ───────────────────────────────────

  const handleInsert = () => {
    setNewMessage(aiSuggestion);
    setInserted(true);
    setSuggestionOpen(false);
    textareaRef.current?.focus();
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const filtered = clients.filter(
    (c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const latestIncoming = [...messages]
    .reverse()
    .find((m) => m.type === "incoming");
  const totalUnread = clients.reduce((s, c) => s + c.unreadCount, 0);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="h-screen flex overflow-hidden bg-bg-base">
        {/* ═══════ LEFT — CONVERSATIONS ═══════ */}
        <div className="w-[290px] shrink-0 flex flex-col bg-surface border-r border-border">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-base font-bold text-text-heading">
                  Conversations
                </h1>
                {totalUnread > 0 && (
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {totalUnread} unread
                  </p>
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
            {loadingClients ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="w-5 h-5" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-8 h-8 text-border-strong mx-auto mb-2" />
                <p className="text-xs text-text-muted">
                  No conversations found
                </p>
              </div>
            ) : (
              filtered.map((client) => {
                const isSelected = selected?.id === client.id;
                return (
                  <button
                    key={client.id}
                    onClick={() => loadChatHistory(client)}
                    className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                      isSelected
                        ? "bg-brand-light border-l-2 border-l-secondary"
                        : "hover:bg-bg-base"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-on-brand text-sm font-bold ${avatarToken(client.name)}`}
                        >
                          {getInitials(client.name)}
                        </div>
                        {client.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-success border-2 border-surface rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p
                            className={`text-sm font-semibold truncate ${isSelected ? "text-secondary" : "text-text-heading"}`}
                          >
                            {client.name}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {client.unreadCount > 0 && (
                              <span className="text-[9px] font-bold bg-secondary text-on-secondary px-1.5 py-0.5 rounded-full">
                                {client.unreadCount}
                              </span>
                            )}
                            <span className="text-[10px] text-text-muted">
                              {client.timestamp}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-text-secondary truncate mb-1.5">
                          {client.lastMessage}
                        </p>
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
              })
            )}
          </div>
        </div>

        {/* ═══════ CENTER — CHAT ═══════ */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="h-[65px] px-5 flex items-center justify-between border-b border-border bg-surface shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-on-brand text-sm font-bold ${avatarToken(selected.name)}`}
                  >
                    {getInitials(selected.name)}
                  </div>
                  {selected.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-success border-2 border-surface rounded-full" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-text-heading">
                      {selected.name}
                    </h2>
                    <PlatformBadge platform={selected.platform} />
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {selected.online ? "Online now" : "Last seen recently"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-base transition-colors text-text-muted">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-base transition-colors text-text-muted">
                  <Video className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-base transition-colors text-text-muted">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 custom-scrollbar bg-bg-base">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="w-6 h-6" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10px] text-text-muted font-medium px-2 py-0.5 bg-surface border border-border rounded-full">
                      Today
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <MessageSquare className="w-8 h-8 text-border-strong" />
                      <p className="text-xs text-text-muted">No messages yet</p>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === "incoming" ? "justify-start" : "justify-end"}`}
                    >
                      {msg.type === "incoming" && (
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-on-brand text-[10px] font-bold mr-2 mt-auto shrink-0 ${avatarToken(selected.name)}`}
                        >
                          {getInitials(selected.name)}
                        </div>
                      )}
                      <div className="max-w-[68%]">
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-card ${
                            msg.type === "incoming"
                              ? "bg-surface border border-border text-text-primary rounded-tl-sm"
                              : "bg-brand text-on-brand rounded-tr-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div
                          className={`flex items-center gap-1 mt-1 ${msg.type === "outgoing" ? "justify-end" : "justify-start"}`}
                        >
                          <span className="text-[10px] text-text-muted">
                            {msg.timestamp}
                          </span>
                          {msg.type === "outgoing" && (
                            <StatusIcon status={msg.status} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* AI suggestion strip */}
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
                    <span className="text-[11px] font-bold text-secondary">
                      AI Suggestion
                    </span>
                    {loadingAiSuggestion ? (
                      <LoadingSpinner size="w-3 h-3" color="border-secondary" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse ml-0.5" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!suggestionOpen && inserted && (
                      <span className="text-[10px] text-status-success font-semibold">
                        Inserted ✓
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegenerate();
                      }}
                      disabled={loadingAiSuggestion}
                      className="text-text-muted hover:text-secondary transition-colors p-0.5 disabled:opacity-50"
                      title="Regenerate"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${loadingAiSuggestion ? "animate-spin" : ""}`}
                      />
                    </button>
                    {suggestionOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
                    )}
                  </div>
                </button>

                {suggestionOpen && (
                  <div className="px-5 pb-3">
                    <div className="flex items-start gap-3 p-3 bg-brand-light border border-secondary/20 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      <p className="flex-1 text-xs text-text-primary leading-relaxed">
                        {loadingAiSuggestion
                          ? "Generating suggestion…"
                          : aiSuggestion ||
                            "No suggestion yet. Click regenerate to generate one."}
                      </p>
                      <button
                        onClick={handleInsert}
                        disabled={!aiSuggestion || loadingAiSuggestion}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          inserted
                            ? "bg-status-success-bg text-status-success border border-status-success-border cursor-default"
                            : "bg-brand text-on-brand hover:bg-brand-hover shadow-card hover:shadow-raised disabled:opacity-50"
                        }`}
                      >
                        {inserted ? (
                          <>
                            <CheckCheck className="w-3.5 h-3.5" /> Done
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Use
                          </>
                        )}
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
                  placeholder={`Message via ${PLATFORM_CFG[selected.platform].label}…`}
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    if (inserted) setInserted(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1 resize-none bg-transparent text-sm text-text-heading placeholder:text-text-muted focus:outline-none leading-relaxed max-h-28"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sendingMessage}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    newMessage.trim() && !sendingMessage
                      ? "bg-brand hover:bg-brand-hover text-on-brand shadow-card hover:shadow-raised"
                      : "bg-border text-text-muted cursor-not-allowed"
                  }`}
                >
                  {sendingMessage ? (
                    <LoadingSpinner
                      size="w-3.5 h-3.5"
                      color="border-on-brand"
                    />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-text-muted mt-1.5 text-center">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        ) : (
          // Empty state when no client is selected
          <div className="flex-1 flex flex-col items-center justify-center bg-bg-base gap-3">
            <MessageSquare className="w-12 h-12 text-border-strong" />
            <p className="text-sm text-text-muted">Select a conversation</p>
          </div>
        )}

        {/* ═══════ RIGHT — AI PANEL ═══════ */}
        <div className="w-[260px] shrink-0 flex flex-col bg-surface border-l border-border overflow-y-auto custom-scrollbar">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-on-brand" />
                </div>
                <h3 className="text-sm font-bold text-text-heading">
                  AI Assistant
                </h3>
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
                  <p className="text-xs font-bold text-text-heading">
                    Auto-Reply
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {aiAutoReply ? "AI is active" : "Manual only"}
                  </p>
                </div>
                <button
                  onClick={handleToggleAI}
                  disabled={!selected || togglingAI}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                    aiAutoReply ? "bg-secondary" : "bg-border-strong"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      aiAutoReply ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {aiAutoReply && (
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                  <span className="text-[10px] text-status-success font-semibold">
                    Monitoring this chat
                  </span>
                </div>
              )}
            </div>

            {/* Latest client message */}
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">
                Client Message
              </p>
              <div className="p-3 bg-bg-base rounded-xl border border-border">
                {loadingMessages ? (
                  <div className="flex justify-center py-2">
                    <LoadingSpinner size="w-4 h-4" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-text-primary leading-relaxed">
                      {latestIncoming?.text || "No incoming messages yet"}
                    </p>
                    {latestIncoming && selected && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                        <span className="text-[10px] text-text-muted">
                          {latestIncoming.timestamp}
                        </span>
                        <PlatformBadge platform={selected.platform} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* AI paused */}
            {!aiAutoReply && (
              <div className="p-4 bg-bg-base border-2 border-dashed border-border rounded-xl text-center">
                <Zap className="w-6 h-6 text-border-strong mx-auto mb-2" />
                <p className="text-xs font-semibold text-text-heading mb-1">
                  AI is paused
                </p>
                <p className="text-[10px] text-text-muted">
                  Enable Auto-Reply to get smart suggestions.
                </p>
              </div>
            )}

            {/* Connected platforms — counts derived from fetched data */}
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
                    <div
                      key={p}
                      className="flex items-center gap-3 p-3 bg-bg-base rounded-xl border border-border"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${icBg}`}
                      >
                        {React.cloneElement(cfg.icon as React.ReactElement, {
                          className: "w-4 h-4",
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-heading">
                          {cfg.label}
                        </p>
                        <p className="text-[10px] text-text-muted">
                          {count} conversation{count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-1 rounded-full border shrink-0 ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
                      >
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
      `}</style>
    </DashboardLayout>
  );
};

export default AIReplyHubDashboard;
