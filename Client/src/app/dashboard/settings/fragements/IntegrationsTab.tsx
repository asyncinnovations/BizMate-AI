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
import { IntegrationForm } from "@/components/integration-form/IntegrationForm";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import PlatformCard from "@/components/platform-card/PlatformCard";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import PaymentMethods from "@/components/payment-methods/PaymentMethods";

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

const IntegrationsTab: React.FC = () => {
  const { user, loading } = useAuth();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("whatsapp");
  const [platforms, setPlatforms] = useState<Platforms[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingPlatform, setEditingPlatform] = useState<Platforms | null>(
    null
  );
  const [credentials, setCredentials] = useState({
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
  });

  const [platformOptions, setPlatformOptions] = useState<PlatformOptions[]>([
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

  ////////////////////////////////////
  // Handle Connect Platform
  ////////////////////////////////////
  const handleConnectPlatform = async () => {
    try {
      // Firstly filtered credentials to get only entries that are filled
      const filteredCredentials = Object.fromEntries(
        Object.entries(credentials).filter(([_, value]) => value?.trim() !== "")
      );

      // Make payload to pass to api endpoint
      const payload = {
        user_id: user?.user.user_id,
        platform: selectedPlatform,
        access_token: filteredCredentials.access_token,
        metadata: filteredCredentials,
      };

      const response = await axiosInstance.post(
        `/user_integration/create`,
        payload
      );

      if (response.status === 201) {
        toast.success("Platform connected successfully!");
        console.log(response.data);
        setPlatforms((prev) => [...prev, response.data.response]);
      }
    } catch (error) {
      console.log("Error occur while connecting playtform", error);
    } finally {
      setShowConnectModal(false);
    }
  };

  ////////////////////////////////
  // Fetch User Added PLatforms
  ///////////////////////////////
  const fetchUserPlatforms = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/user_integration/user/${user?.user.user_id}`
      );
      if (response.status === 200) {
        setPlatforms(response.data.response);
      }
    } catch (error) {
      console.log("Error occur while getting user added platforms", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.user.user_id) {
      fetchUserPlatforms();
    }
  }, [loading, user]);

  ////////////////////////////////
  // Delete Single PLatform
  ///////////////////////////////
  const handleDeletePlatform = async (platformId: string) => {
<<<<<<< HEAD
    if (confirm("Are you sure you to want to delete this platform?")) {
      try {
        const response = await axiosInstance.delete(
          `/user_integration/delete/${platformId}`
        );
        if (response.status === 200) {
          toast.success("Platform deleted successfully!");
          setPlatforms((prev) =>
            prev.filter((platform) => platform.uuid !== platformId)
          );
        }
      } catch (error) {
        console.log("Error occur while deleting platform", error);
      }
=======
    try {
      const response = await axiosInstance.delete(
        `/user_integration/delete/${platformId}`
      );
      if (response.status === 200) {
        toast.success("Platform deleted successfully!");
        setPlatforms((prev) =>
          prev.filter((platform) => platform.uuid !== platformId)
        );
      }
    } catch (error) {
      console.log("Error occur while deleting platform", error);
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
    }
  };

  ///////////////////////////
  // Handle Update Platform
  /////////////////////////////
  const handleUpdatePlatform = async () => {
    try {
      // Firstly filtered credentials to get only entries that are filled
      const filteredCredentials = Object.fromEntries(
        Object.entries(credentials).filter(([_, value]) => value?.trim() !== "")
      );

      // Make payload to pass to api endpoint
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
      console.log("Error occur while updating platform", error);
    } finally {
      setShowConnectModal(false);
    }
  };

  ///////////////////////////
  // Handle Toggle Status (Connected or Disconnected)
  /////////////////////////////
  const handleToggleStatus = async (platform: Platforms) => {
    try {
      const status =
        platform.status === "connected" ? "disconnected" : "connected";
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
      console.log("Error occur while updating status", error);
    }
  };

  ///////////////////////////
  // Handle Update Sync (Retrive latest data from connected platforms)
  /////////////////////////////
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
      console.log("Error occur while updating sync status", error);
    }
  };

  ///////////////////////////
  // Handle Input Change
  /////////////////////////////
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    console.log(credentials);
  };

  ///////////////////////////
  // Handle Platform Change
  /////////////////////////////
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    // Reset form when platform changes
    if (!editingPlatform) {
      setCredentials({
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
      });
    }
  };

  ///////////////////////////
  // Handle Add Modal Open
  /////////////////////////////
  const handleAddModalOpen = () => {
    setShowConnectModal(true);
    setSelectedPlatform("whatsapp");
    setEditingPlatform(null);
    setCredentials({
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
    });
  };

  ///////////////////////////
  // Handle Update Modal Open
  /////////////////////////////
  const handleUpdateModalOpen = (platform: Platforms) => {
    setEditingPlatform(platform);
    setShowConnectModal(true);
    setSelectedPlatform(platform.platform);
    setCredentials({
      ...{
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
      },
      ...platform.metadata,
    });
  };

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
          <div className="text-center py-12 bg-[#F4F7FA] rounded-lg">
            <Plug className="w-12 h-12 text-[#cacbcc] mx-auto mb-3" />
            <p className="text-[#344767] mb-4">No platforms connected yet</p>
          </div>
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

      {/* Payment Methods Component */}
      <PaymentMethods />

      {/* Connect Platforms Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title={
          !editingPlatform ? "Connect Your Platforms" : "Edit your Platform"
        }
        titleIcon={<Shield className="w-5 h-5 text-white" />}
        showCloseButton={true}
        closeOnOverlayClick={true}
        size="lg"
      >
        <div className="p-6">
          <p className="text-sm text-[#344767] mb-6">
            Integrate your accounts with WhatsApp, Instagram, Email, and more to
            streamline your communication.
          </p>

          {/* Gateway Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1B2A49] mb-3">
              Select Platform <span className="text-red-500">*</span>
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
                    className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                      selectedPlatform === platform.value
                        ? `${platform.color} bg-gradient-to-br from-[#2E69A4]/5 to-[#1B2A49]/5 shadow-md`
                        : "border-[#E1E8F5] hover:border-[#2E69A4]/30"
                    }   ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed grayscale hover:shadow-none"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {platform.icon}
                      <div
                        className={`font-medium text-sm ${
                          isDisabled ? "text-gray-400" : "text-[#1B2A49]"
                        }`}
                      >
                        {platform.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Security Notice</p>
              <p>
                Your platform credentials are encrypted and stored securely. We
                never have access to your actual account passwords or tokens.
              </p>
            </div>
          </div>

          {/* Gateway-specific Form */}
          <div className="space-y-4 mb-6">
            <IntegrationForm
              credentials={credentials}
              onChange={handleInputChange}
              selectedIntegration={selectedPlatform}
            />
          </div>

          {/* Helper Text */}
          <div className="p-4 bg-[#F4F7FA] rounded-lg mb-6">
            <p className="text-sm text-[#344767]">
              <strong>Need help?</strong> Visit your{" "}
              {selectedPlatform === "whatsapp" && "Whatsapp"}
              {selectedPlatform === "instagram" && "Instagram"}
              {selectedPlatform === "email" && "Email"} dashboard to find your
              API credentials.
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1E8F5]">
            <Button
              onClick={() => setShowConnectModal(false)}
              className="bg-transparent border-[#dfdfdf] border-1  text-[#344767] rounded-lg hover:bg-[#F4F7FA]"
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
                editingPlatform ? (
                  <Edit2 className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )
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
