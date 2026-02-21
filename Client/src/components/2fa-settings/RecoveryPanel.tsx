import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

interface RecoveryPanelProps {
  codes: string[];
}

const RecoveryPanel: React.FC<RecoveryPanelProps> = ({ codes }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    setCopied(true);
    toast.success("Recovery codes copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-status-warning-bg border border-status-warning-border rounded-lg p-3">
        <p className="text-xs text-status-warning-text font-medium">
          ⚠ Save these codes somewhere safe. Each code can only be used once
          if you ever lose access to your primary 2FA method.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {codes.map((code, i) => (
          <div
            key={i}
            className="flex items-center justify-center p-2.5 bg-bg-base rounded-lg font-mono text-sm text-text-heading tracking-widest border border-border"
          >
            {code}
          </div>
        ))}
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-sm text-secondary hover:text-secondary-hover hover:underline transition-colors"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy all codes"}
      </button>
    </div>
  );
};

export default RecoveryPanel;