// app/settings/components/IntegrationsTab.tsx
//
// FIXES APPLIED:
// 1. Sensitive credentials (SMTP password, app_secret, access_token) now show
//    a warning banner and use password-type inputs so they are masked by default.
// 2. update_sync route confirmed: backend uses @Patch("update_sync/:id")
//    (underscore) — same as frontend calls. Route is correct, no fix needed.
//    Added a comment to document this so it is never changed by mistake.

import React, { useEffect, useState } from "react";
import {
  Plug, Instagram, Shield, Mail, AlertCircle,
  MessageCircle, Plus, Edit2, CheckCircle, Eye, EyeOff,
} from "lucide-react";
import SectionCard    from "@/components/section-card/SectionCard";
import Modal          from "@/components/ui/Modal";
import Button         from "@/components/ui/Button";
import EmptyState     from "@/components/empty-state/EmptyState";
import { IntegrationForm } from "@/components/integration-form/IntegrationForm";
import { useAuth }    from "@/context/AuthContext";
import axiosInstance  from "@/utils/axiosInstance";
import toast          from "react-hot-toast";
import PlatformCard   from "@/components/platform-card/PlatformCard";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import PaymentMethods from "@/components/payment-methods/PaymentMethods";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Platforms {
  uuid:          string;
  user_id:       string;
  platform:      string;
  access_token:  string;
  refresh_token: string;
  expires_at:    string;
  last_sync_at:  string;
  status:        "connected" | "disconnected";
  metadata:      Record<string, string>;
  created_at:    string;
}

interface PlatformOptions {
  value:  string;
  label:  string;
  icon:   React.ReactNode;
  color:  string;
}

const EMPTY_CREDENTIALS = {
  phone_number_id:      "",
  business_account_id:  "",
  access_token:         "",
  instagram_user_id:    "",
  app_id:               "",
  app_secret:           "",
  smtp_host:            "",
  smtp_port:            "",
  smtp_username:        "",
  smtp_password:        "",
  from_email:           "",
};

// FIX 1: Fields that contain secrets — shown as password inputs
const SENSITIVE_FIELDS = new Set(["access_token", "app_secret", "smtp_password"]);

// ─── Sensitive field notice ───────────────────────────────────────────────────
const SensitiveFieldNotice: React.FC = () => (
  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
    <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-xs font-semibold text-amber-800">Sensitive credentials</p>
      <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
        Access tokens, passwords, and app secrets are stored encrypted. Never share
        these values with anyone. Rotate compromised credentials immediately from
        your platform dashboard.
      </p>
    </div>
  </div>
);

// ─── Masked input for sensitive fields ───────────────────────────────────────
const CredentialInput: React.FC<{
  name:      string;
  value:     string;
  label:     string;
  sensitive: boolean;
  onChange:  (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({ name, value, label, sensitive, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  const fieldCls = "w-full px-3 py-2.5 border border-border rounded-lg bg-bg-base text-text-heading text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all";

  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
        {label}
        {sensitive && (
          <span className="ml-2 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full normal-case tracking-normal">
            sensitive
          </span>
        )}
      </label>
      {sensitive ? (
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
            className={`${fieldCls} pr-10`}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
          className={fieldCls}
        />
      )}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const IntegrationsTab: React.FC = () => {
  const { user, loading } = useAuth();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("whatsapp");
  const [platforms,        setPlatforms]        = useState<Platforms[]>([]);
  const [isLoading,        setIsLoading]        = useState(false);
  const [editingPlatform,  setEditingPlatform]  = useState<Platforms | null>(null);
  const [credentials,      setCredentials]      = useState(EMPTY_CREDENTIALS);

  const [platformOptions] = useState<PlatformOptions[]>([
    { value: "whatsapp",  label: "WhatsApp",  icon: <MessageCircle className="w-8 h-8 text-[#25D366]" />, color: "border-[#25D366]" },
    { value: "instagram", label: "Instagram", icon: <Instagram     className="w-8 h-8 text-[#E1306C]" />, color: "border-[#E1306C]" },
    { value: "email",     label: "Email",     icon: <Mail          className="w-8 h-8 text-[#1A73E8]" />, color: "border-[#1A73E8]" },
  ]);

  // ── GET /user_integration/user/:user_id ──────────────────────────────────
  const fetchUserPlatforms = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/user_integration/user/${user?.user.user_id}`);
      if (response.status === 200) setPlatforms(response.data.response);
    } catch (error) {
      console.error("Error fetching platforms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.user.user_id) fetchUserPlatforms();
  }, [loading, user]);

  // ── POST /user_integration/create ────────────────────────────────────────
  const handleConnectPlatform = async () => {
    try {
      const filteredCredentials = Object.fromEntries(
        Object.entries(credentials).filter(([_, v]) => v?.trim() !== "")
      );
      const payload = {
        user_id:      user?.user.user_id,
        platform:     selectedPlatform,
        access_token: filteredCredentials.access_token,
        metadata:     filteredCredentials,
      };
      const response = await axiosInstance.post(`/user_integration/create`, payload);
      if (response.status === 201) {
        toast.success("Platform connected successfully!");
        setPlatforms((prev) => [...prev, response.data.response]);
      }
    } catch (error) {
      console.error("Error connecting platform:", error);
      toast.error("Failed to connect platform. Check your credentials.");
    } finally {
      setShowConnectModal(false);
    }
  };

  // ── PATCH /user_integration/update/:uuid ─────────────────────────────────
  const handleUpdatePlatform = async () => {
    try {
      const filteredCredentials = Object.fromEntries(
        Object.entries(credentials).filter(([_, v]) => v?.trim() !== "")
      );
      const payload = {
        user_id:      user?.user.user_id,
        platform:     selectedPlatform,
        access_token: filteredCredentials.access_token,
        metadata:     filteredCredentials,
      };
      const response = await axiosInstance.patch(
        `/user_integration/update/${editingPlatform?.uuid}`,
        payload
      );
      if (response.status === 200) {
        toast.success("Platform updated successfully!");
        setPlatforms((prev) =>
          prev.map((p) => (p.uuid === editingPlatform?.uuid ? response.data.response : p))
        );
      }
    } catch (error) {
      console.error("Error updating platform:", error);
      toast.error("Failed to update platform.");
    } finally {
      setShowConnectModal(false);
    }
  };

  // ── DELETE /user_integration/delete/:uuid ────────────────────────────────
  const handleDeletePlatform = async (platformId: string) => {
    if (!confirm("Remove this integration? This cannot be undone.")) return;
    try {
      const response = await axiosInstance.delete(`/user_integration/delete/${platformId}`);
      if (response.status === 200) {
        toast.success("Platform removed.");
        setPlatforms((prev) => prev.filter((p) => p.uuid !== platformId));
      }
    } catch (error) {
      console.error("Error deleting platform:", error);
    }
  };

  // ── PATCH /user_integration/update_status/:uuid ──────────────────────────
  const handleToggleStatus = async (platform: Platforms) => {
    try {
      const status = platform.status === "connected" ? "disconnected" : "connected";
      const response = await axiosInstance.patch(
        `/user_integration/update_status/${platform.uuid}`,
        { status }
      );
      if (response.status === 200) {
        toast.success(`Platform ${status}.`);
        setPlatforms((prev) =>
          prev.map((p) => (p.uuid === platform.uuid ? { ...p, status } : p))
        );
      }
    } catch (error) {
      console.error("Error toggling platform status:", error);
    }
  };

  // ── PATCH /user_integration/update_sync/:uuid ────────────────────────────
  // FIX 2: Route is update_sync (underscore) on BOTH frontend and backend.
  // Backend controller registers @Patch("update_sync/:id") — confirmed match.
  // No route change needed. Comment added to prevent future regressions.
  const handleUpdateSync = async (platformId: string) => {
    try {
      const response = await axiosInstance.patch(
        `/user_integration/update_sync/${platformId}`
        // NOTE: Backend route is "update_sync" (underscore), not "update-sync".
        // Do NOT change this to a hyphen — it will silently 404.
      );
      if (response.status === 200) {
        toast.success("Sync completed.");
        setPlatforms((prev) =>
          prev.map((p) => (p.uuid === platformId ? { ...p, ...response.data.response } : p))
        );
      }
    } catch (error) {
      console.error("Error syncing platform:", error);
      toast.error("Sync failed. Please try again.");
    }
  };

  // ── Input handlers ────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    if (!editingPlatform) setCredentials(EMPTY_CREDENTIALS);
  };

  const handleAddModalOpen = () => {
    setShowConnectModal(true);
    setSelectedPlatform("whatsapp");
    setEditingPlatform(null);
    setCredentials(EMPTY_CREDENTIALS);
  };

  const handleUpdateModalOpen = (platform: Platforms) => {
    setEditingPlatform(platform);
    setShowConnectModal(true);
    setSelectedPlatform(platform.platform);
    setCredentials({ ...EMPTY_CREDENTIALS, ...platform.metadata });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <SectionCard title="Business Platforms" icon={Plug}>
        <div className="flex items-center justify-start mb-6">
          <Button onClick={handleAddModalOpen} startIcon={<Plus className="w-4 h-4" />} className="px-4 py-2 text-sm">
            Connect Platform
          </Button>
        </div>

        {isLoading ? (
          <div className="p-20 flex items-center justify-center"><LoadingSpinner /></div>
        ) : platforms.length === 0 ? (
          <EmptyState
            icon={Plug}
            title="No platforms connected"
            description="Connect WhatsApp, Instagram, or Email to enable AI auto-reply and notifications."
            ctaLabel="Connect Platform"
            onCTAClick={handleAddModalOpen}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.uuid}
                platform={platform}
                onEdit={handleUpdateModalOpen}
                onDelete={handleDeletePlatform}
                onToggleStatus={handleToggleStatus}
                onSync={handleUpdateSync}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <PaymentMethods />

      {/* Connect / Edit modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title={editingPlatform ? "Update Integration" : "Connect Platform"}
        titleIcon={<Plug className="w-5 h-5 text-white" />}
        size="md"
      >
        <div className="p-6 space-y-5">

          {/* FIX 1: Sensitive credentials banner */}
          <SensitiveFieldNotice />

          {/* Platform picker */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Platform</label>
            <div className="flex gap-3">
              {platformOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handlePlatformChange(opt.value)}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selectedPlatform === opt.value ? `${opt.color} bg-bg-base` : "border-border bg-surface hover:border-border-strong"
                  }`}
                >
                  {opt.icon}
                  <span className="text-xs font-semibold text-text-secondary">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Credential fields — uses CredentialInput for sensitive ones */}
          <div className="space-y-4">
            {selectedPlatform === "whatsapp" && (
              <>
                <CredentialInput name="phone_number_id"     value={credentials.phone_number_id}     label="Phone Number ID"      sensitive={false}  onChange={handleInputChange} />
                <CredentialInput name="business_account_id" value={credentials.business_account_id} label="Business Account ID"  sensitive={false}  onChange={handleInputChange} />
                <CredentialInput name="access_token"        value={credentials.access_token}        label="Access Token"         sensitive={true}   onChange={handleInputChange} />
              </>
            )}
            {selectedPlatform === "instagram" && (
              <>
                <CredentialInput name="instagram_user_id" value={credentials.instagram_user_id} label="Instagram User ID" sensitive={false} onChange={handleInputChange} />
                <CredentialInput name="app_id"            value={credentials.app_id}            label="App ID"           sensitive={false} onChange={handleInputChange} />
                <CredentialInput name="app_secret"        value={credentials.app_secret}        label="App Secret"       sensitive={true}  onChange={handleInputChange} />
                <CredentialInput name="access_token"      value={credentials.access_token}      label="Access Token"     sensitive={true}  onChange={handleInputChange} />
              </>
            )}
            {selectedPlatform === "email" && (
              <>
                <CredentialInput name="smtp_host"     value={credentials.smtp_host}     label="SMTP Host"     sensitive={false} onChange={handleInputChange} placeholder="smtp.gmail.com" />
                <CredentialInput name="smtp_port"     value={credentials.smtp_port}     label="SMTP Port"     sensitive={false} onChange={handleInputChange} placeholder="587" />
                <CredentialInput name="smtp_username" value={credentials.smtp_username} label="SMTP Username" sensitive={false} onChange={handleInputChange} placeholder="you@example.com" />
                <CredentialInput name="smtp_password" value={credentials.smtp_password} label="SMTP Password" sensitive={true}  onChange={handleInputChange} />
                <CredentialInput name="from_email"    value={credentials.from_email}    label="From Email"    sensitive={false} onChange={handleInputChange} placeholder="noreply@yourbusiness.ae" />
              </>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={() => setShowConnectModal(false)} className="bg-surface border border-border text-text-secondary hover:bg-bg-base">
              Cancel
            </Button>
            <Button
              onClick={editingPlatform ? handleUpdatePlatform : handleConnectPlatform}
              className="flex-1 justify-center"
              startIcon={editingPlatform ? <Edit2 className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            >
              {editingPlatform ? "Update Integration" : "Connect Platform"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IntegrationsTab;
