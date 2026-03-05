"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Wallet,
  Plus,
  Shield,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Building2,
  Slash,
  Trash,
} from "lucide-react";
import SectionCard from "../section-card/SectionCard";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { IntegrationForm } from "../integration-form/IntegrationForm";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { renderDateTime } from "@/utils/renderDateTime";
import EmptyState from "../empty-state/EmptyState";

// ─── Types ────────────────────────────────────────────────
interface PaymentGateway {
  uuid: string;
  user_id: string;
  gateway_name: string;
  credentails: Record<string, string>;
  is_active: boolean;
  created_at: string;
}

const EMPTY_CREDENTIALS = {
  publishable_key: "",
  secret_key: "",
  webhook_secret: "",
  client_id: "",
  client_secret: "",
  store_id: "",
  auth_key: "",
};

// ─────────────────────────────────────────────────────────
const PaymentMethods: React.FC = () => {
  const { user, loading } = useAuth();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState("stripe");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentGateway[]>([]);
  const [credentials, setCredentials] = useState(EMPTY_CREDENTIALS);

  const gatewayOptions = [
    {
      value: "stripe",
      label: "Stripe",
      icon: <CreditCard className="w-8 h-8 text-secondary" />,
      activeBorder: "border-secondary",
    },
    {
      value: "paypal",
      label: "PayPal",
      icon: <DollarSign className="w-8 h-8 text-status-info" />,
      activeBorder: "border-status-info",
    },
    {
      value: "telr",
      label: "Telr",
      icon: <Building2 className="w-8 h-8 text-secondary" />,
      activeBorder: "border-secondary",
    },
  ];

  /////////////////////////////////////
  // Handle Input Change
  /////////////////////////////////////
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  /////////////////////////////////////
  // Handle Gateway Change (e.g , stripe ➡ paypal)
  /////////////////////////////////////
  const handleGatewayChange = (gateway: string) => {
    setSelectedGateway(gateway);
    setCredentials(EMPTY_CREDENTIALS);
  };

  /////////////////////////////////////
  // Get All Payment Methods of User
  /////////////////////////////////////
  const fetchUserPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/user_payment_gateway/user/${user?.user.user_id}`,
      );
      if (response.status === 200) setPaymentMethods(response.data.response);
    } catch (error) {
      console.error("Error fetching gateways", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.user.user_id) fetchUserPaymentMethods();
  }, [loading, user?.user.user_id]);

  /////////////////////////////////////
  // Connect Payment Method
  /////////////////////////////////////
  const handleConnect = async () => {
    if (loading || !user?.user.user_id) {
      toast.error("User ID not loaded yet");
      return;
    }
    try {
      const filteredCredentials = Object.fromEntries(
        Object.entries(credentials).filter(([, v]) => v?.trim() !== ""),
      );
      const response = await axiosInstance.post(
        "/user_payment_gateway/connect",
        {
          user_id: user.user.user_id,
          gateway_name: selectedGateway,
          credentials: filteredCredentials,
        },
      );
      if (response.status === 201) {
        toast.success("Gateway added successfully!");
        fetchUserPaymentMethods();
      }
    } catch (error) {
      console.error("Error adding gateway", error);
    } finally {
      setShowConnectModal(false);
      setSelectedGateway("stripe");
      setCredentials(EMPTY_CREDENTIALS);
    }
  };

  /////////////////////////////////////
  // Deactivate A Payment Method
  /////////////////////////////////////
  const handleDeactivate = async (user_id: string, gateway_name: string) => {
    if (loading || !user?.user.user_id) {
      toast.error("User ID not loaded yet");
      return;
    }
    try {
      const response = await axiosInstance.patch(
        "/user_payment_gateway/deactivate",
        { user_id, gateway_name },
      );
      if (response.status === 200) {
        toast.success("Gateway deactivated!");
        fetchUserPaymentMethods();
      }
    } catch (error) {
      toast.error("Error while deactivating gateway!");
      console.error(error);
    }
  };

  /////////////////////////////////////
  // Activate A Payment Method
  /////////////////////////////////////
  const handleSetActive = (user_id: string, gateway_name: string) => {
    toast.error("Function not implemented yet!");
    console.log(user_id, gateway_name);
  };

  /////////////////////////////////////
  // Delete All Payment Method
  /////////////////////////////////////
  const deleteAllPaymentMethods = async () => {
    if (loading || !user?.user.user_id) {
      toast.error("User ID not loaded yet!");
      return;
    }
    try {
      const response = await axiosInstance.delete(
        `/user_payment_gateway/delete/${user.user.user_id}`,
      );
      if (response.status === 200) {
        toast.success("All payment methods deleted!");
        fetchUserPaymentMethods();
      }
    } catch (error) {
      console.error("Error deleting all methods", error);
    }
  };

  const getGatewayIcon = (gateway: string) => {
    const option = gatewayOptions.find((o) => o.value === gateway);
    return option?.icon || <CreditCard className="w-5 h-5 text-secondary" />;
  };

  // ─────────────────────────────────────────────────────
  return (
    <>
      <SectionCard title="Payment Methods" icon={Wallet}>
        {/* Top action row */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setShowConnectModal(true)}
            startIcon={<Plus className="w-4 h-4" />}
            className="px-4 py-2 text-sm"
          >
            Connect Payment Gateway
          </Button>
          {paymentMethods.length > 1 && (
            <Button
              onClick={deleteAllPaymentMethods}
              startIcon={<Trash className="w-4 h-4" />}
              className="px-4 py-2 text-sm bg-status-error-bg border border-status-error-border text-status-error hover:bg-status-error hover:text-on-brand shadow-none"
            >
              Delete All
            </Button>
          )}
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : paymentMethods.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No payment methods connected yet"
            description="Add a payment method to securely receive payments and manage transactions."
          />
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.uuid}
                className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${
                  method.is_active
                    ? "bg-bg-base border-border hover:border-border-strong hover:shadow-card"
                    : "bg-bg-base border-border opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Inactive overlay */}
                {!method.is_active && (
                  <div className="absolute inset-0 bg-surface/50 rounded-xl z-10" />
                )}

                {/* LEFT — gateway info */}
                <div className="flex items-center gap-3 z-20">
                  {getGatewayIcon(method.gateway_name)}
                  <div>
                    <p className="text-sm font-semibold text-text-heading capitalize">
                      {method.gateway_name}
                    </p>
                    {method.created_at && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        Added {renderDateTime(method.created_at)}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT — status + actions */}
                <div className="flex items-center gap-2 z-20">
                  {/* Status badge */}
                  <span
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      method.is_active
                        ? "bg-status-success-bg text-status-success border-status-success-border"
                        : "bg-bg-base text-text-muted border-border"
                    }`}
                  >
                    {method.is_active ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Slash className="w-3.5 h-3.5" />
                    )}
                    {method.is_active ? "Active" : "Inactive"}
                  </span>

                  {/* Activate / Deactivate */}
                  <Button
                    onClick={() =>
                      method.is_active
                        ? handleDeactivate(method.user_id, method.gateway_name)
                        : handleSetActive(method.user_id, method.gateway_name)
                    }
                    className={`text-xs px-3 py-1.5 ${
                      method.is_active
                        ? "bg-status-error-bg border border-status-error-border text-status-error hover:bg-status-error hover:text-on-brand hover:border-status-error"
                        : "bg-status-success-bg border border-status-success-border text-status-success hover:bg-status-success hover:text-on-brand hover:border-status-success"
                    }`}
                  >
                    {method.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Connect Modal ──────────────────────────────── */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title="Connect Payment Gateway"
        titleIcon={<Shield className="w-4 h-4 text-white" />}
        showCloseButton
        closeOnOverlayClick
        size="lg"
      >
        <div className="p-6 space-y-5">
          <p className="text-sm text-text-secondary">
            Securely connect your payment gateway credentials
          </p>

          {/* Gateway selector */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-3">
              Select Payment Gateway{" "}
              <span className="text-status-error">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {gatewayOptions.map((gateway) => {
                const active = selectedGateway === gateway.value;
                return (
                  <button
                    key={gateway.value}
                    onClick={() => handleGatewayChange(gateway.value)}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      active
                        ? `${gateway.activeBorder} bg-brand-light shadow-card`
                        : "border-border bg-bg-base hover:border-border-strong hover:bg-surface"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {gateway.icon}
                      <span
                        className={`text-sm font-semibold ${active ? "text-text-heading" : "text-text-secondary"}`}
                      >
                        {gateway.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security notice */}
          <div className="flex gap-3 p-4 bg-status-info-bg border border-status-info-border rounded-xl">
            <AlertCircle className="w-4 h-4 text-status-info shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-text-heading mb-0.5">
                Security Notice
              </p>
              <p className="text-text-secondary text-xs">
                Your payment credentials are encrypted and stored securely. We
                never have access to your actual payment data.
              </p>
            </div>
          </div>

          {/* Gateway-specific form */}
          <IntegrationForm
            credentials={credentials}
            onChange={handleInputChange}
            selectedIntegration={selectedGateway}
          />

          {/* Help text */}
          <div className="p-4 bg-bg-base border border-border rounded-xl">
            <p className="text-xs text-text-secondary">
              <strong className="text-text-heading">Need help?</strong> Visit
              your {selectedGateway === "stripe" && "Stripe"}
              {selectedGateway === "paypal" && "PayPal"}
              {selectedGateway === "telr" && "Telr"} dashboard to find your API
              credentials.
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              onClick={() => setShowConnectModal(false)}
              className="bg-transparent border border-border text-text-secondary hover:bg-bg-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              startIcon={<CheckCircle className="w-4 h-4" />}
            >
              Connect Gateway
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PaymentMethods;
