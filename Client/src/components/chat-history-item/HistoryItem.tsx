// HistoryItem.tsx
import React from "react";
import { MessageSquare, Clock, X } from "lucide-react";
import { ChatHistoryItem, relativeDate } from "@/app/dashboard/ai-chat/page";


interface HistoryItemProps {
  item: ChatHistoryItem;
  onLoad: (item: ChatHistoryItem) => void;
  onDelete: (uuid: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onLoad, onDelete }) => (
  <div
    className="group flex items-center gap-2 px-2 py-2.5 rounded-xl hover:bg-bg-base transition-colors cursor-pointer"
    onClick={() => onLoad(item)}
  >
    <div className="w-7 h-7 bg-bg-base border border-border rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-light group-hover:border-secondary transition-colors">
      <MessageSquare className="w-3.5 h-3.5 text-text-muted group-hover:text-secondary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-text-heading truncate">{item.question}</p>
      <p className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1">
        <Clock className="w-2.5 h-2.5" />
        {relativeDate(item.timestamp)}
      </p>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(item.uuid);
      }}
      className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-text-muted hover:text-status-error rounded transition-all shrink-0"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
);

export default HistoryItem;