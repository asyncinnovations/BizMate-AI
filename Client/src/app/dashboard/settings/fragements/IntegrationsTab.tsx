// app/settings/components/IntegrationsTab.tsx
import React, { useEffect, useState } from "react";
import {
  Plug,
  Instagram,
  Shield,
  Mail,
  AlertCircle,
  MessageCircle,
  Plus,
  Edit2,
  CheckCircle,
} from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/empty-state/EmptyState";
import { IntegrationForm } from "@/components/integration-form/IntegrationForm";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import PlatformCard from "@/components/platform-card/PlatformCard";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import PaymentMethods from "@/components/payment-methods/PaymentMethods";

// ================= TYPES =================
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

const EMPTY_CREDENTIALS = {
  phone_number_id: "",
  business_account_id: "",
  access_token: "",
  instagram_user_id: "",
  app_id: "",
  app_secret: "",
  smtp_host: "",
  smtp_port: "",
  smtp_username: "",
  smtp_password: "",
  from_email: "",
};

// ================= COMPONENT =================
const IntegrationsTab: React.FC = () => {
  const { user, loading } = useAuth();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("whatsapp");
  const [platforms, setPlatforms] = useState<Platforms[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platforms | null>(null);
  const [credentials, setCredentials] = useState(EMPTY_CREDENTIALS);

  const [platformOptions] = useState<PlatformOptions[]>([
    {
      value: "whatsapp",
      label: "WhatsApp",
      icon: <MessageCircle className="w-8 h-8 text-[#25D366]" />,
      color: "border-[#25D366]",
    },
    {
      value: "instagram",
      label: "Instagram",
      icon: <Instagram className="w-8 h-8 text-[#E1306C]" />,
      color: "border-[#E1306C]",
    },
    {
      value: "email",
      label: "Email",
      icon: <Mail className="w-8 h-8 text-[#1A73E8]" />,
      color: "border-[#1A73E8]",
    },
  ]);

  // ─────────────────────────────────────────
  // API: GET /user_integration/user/:user_id
  // Returns: { response: Platforms[] }
  // ─────────────────────────────────────────
  const fetchUserPlatforms = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/user_integration/user/${user?.user.user_id}`
      );
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

  // ─────────────────────────────────────────
  // API: POST /user_integration/create
  // Body: { user_id, platform, access_token, metadata }
  // ─────────────────────────────────────────
  const handleConnectPlatform = async () => {
    try {
      const filteredCredentials = Object.fromEntries(
        Object.entries(credentials).filter(([_, v]) => v?.trim() !== "")
      );
      const payload = {
        user_id: user?.user.user_id,
        platform: selectedPlatform,
        access_token: filteredCredentials.access_token,
        metadata: filteredCredentials,
      };
      const response = await axiosInstance.post(`/user_integration/create`, payload);
      if (response.status === 201) {
        toast.success("Platform connected successfully!");
        setPlatforms((prev) => [...prev, response.data.response]);
      }
    } catch (error) {
      console.error("Error connecting platform:", error);
    } finally {
      setShowConnectModal(false);
    }
  };

  // ─────────────────────────────────────────
  // API: PATCH /user_integration/update/:uuid
  // Body: { user_id, platform, access_token, metadata }
  // ─────────────────────────────────────────
  const handleUpdatePlatform = async () => {
    try {
      const filteredCredentials = Object.fromEntries(
        Object.entries(credentials).filter(([_, v]) => v?.trim() !== "")
      );
      const payload = {
        user_id: user?.user.user_id,
        platform: selectedPlatform,
        access_token: filteredCredentials.access_token,
        metadata: filteredCredentials,
      };
      const response = await axiosInstance.patch(
        `/user_integration/update/${editingPlatform?.uuid}`,
        payload
      );
      if (response.status === 200) {
        toast.success("Platform updated successfully!");
        setPlatforms((prev) =>
          prev.map((p) =>
            p.uuid === editingPlatform?.uuid ? response.data.response : p
          )
        );
      }
    } catch (error) {
      console.error("Error updating platform:", error);
    } finally {
      setShowConnectModal(false);
    }
  };

  // ─────────────────────────────────────────
  // API: DELETE /user_integration/delete/:uuid
  // ─────────────────────────────────────────
  const handleDeletePlatform = async (platformId: string) => {
    if (!confirm("Are you sure you want to delete this platform?")) return;
    try {
      const response = await axiosInstance.delete(
        `/user_integration/delete/${platformId}`
      );
      if (response.status === 200) {
        toast.success("Platform deleted successfully!");
        setPlatforms((prev) => prev.filter((p) => p.uuid !== platformId));
      }
    } catch (error) {
      console.error("Error deleting platform:", error);
    }
  };

  // ─────────────────────────────────────────
  // API: PATCH /user_integration/update_status/:uuid
  // Body: { status: "connected" | "disconnected" }
  // ─────────────────────────────────────────
  const handleToggleStatus = async (platform: Platforms) => {
    try {
      const status = platform.status === "connected" ? "disconnected" : "connected";
      const response = await axiosInstance.patch(
        `/user_integration/update_status/${platform.uuid}`,
        { status }
      );
      if (response.status === 200) {
        toast.success(`Platform ${status} successfully!`);
        setPlatforms((prev) =>
          prev.map((p) => (p.uuid === platform.uuid ? { ...p, status } : p))
        );
      }
    } catch (error) {
      console.error("Error toggling platform status:", error);
    }
  };

  // ─────────────────────────────────────────
  // API: PATCH /user_integration/update_sync/:uuid
  // Retrieves latest data from connected platform
  // ─────────────────────────────────────────
  const handleUpdateSync = async (platformId: string) => {
    try {
      const response = await axiosInstance.patch(
        `/user_integration/update_sync/${platformId}`
      );
      if (response.status === 200) {
        toast.success("Sync completed successfully!");
        setPlatforms((prev) =>
          prev.map((p) =>
            p.uuid === platformId ? { ...p, ...response.data.response } : p
          )
        );
      }
    } catch (error) {
      console.error("Error syncing platform:", error);
    }
  };

  // ── Input handlers ──
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  // ================= RENDER =================
  return (
    <div className="space-y-6">
      <SectionCard title="Business Platforms" icon={Plug}>

        <div className="flex items-center justify-start mb-6">
          <Button
            onClick={handleAddModalOpen}
            startIcon={<Plus className="w-4 h-4" />}
            className="px-4 py-2 text-sm"
          >
            Connect Platform
          </Button>
        </div>

        {isLoading ? (
          <div className="p-20 flex items-center justify-center">
            <LoadingSpinner size="w-8 h-8" />
          </div>
        ) : platforms.length === 0 ? (
          <EmptyState
            icon={Plug}
            title="No platforms connected yet"
            description="Connect WhatsApp, Instagram or Email to get started"
          />
        ) : (
          <div className="space-y-3">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.uuid}
                platform={platform}
                onSync={handleUpdateSync}
                toggleStatus={handleToggleStatus}
                onDelete={handleDeletePlatform}
                onUpdate={handleUpdateModalOpen}
                platformOptions={platformOptions}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* Payment Methods */}
      <PaymentMethods />

      {/* Connect / Edit Platform Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title={!editingPlatform ? "Connect Your Platforms" : "Edit your Platform"}
        titleIcon={<Shield className="w-5 h-5 text-white" />}
        showCloseButton={true}
        closeOnOverlayClick={true}
        size="lg"
      >
        <div className="p-6">
          <p className="text-sm text-text-primary mb-6">
            Integrate your accounts with WhatsApp, Instagram, Email, and more to
            streamline your communication.
          </p>

          {/* Platform selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-heading mb-3">
              Select Platform <span className="text-status-error">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {platformOptions.map((platform) => {
                const isDisabled =
                  platform.value !== selectedPlatform && !!editingPlatform;
                return (
                  <button
                    key={platform.value}
                    disabled={isDisabled}
                    onClick={() => handlePlatformChange(platform.value)}
                    className={`p-4 border-2 rounded-lg transition-all hover:shadow-raised ${selectedPlatform === platform.value
                      ? `${platform.color} bg-brand-light shadow-card`
                      : "border-border hover:border-secondary-light"
                      } ${isDisabled
                        ? "opacity-40 cursor-not-allowed grayscale hover:shadow-none"
                        : ""
                      }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {platform.icon}
                      <span
                        className={`font-medium text-sm ${isDisabled ? "text-text-muted" : "text-text-heading"
                          }`}
                      >
                        {platform.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security notice */}
          <div className="bg-status-info-bg border border-status-info-border rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-status-info flex-shrink-0 mt-0.5" />
            <div className="text-sm text-status-info-text">
              <p className="font-medium mb-1">Security Notice</p>
              <p>
                Your platform credentials are encrypted and stored securely. We
                never have access to your actual account passwords or tokens.
              </p>
            </div>
          </div>

          {/* Platform-specific credential form */}
          <div className="space-y-4 mb-6">
            <IntegrationForm
              credentials={credentials}
              onChange={handleInputChange}
              selectedIntegration={selectedPlatform}
            />
          </div>

          {/* Helper text */}
          <div className="p-4 bg-bg-base rounded-lg border border-border mb-6">
            <p className="text-sm text-text-primary">
              <strong className="text-text-heading">Need help?</strong> Visit your{" "}
              {selectedPlatform === "whatsapp" && "WhatsApp"}
              {selectedPlatform === "instagram" && "Instagram"}
              {selectedPlatform === "email" && "Email"} dashboard to find your
              API credentials.
            </p>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              onClick={() => setShowConnectModal(false)}
              className="bg-transparent border border-border text-text-primary rounded-lg hover:bg-bg-subtle"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                !editingPlatform
                  ? handleConnectPlatform()
                  : handleUpdatePlatform()
              }
              startIcon={
                editingPlatform
                  ? <Edit2 className="w-4 h-4" />
                  : <CheckCircle className="w-4 h-4" />
              }
            >
              {editingPlatform ? "Edit Platform" : "Add Platform"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IntegrationsTab;