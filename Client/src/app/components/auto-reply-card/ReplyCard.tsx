"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  Instagram,
  Mail,
  Send,
  Bot,
  Sparkles,
  Edit3,
  CheckCheck,
} from "lucide-react";
import Modal from "@/app/components/ui/Modal";

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

interface ReplyCardProps {
  reply: Reply;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  isSelected,
  onSelect,
}) => {
  const {
    id,
    platform,
    query,
    aiReply,
    confidence,
    status,
    timestamp,
    customerName,
  } = reply;

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editedMessage, setEditedMessage] = useState<string>(aiReply);
  const [isSendEnabled, setIsSendEnabled] = useState<boolean>(false);
  const [currentReply, setCurrentReply] = useState<string>(aiReply);

  const handleEditClick = () => {
    setShowEditModal(true);
    setEditedMessage(currentReply);
  };

  const handleApproveClick = () => {
    setIsSendEnabled(true);
  };

  const handleModalApprove = () => {
    setCurrentReply(editedMessage);
    setIsSendEnabled(true);
    setShowEditModal(false);
  };

  const handleSendClick = () => {
    if (isSendEnabled) {
      console.log("Sending reply:", currentReply);
      alert(`Reply sent to ${customerName}: ${currentReply}`);
      // You can add API call here to actually send the message
    }
  };

  const handleCancelEdit = () => {
    setEditedMessage(currentReply);
    setShowEditModal(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedMessage(e.target.value);
  };

  return (
    <>
      <div
        key={id}
        onClick={() => onSelect(id)}
        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
          isSelected
            ? "border-[#2E69A4] bg-blue-50"
            : "border-[#E1E8F5] hover:border-[#2E69A4] hover:shadow-md"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {platform === "whatsapp" ? (
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare size={20} className="text-green-600" />
              </div>
            ) : platform === "email" ? (
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Mail size={20} className="text-red-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Instagram size={20} className="text-pink-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1B2A49]">
                  {customerName}
                </span>
                <span className="text-xs text-[#344767]">{timestamp}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {status}
                </span>
                <div className="flex items-center gap-1">
                  <Sparkles size={12} className="text-purple-600" />
                  <span className="text-xs text-[#344767]">
                    AI Confidence: {confidence}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
            className="text-[#2E69A4] hover:text-[#1B2A49] transition-colors"
          >
            <Edit3 size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <div className="bg-[#F4F7FA] p-3 rounded-lg">
            <div className="text-xs text-[#344767] font-semibold mb-1">
              Customer:
            </div>
            <div className="text-sm text-[#1B2A49]">{query}</div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <Bot size={14} className="text-purple-600" />
              <div className="text-xs text-purple-600 font-semibold">
                AI Suggested Reply:
              </div>
              {currentReply !== aiReply && (
                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                  Edited
                </span>
              )}
            </div>
            <div className="text-sm text-[#1B2A49]">{currentReply}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSendClick();
            }}
            disabled={!isSendEnabled}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              isSendEnabled
                ? "bg-[#1B2A49] text-white hover:opacity-90 cursor-pointer shadow-sm"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send size={16} />
            {isSendEnabled ? "Send Reply" : "Approve to Send"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
            className="px-4 py-2 border-2 border-[#2E69A4] text-[#2E69A4] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApproveClick();
            }}
            className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
              isSendEnabled
                ? "border-green-500 bg-green-50 text-green-600"
                : "border-green-500 text-green-600 hover:bg-green-50"
            }`}
          >
            <CheckCheck size={16} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCancelEdit}
        title="Edit AI Reply"
        size="md"
        showCloseButton={true}
        closeOnOverlayClick={true}
        titleIcon={<Edit3 size={20} className="text-white" />}
      >
        <div className="p-6 space-y-6">
          {/* Original Customer Message */}
          <div>
            <h4 className="text-sm font-semibold text-[#344767] mb-2">
              Customer Message:
            </h4>
            <div className="bg-[#F4F7FA] p-3 rounded-lg border border-[#E1E8F5]">
              <p className="text-sm text-[#1B2A49]">{query}</p>
            </div>
          </div>

          {/* AI Reply Editing Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-[#344767]">
                Edit AI Reply:
              </h4>
              <div className="flex items-center gap-1">
                <Bot size={14} className="text-purple-600" />
                <span className="text-xs text-purple-600">
                  AI Confidence: {confidence}%
                </span>
              </div>
            </div>
            <textarea
              value={editedMessage}
              onChange={handleEditChange}
              rows={6}
              className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] resize-none transition-colors"
              placeholder="Edit the AI response..."
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-[#344767]">
                Character count: {editedMessage.length}
              </span>
              {editedMessage !== aiReply && (
                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                  Edited from original
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#E1E8F5]">
            <button
              onClick={handleCancelEdit}
              className="flex-1 border-2 border-gray-400 text-gray-600 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleModalApprove}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCheck size={18} />
              Approve & Save
            </button>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-blue-800">
                  <strong>Pro Tip:</strong> The AI will learn from your edits to
                  improve future responses. Make sure the reply maintains a
                  professional and helpful tone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReplyCard;
