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
    return option?.icon || <Plug className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div
      key={platform.uuid}
      className={`relative flex items-center justify-between p-4 rounded-lg transition-colors ${
        platform.status === "connected"
          ? "bg-[#F4F7FA] hover:bg-[#E1E8F5]"
          : "bg-[#F4F7FA] cursor-not-allowed"
      }`}
    >
      {/* Overlay if disconnected */}
      {platform.status === "disconnected" && (
        <div className="absolute inset-0 bg-white/40 rounded-lg z-10"></div>
      )}

      {/* LEFT SIDE */}
      <div className="flex items-start gap-3 z-20">
        {getPlatformIcon(platform.platform)}

        <div>
          <p className="font-medium text-[#1B2A49] capitalize">
            {platform.platform}
          </p>

          {platform.created_at && (
            <p className="text-sm text-[#344767]">
              Added on {renderDateTime(platform.created_at)}
            </p>
          )}

          {platform.last_sync_at ? (
            <p className="flex items-center gap-1 text-xs text-[#6B7280] mt-1">
              <RefreshCcw className="w-3 h-3" />
              Last synced: {renderDateTime(platform.last_sync_at)}
            </p>
          ) : (
            <span className="text-xs text-[#6B7280]">Not synced yet</span>
          )}

          {platform.expires_at && (
            <p className="flex items-center gap-1 text-xs text-[#9A3412] mt-1">
              <Clock className="w-3 h-3" />
              Token expires: {renderDateTime(platform.expires_at)}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 z-20">
        {/* Status */}
        <span
          className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold ${
            platform.status === "connected"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {platform.status === "connected" ? (
            <CheckCircle size={14} />
          ) : (
            <Slash size={14} />
          )}
          {platform.status === "connected" ? "Connected" : "Disconnected"}
        </span>

        {/* SYNC BUTTON */}
        {platform.status === "connected" && (
          <Button
            startIcon={<RefreshCcw className="w-4 h-4" />}
            onClick={() => onSync(platform.uuid)}
            className="bg-white border border-[#E1E8F5] text-gray-700 hover:bg-[#F1F5F9] text-xs px-3 py-1.5"
          >
            Sync Now
          </Button>
        )}

        {/* CONNECT / DISCONNECT */}
        <Button
          onClick={() => toggleStatus(platform)}
          className={`text-xs px-3 py-1.5 ${
            platform.status === "connected"
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {platform.status === "connected" ? "Disconnect" : "Connect"}
        </Button>

        {/* EDIT ICON */}
        <Button
          onClick={() => onUpdate(platform)}
          className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-600"
        >
          <Edit2 className="w-4 h-4" />
        </Button>

        {/* DELETE ICON */}
        <Button
          onClick={() => onDelete(platform.uuid)}
          className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600 transition"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlatformCard;
