"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Wallet,
  Plus,
  Shield,
  AlertCircle,
  Check,
  DollarSign,
  Building2,
  CheckCircle,
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

interface PaymentGateway {
  uuid: string;
  user_id: string;
  gateway_name: string;
  credentails: Record<string, string>;
  is_active: boolean;
  created_at: string;
}

const PaymentMethods: React.FC = () => {
  const { user, loading } = useAuth();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<string>("stripe");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentGateway[]>([]);
  const [credentials, setCredentials] = useState({
    publishable_key: "",
    secret_key: "",
    webhook_secret: "",
    client_id: "",
    client_secret: "",
    store_id: "",
    auth_key: "",
  });

  const gatewayOptions = [
    {
      value: "stripe",
      label: "Stripe",
      icon: <CreditCard className="w-8 h-8 text-[#635BFF]" />,
      color: "border-[#635BFF]",
    },
    {
      value: "paypal",
      label: "PayPal",
      icon: <DollarSign className="w-8 h-8 text-[#0070BA]" />,
      color: "border-[#0070BA]",
    },
    {
      value: "telr",
      label: "Telr",
      icon: <Building2 className="w-8 h-8 text-[#2E69A4]" />,
      color: "border-[#2E69A4]",
    },
  ];

  /////////////////////////////////////
  // Handle Input Change
  /////////////////////////////////////
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  /////////////////////////////////////
  // Handle Gateway Change (e.g , stripe ➡ paypal)
  /////////////////////////////////////
  const handleGatewayChange = (gateway: string) => {
    setSelectedGateway(gateway);
    // Reset form when changing gateway
    setCredentials({
      publishable_key: "",
      secret_key: "",
      webhook_secret: "",
      client_id: "",
      client_secret: "",
      store_id: "",
      auth_key: "",
    });
  };

  /////////////////////////////////////
  // Connect Payment Method
  /////////////////////////////////////
  const handleConnect = async () => {
    if (loading || !user?.user.user_id) {
      toast.error("User id not loaded yet");
      return;
    }
    try {
      const filteredCredentials = Object.fromEntries(
        Object.entries(credentials).filter(([_, value]) => value?.trim() !== "")
      );

      const payload = {
        user_id: user?.user.user_id,
        gateway_name: selectedGateway,
        credentials: filteredCredentials,
      };

      const response = await axiosInstance.post(
        "/user_payment_gateway/connect",
        payload
      );
      if (response.status === 201) {
        toast.success(`Gateway added successfully!`);
        console.log(response.data);
        fetchUserPaymentMethods();
      }
    } catch (error) {
      console.log("Error occur while adding gateway", error);
    } finally {
      setShowConnectModal(false);
      setSelectedGateway("stripe");
      // Reset form
      setCredentials({
        publishable_key: "",
        secret_key: "",
        webhook_secret: "",
        client_id: "",
        client_secret: "",
        store_id: "",
        auth_key: "",
      });
    }
  };

  /////////////////////////////////////
  // Get All Payment Methods of User
  /////////////////////////////////////
  const fetchUserPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/user_payment_gateway/user/${user?.user.user_id}`
      );
      if (response.status === 200) {
        setPaymentMethods(response.data.response);
        console.log(response.data);
      }
    } catch (error) {
      console.log("Error occur while fetching gateways", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.user.user_id) {
      fetchUserPaymentMethods();
    }
  }, [loading, user?.user.user_id]);

  /////////////////////////////////////
  // Deactivate A Payment Method
  /////////////////////////////////////
  const handleDeactivate = async (user_id: string, gateway_name: string) => {
    if (loading || !user?.user.user_id) {
      toast.error("User id is not loaded yet");
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/user_payment_gateway/deactivate`,
        { user_id, gateway_name }
      );

      if (response.status === 200) {
        toast.success(`Gateway diactivated!`);
        fetchUserPaymentMethods();
      }
    } catch (error) {
      toast.error("Error while diactivating gateway!");
      console.log("Error occur while deactivating a gateway", error);
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
      toast.error("User id is not loaded yet!");
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/user_payment_gateway/delete/${user?.user.user_id}`
      );
      if (response.status === 200) {
        toast.success("All payment methods deleted!");
        fetchUserPaymentMethods();
      }
    } catch (error) {
      console.log("Error occur while deleting all methods", error);
    }
  };

  const getGatewayIcon = (gateway: string) => {
    const option = gatewayOptions.find((opt) => opt.value === gateway);
    return option?.icon || <CreditCard className="w-5 h-5 text-[#2E69A4]" />;
  };

  return (
    <>
      <SectionCard title="Payment Methods" icon={Wallet}>
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
              className="px-4 py-2 text-sm text-red-500 bg-red-100 hover:bg-red-200 shadow-none"
            >
              Delete All
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <LoadingSpinner />
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-12 bg-[#F4F7FA] rounded-lg">
            <Wallet className="w-12 h-12 text-[#cacbcc] mx-auto mb-3" />
            <p className="text-[#344767] mb-4">
              No payment methods connected yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.uuid}
                className={`relative flex items-center justify-between p-4 rounded-lg transition-colors ${
                  method.is_active
                    ? "bg-[#F4F7FA] hover:bg-[#E1E8F5]"
                    : "bg-[#F4F7FA] cursor-not-allowed"
                }`}
              >
                {/* Overlay if inactive */}
                {!method.is_active && (
                  <div className="absolute inset-0 bg-gray-100 opacity-50 rounded-lg z-10"></div>
                )}

                {/* LEFT SIDE — Gateway Info */}
                <div className="flex items-center gap-3 z-20">
                  {getGatewayIcon(method.gateway_name)}

                  <div>
                    {/* Gateway Name */}
                    <p className="font-medium text-[#1B2A49] capitalize">
                      {method.gateway_name}
                    </p>

                    {/* Connected Date */}
                    {method.created_at && (
                      <p className="text-sm text-[#344767]">
                        Added on {renderDateTime(method.created_at)}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE — Status & Toggle */}
                <div className="flex items-center gap-3 z-20">
                  {/* Badge — pill style */}
                  <span
                    className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold ${
                      method.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {method.is_active ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Slash size={14} />
                    )}
                    {method.is_active ? "Active" : "Inactive"}
                  </span>

                  {/* Toggle Button — always colored, darker on hover */}
                  <Button
                    onClick={() =>
                      method.is_active
                        ? handleDeactivate(method.user_id, method.gateway_name)
                        : handleSetActive(method.user_id, method.gateway_name)
                    }
                    className={`text-xs px-3 py-1.5 ${
                      method.is_active
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
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

      {/* Connect Payment Gateway Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title="Connect Payment Gateway"
        titleIcon={<Shield className="w-5 h-5 text-white" />}
        showCloseButton={true}
        closeOnOverlayClick={true}
        size="lg"
      >
        <div className="p-6">
          <p className="text-sm text-[#344767] mb-6">
            Securely connect your payment gateway credentials
          </p>

          {/* Gateway Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1B2A49] mb-3">
              Select Payment Gateway <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {gatewayOptions.map((gateway) => (
                <button
                  key={gateway.value}
                  onClick={() => handleGatewayChange(gateway.value)}
                  className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                    selectedGateway === gateway.value
                      ? `${gateway.color} bg-gradient-to-br from-[#2E69A4]/5 to-[#1B2A49]/5 shadow-md`
                      : "border-[#E1E8F5] hover:border-[#2E69A4]/30"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {gateway.icon}
                    <div className="font-medium text-[#1B2A49] text-sm">
                      {gateway.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Security Notice</p>
              <p>
                Your payment credentials are encrypted and stored securely. We
                never have access to your actual payment data.
              </p>
            </div>
          </div>

          {/* Gateway-specific Form */}
          <div className="space-y-4 mb-6">
            <IntegrationForm
              credentials={credentials}
              onChange={handleInputChange}
              selectedIntegration={selectedGateway}
            />
          </div>

          {/* Helper Text */}
          <div className="p-4 bg-[#F4F7FA] rounded-lg mb-6">
            <p className="text-sm text-[#344767]">
              <strong>Need help?</strong> Visit your{" "}
              {selectedGateway === "stripe" && "Stripe"}
              {selectedGateway === "paypal" && "PayPal"}
              {selectedGateway === "telr" && "Telr"} dashboard to find your API
              credentials.
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
