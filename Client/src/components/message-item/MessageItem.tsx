// MessageItem.tsx
import React from "react";
import { Bot, CheckCircle2, BellPlus } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import { ChatMessage, fmtTime } from "@/app/dashboard/ai-chat/page";
import { renderContent } from "@/utils/renderContent";


interface MessageItemProps {
  message: ChatMessage;
  onSetReminder: (msgId: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onSetReminder }) => {
  const isUser = message.isUser;

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-card">
          <Bot className="w-3.5 h-3.5 text-on-brand" />
        </div>
      )}

      <div className={`flex flex-col gap-1.5 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Meta */}
        <div className={`flex items-center gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[11px] font-semibold text-text-primary">
            {isUser ? "You" : "Assistant"}
          </span>
          <span className="text-[10px] text-text-muted">{fmtTime(message.timestamp)}</span>
          {!isUser && message.confidence && (
            <span className="text-[10px] text-status-success bg-status-success-bg px-1.5 py-0.5 rounded-full font-medium">
              {message.confidence}%
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
            ? "bg-brand text-on-brand rounded-tr-sm shadow-card"
            : "bg-surface border border-border text-text-primary rounded-tl-sm shadow-card"
            }`}
        >
          {renderContent(message.content, isUser)}

          {!isUser && message.sources && (
            <div className="mt-3 pt-2.5 border-t border-border flex flex-wrap gap-1.5">
              {message.sources.map((src, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-bg-base border border-border text-text-muted px-2 py-0.5 rounded-full font-medium"
                >
                  {src}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Per-message Set Reminder button */}
        {!isUser && message.id !== "welcome" && (
          <div className="flex items-center gap-2">
            {message.reminderState === "idle" && (
              <button
                onClick={() => onSetReminder(message.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-text-secondary border border-border bg-surface hover:border-secondary hover:text-secondary hover:bg-brand-light transition-all"
              >
                <BellPlus className="w-3.5 h-3.5" />
                Set Reminder
              </button>
            )}

            {message.reminderState === "saving" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-text-muted border border-border bg-surface">
                <LoadingSpinner size="w-3.5 h-3.5" />
                Saving...
              </div>
            )}

            {message.reminderState === "saved" && message.savedReminder && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-status-success border border-status-success-border bg-status-success-bg">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Reminder set · {message.savedReminder.type} ·{" "}
                {new Date(message.savedReminder.reminder_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}

            <button className="text-[11px] text-text-muted hover:text-text-primary transition-colors px-2 py-1.5">
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;