"use client";

import React, { useEffect, useState } from "react";
import {
  Monitor,
  Smartphone,
  Globe,
  LogOut,
  RefreshCw,
  MapPin,
  Clock,
} from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import EmptyState from "@/components/empty-state/EmptyState";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// ================= TYPES =================
interface UserSession {
  uuid: string;
  user_id: string;
  device_name: string;
  ip_address: string;
  browser: string;
  os: string;
  location: string;
  is_active: boolean;
  last_active: string;
  created_at: string;
}

// ================= HELPERS =================
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getCurrentBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  return "Unknown Browser";
};

const getCurrentOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Windows NT")) return "Windows";
  if (ua.includes("Mac OS X")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Unknown OS";
};

const isCurrentDevice = (session: UserSession): boolean =>
  session.browser === getCurrentBrowser() && session.os === getCurrentOS();

const getDeviceIcon = (os: string, deviceName: string) => {
  const str = `${os} ${deviceName}`.toLowerCase();
  if (str.includes("mobile") || str.includes("android") || str.includes("iphone"))
    return Smartphone;
  return Monitor;
};

// ================= SESSION ROW =================
interface SessionRowProps {
  session: UserSession;
  isCurrent: boolean;
  onLogout: (uuid: string, isCurrent: boolean) => void;
  onUpdateActive: (uuid: string) => void;
  logoutLoadingId: string | null;
  updateLoadingId: string | null;
}

const SessionRow: React.FC<SessionRowProps> = ({
  session,
  isCurrent,
  onLogout,
  onUpdateActive,
  logoutLoadingId,
  updateLoadingId,
}) => {
  const DeviceIcon = getDeviceIcon(session.os, session.device_name);
  const isLoggingOut = logoutLoadingId === session.uuid;
  const isUpdating = updateLoadingId === session.uuid;

  return (
    <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors">

      {/* Left — device icon + info */}
      <div className="flex items-center gap-3">
        <div className="inline-flex p-2.5 rounded-md bg-white border border-[#E1E8F5] shrink-0">
          <DeviceIcon className="w-4 h-4 text-[#1B2A49]" />
        </div>

        <div>
          {/* Device name + OS + This Device badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-[#1B2A49]">
              {session.device_name || "Unknown Device"}
              {session.os && (
                <span className="ml-1.5 text-xs font-normal text-[#344767]">
                  · {session.os}
                </span>
              )}
            </p>
            {isCurrent && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2E69A4] text-white">
                This Device
              </span>
            )}
          </div>

          {/* Browser · Location · IP · Last active */}
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {session.browser && (
              <span className="flex items-center gap-1 text-xs text-[#344767]">
                <Globe className="w-3 h-3" />
                {session.browser}
              </span>
            )}
            {session.location && (
              <span className="flex items-center gap-1 text-xs text-[#344767]">
                <MapPin className="w-3 h-3" />
                {session.location}
                {session.ip_address && (
                  <span className="text-gray-400 ml-0.5">
                    · {session.ip_address}
                  </span>
                )}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {formatDate(session.last_active)}
            </span>
          </div>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Refresh */}
        <button
          onClick={() => onUpdateActive(session.uuid)}
          disabled={isUpdating}
          className="flex items-center gap-1 text-xs text-[#344767] hover:text-[#1B2A49] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? "animate-spin" : ""}`} />
          <span>{isUpdating ? "Updating..." : "Refresh"}</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => onLogout(session.uuid, isCurrent)}
          disabled={isLoggingOut}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>

    </div>
  );
};

// ================= MAIN COMPONENT =================
const ActiveSessions: React.FC = () => {
  const { user, logout } = useAuth();
  const userId = user?.user?.user_id;
  const router = useRouter();

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoutLoadingId, setLogoutLoadingId] = useState<string | null>(null);
  const [updateLoadingId, setUpdateLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchSessions();
  }, [userId]);

  // GET /user-sessions/user/:userId
  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/user-sessions/user/${userId}`);
      setSessions(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
      setError("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  // PATCH /user-sessions/update_last_active/:uuid
  const handleUpdateActive = async (uuid: string) => {
    setUpdateLoadingId(uuid);
    try {
      await axiosInstance.patch(`/user-sessions/update_last_active/${uuid}`);
      toast.success("Session refreshed");
      fetchSessions();
    } catch {
      toast.error("Failed to refresh session");
    } finally {
      setUpdateLoadingId(null);
    }
  };

  // DELETE /user-sessions/logout/:uuid
  const handleLogout = async (uuid: string, isCurrent: boolean) => {
    setLogoutLoadingId(uuid);
    try {
      await axiosInstance.delete(`/user-sessions/logout/${uuid}`);
      if (isCurrent) {
        toast.success("Logged out successfully");
        logout();
        router.push("/login");
      } else {
        toast.success("Session logged out");
        setSessions((prev) => prev.filter((s) => s.uuid !== uuid));
      }
    } catch {
      toast.error("Failed to logout session");
    } finally {
      setLogoutLoadingId(null);
    }
  };

  return (
    <SectionCard title="Active Sessions" icon={Monitor}>

      {/* Loading */}
      {loading && (
        <div className="p-20 flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <EmptyState
          icon={Monitor}
          title="Failed to load sessions"
          description={error}
          ctaLabel="Retry"
          onCTAClick={fetchSessions}
        />
      )}

      {/* Empty */}
      {!loading && !error && sessions.length === 0 && (
        <EmptyState
          icon={Monitor}
          title="No active sessions"
          description="You have no active sessions at the moment."
        />
      )}

      {/* Sessions list */}
      {!loading && !error && sessions.length > 0 && (
        <div className="space-y-3">
          {/* Summary header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E8F5]">
            <p className="text-sm text-[#344767]">
              <span className="font-semibold text-[#1B2A49]">
                {sessions.length}
              </span>{" "}
              active {sessions.length === 1 ? "session" : "sessions"}
            </p>
            <button
              onClick={fetchSessions}
              className="text-xs text-[#2E69A4] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh all
            </button>
          </div>

          {sessions.map((session) => (
            <SessionRow
              key={session.uuid}
              session={session}
              isCurrent={isCurrentDevice(session)}
              onLogout={handleLogout}
              onUpdateActive={handleUpdateActive}
              logoutLoadingId={logoutLoadingId}
              updateLoadingId={updateLoadingId}
            />
          ))}
        </div>
      )}

    </SectionCard>
  );
};

export default ActiveSessions;