import {
  CheckCircle,
  Plug,
  Slash,
  RefreshCcw,
  Clock,
  Trash2,
  Edit2,
} from "lucide-react";
import React from "react";
import { renderDateTime } from "@/utils/renderDateTime";
import Button from "../ui/Button";

interface Platforms {
  uuid: string;
  user_id: string;
  platform: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  last_sync_at: string;
  status: "connected" | "disconnected";
  metadata: Record<string, string>;
  created_at: string;
}

interface PlatformOptions {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const PlatformCard = ({
  platform,
  platformOptions,
  onDelete,
  onUpdate,
  toggleStatus,
  onSync,
}: {
  platform: Platforms;
  platformOptions: PlatformOptions[];
  onDelete: (uuid: string) => void;
  onUpdate: (platform: Platforms) => void;
  toggleStatus: (platform: Platforms) => void;
  onSync: (uuid: string) => void;
}) => {
  const getPlatformIcon = (platformName: string) => {
    const option = platformOptions.find((p) => p.value === platformName);
    return option?.icon || <Plug className="w-5 h-5 text-text-muted" />;
  };

  const connected = platform.status === "connected";

  return (
    <div
      key={platform.uuid}
      className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${
        connected
          ? "bg-bg-base border-border hover:border-border-strong hover:shadow-card"
          : "bg-bg-base border-border opacity-60 cursor-not-allowed"
      }`}
    >
      {/* Overlay if disconnected */}
      {!connected && (
        <div className="absolute inset-0 bg-surface/40 rounded-xl z-10" />
      )}

      {/* LEFT SIDE */}
      <div className="flex items-start gap-3 z-20">
        {getPlatformIcon(platform.platform)}

        <div>
          <p className="text-sm font-semibold text-text-heading capitalize">
            {platform.platform}
          </p>

          {platform.created_at && (
            <p className="text-xs text-text-secondary mt-0.5">
              Added {renderDateTime(platform.created_at)}
            </p>
          )}

          {platform.last_sync_at ? (
            <p className="flex items-center gap-1 text-xs text-text-muted mt-1">
              <RefreshCcw className="w-3 h-3" />
              Last synced: {renderDateTime(platform.last_sync_at)}
            </p>
          ) : (
            <p className="text-xs text-text-muted mt-1">Not synced yet</p>
          )}

          {platform.expires_at && (
            <p className="flex items-center gap-1 text-xs text-status-warning mt-1">
              <Clock className="w-3 h-3" />
              Token expires: {renderDateTime(platform.expires_at)}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 z-20">
        {/* Status badge */}
        <span
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border ${
            connected
              ? "bg-status-success-bg text-status-success border-status-success-border"
              : "bg-bg-base text-text-muted border-border"
          }`}
        >
          {connected ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <Slash className="w-3.5 h-3.5" />
          )}
          {connected ? "Connected" : "Disconnected"}
        </span>

        {/* Sync button */}
        {connected && (
          <Button
            startIcon={<RefreshCcw className="w-4 h-4" />}
            onClick={() => onSync(platform.uuid)}
            className="bg-surface border border-border text-text-secondary hover:bg-bg-base text-xs px-3 py-1.5"
          >
            Sync Now
          </Button>
        )}

        {/* Connect / Disconnect */}
        <Button
          onClick={() => toggleStatus(platform)}
          className={`text-xs px-3 py-1.5 ${
            connected
              ? "bg-status-error-bg border border-status-error-border text-status-error hover:bg-status-error hover:text-on-brand hover:border-status-error"
              : "bg-status-success-bg border border-status-success-border text-status-success hover:bg-status-success hover:text-on-brand hover:border-status-success"
          }`}
        >
          {connected ? "Disconnect" : "Connect"}
        </Button>

        {/* Edit */}
        <Button
          onClick={() => onUpdate(platform)}
          className="p-2 rounded-lg bg-bg-base border border-border text-text-muted hover:bg-surface hover:text-text-heading transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </Button>

        {/* Delete */}
        <Button
          onClick={() => onDelete(platform.uuid)}
          className="p-2 rounded-lg bg-status-error-bg border border-status-error-border text-status-error hover:bg-status-error hover:text-on-brand transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlatformCard;
