import React from "react";
import { Send, FileText } from "lucide-react";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface EmailFormData {
  to: string;
  cc: string;
  subject: string;
  message: string;
}

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNumber: string;
  emailFormData: EmailFormData;
  onEmailFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSending: boolean;
}

const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceNumber,
  emailFormData,
  onEmailFormChange,
  onSubmit,
  isSending,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Invoice to Customer"
      size="lg"
      closeOnOverlayClick={true}
      showCloseButton={true}
      titleIcon={<Send className="w-5 h-5 text-white" />}
    >
      <form onSubmit={onSubmit}>
        <div className="p-6 space-y-5">
          {/* Invoice Info */}
          <div className="bg-status-info-bg border border-status-info-border rounded-lg p-4 mb-4">
            <p className="text-sm text-status-info font-medium">
              Invoice #{invoiceNumber}
            </p>
          </div>

          {/* To Email */}
          <InputField
            label="To"
            name="to"
            type="email"
            value={emailFormData.to}
            onChange={onEmailFormChange}
            placeholder="customer@example.com"
            required={true}
          />

          {/* CC Email */}
          <InputField
            label="CC (Optional)"
            name="cc"
            type="email"
            value={emailFormData.cc}
            onChange={onEmailFormChange}
            placeholder="cc@example.com"
          />

          {/* Subject */}
          <InputField
            label="Subject"
            name="subject"
            type="text"
            value={emailFormData.subject}
            onChange={onEmailFormChange}
            placeholder="Invoice subject"
            required={true}
          />

          {/* Message */}
          <InputField
            label="Message"
            name="message"
            type="textarea"
            value={emailFormData.message}
            onChange={onEmailFormChange}
            placeholder="Enter your message here..."
            required={true}
            className="min-h-[200px]"
          />

          {/* Attachment Info */}
          <div className="bg-status-info-bg border border-status-info-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-status-info mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-status-info mb-1">
                  Invoice PDF will be attached
                </p>
                <p className="text-status-info/80">
                  The invoice PDF ({invoiceNumber}.pdf) will be automatically
                  attached to this email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-bg-base px-6 py-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="bg-surface border border-border text-text-secondary hover:bg-bg-base"
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            startIcon={isSending ? null : <Send className="w-4 h-4" />}
            disabled={isSending}
            className="min-w-[140px]"
          >
            {isSending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              "Send Invoice"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SendInvoiceModal;
