"use client";

import React, { useEffect, useState } from "react";
import { Shield, ShieldCheck, ShieldOff, KeyRound, RefreshCw, Loader2 } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import EmptyState from "@/components/empty-state/EmptyState";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import TwoFactorStatus from "./TwoFactorStatus";
import TwoFactorSetup from "./TwoFactorSetup";

// ================= TYPES =================
export type TwoFactorMethod = "totp" | "sms" | "email";
export type SetupStep = 0 | 1 | 2 | 3;

export interface TwoFactorSettingsData {
  uuid: string;
  user_id: string;
  method: TwoFactorMethod;
  is_enabled: boolean;
  phone?: string | null;
  email?: string | null;
  secret?: string | null;
}

const TwoFactorSettings: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user?.user_id as string;

  // ── Remote state ──
  const [settings, setSettings] = useState<TwoFactorSettingsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Setup panel visibility ──
  const [showSetup, setShowSetup] = useState(false);

  // ── Setup flow state ──
  const [step, setStep] = useState<SetupStep>(0);
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod>("totp");

  // TOTP
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");

  // SMS / Email
  const [methodValue, setMethodValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpUserId, setOtpUserId] = useState("");

  // Recovery
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  // ── Loading states ──
  const [setupLoading, setSetupLoading] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  // ── Method label map (used in multiple places) ──
  const methodLabel: Record<TwoFactorMethod, string> = {
    totp: "Authenticator App",
    sms: "SMS",
    email: "Email",
  };

  useEffect(() => {
    if (!userId) return;
    fetchSettings();
  }, [userId]);

  // ── Reset setup state ──
  const resetSetup = () => {
    setStep(0);
    setSelectedMethod("totp");
    setQrCode(null);
    setTotpSecret(null);
    setTotpCode("");
    setMethodValue("");
    setOtpSent(false);
    setOtpCode("");
    setRecoveryCodes([]);
  };

  // ─────────────────────────────────────────
  // API: GET /user-two-factor-settings/user/:userId
  // ─────────────────────────────────────────
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/user-two-factor-settings/user/${userId}`);
      setSettings(res.data || null);
    } catch {
      setError("Failed to load 2FA settings.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // STEP 0 → 1 (TOTP): Setup TOTP
  // API: POST /user-two-factor-settings/user_totp_setup
  // ─────────────────────────────────────────
  const handleSetupTOTP = async () => {
    setSetupLoading(true);
    try {
      const res = await axiosInstance.post(`/user-two-factor-settings/user_totp_setup`, { user_id: userId });
      setQrCode(res.data?.qrcode || null);
      setTotpSecret(res.data?.response?.secret || null);
      setStep(1);
    } catch {
      toast.error("Failed to setup TOTP. Please try again.");
    } finally {
      setSetupLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // STEP 1 (TOTP): Verify TOTP code → enable 2FA
  // API: POST /user-two-factor-settings/verify_user_totp/:userId
  // ─────────────────────────────────────────
  const handleVerifyTOTP = async () => {
    if (totpCode.length < 6) { toast.error("Please enter the 6-digit code"); return; }
    setVerifyLoading(true);
    try {
      const res = await axiosInstance.post(
        `/user-two-factor-settings/verify_user_totp/${userId}`,
        { code: totpCode }
      );
      if (res.data?.is_enabled) {
        toast.success("Code verified! Generating recovery codes…");
        await handleGenerateRecoveryCodes();
        setStep(2);
        fetchSettings();
      } else {
        toast.error("Invalid code. Please try again.");
      }
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // STEP 0 → 1 (SMS/Email): Save method + send OTP
  // API: POST /user-two-factor-settings/method/:userId
  // ─────────────────────────────────────────
  const handleSaveMethod = async () => {
    if (!methodValue.trim()) {
      toast.error(`Please enter your ${selectedMethod === "sms" ? "phone number" : "email address"}`);
      return;
    }
    setSetupLoading(true);
    try {
      await axiosInstance.post(`/user-two-factor-settings/method/${userId}`, { method: selectedMethod, value: methodValue });
      await handleSendOtp();
      setStep(1);
    } catch {
      toast.error("Failed to save method. Please try again.");
    } finally {
      setSetupLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Send OTP for SMS/Email verification
  // API: POST /two-factor-otps/generate/:user_id
  // ─────────────────────────────────────────
  const handleSendOtp = async () => {
    setSendOtpLoading(true);
    try {
      await axiosInstance.post(`/two-factor-otps/generate/${userId}`);
      setOtpSent(true);
      setOtpUserId(userId!);
      toast.success(`OTP sent to your ${selectedMethod === "sms" ? "phone" : "email"}`);
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setSendOtpLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // STEP 1 (SMS/Email): Verify OTP
  // API: POST /two-factor-otps/verify/:user_id
  // ─────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) { toast.error("Please enter the OTP"); return; }
    setVerifyLoading(true);
    try {
      const res = await axiosInstance.post(`/two-factor-otps/verify/${userId}`, { otpCode });
      if (res.data?.success) {
        toast.success("OTP verified! Generating recovery codes…");
        await handleGenerateRecoveryCodes();
        setStep(2);
        fetchSettings();
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch {
      toast.error("OTP verification failed. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // STEP 2: Generate Recovery Codes
  // API: POST /two-factor-recovery-codes/generate/:user_id
  // ─────────────────────────────────────────
  const handleGenerateRecoveryCodes = async () => {
    setRecoveryLoading(true);
    try {
      const res = await axiosInstance.post(`/two-factor-recovery-codes/generate/${userId}`);
      setRecoveryCodes(res.data?.codes || []);
    } catch {
      toast.error("Failed to generate recovery codes.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Disable 2FA
  // API: PATCH /user-two-factor-settings/disable/:userId
  // ─────────────────────────────────────────
  const handleDisable2FA = async () => {
    setDisableLoading(true);
    try {
      await axiosInstance.patch(`/user-two-factor-settings/disable/${userId}`);
      toast.success("2FA disabled successfully");
      setShowSetup(false);
      resetSetup();
      fetchSettings();
    } catch {
      toast.error("Failed to disable 2FA. Please try again.");
    } finally {
      setDisableLoading(false);
    }
  };

  return (
    <SectionCard title="Two-Factor Authentication" icon={Shield}>
      {/* Loading */}
      {loading && (
        <div className="p-20 flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <EmptyState
          icon={Shield}
          title="Failed to load 2FA settings"
          description={error}
          ctaLabel="Retry"
          onCTAClick={fetchSettings}
        />
      )}

      {!loading && !error && (
        <div className="space-y-5">
          {/* Status Banner & Recovery Section */}
          <TwoFactorStatus
            settings={settings}
            disableLoading={disableLoading}
            recoveryLoading={recoveryLoading}
            recoveryCodes={recoveryCodes}
            showSetup={showSetup}
            onDisable={handleDisable2FA}
            onRegenerate={handleGenerateRecoveryCodes}
            onToggleSetup={() => {
              setShowSetup((prev) => !prev);
              if (showSetup) resetSetup();
            }}
            methodLabel={methodLabel}
          />

          {/* Setup Panel (only when 2FA is disabled and user clicked "Enable") */}
          {showSetup && !settings?.is_enabled && (
            <TwoFactorSetup
              step={step}
              selectedMethod={selectedMethod}
              qrCode={qrCode}
              totpSecret={totpSecret}
              totpCode={totpCode}
              methodValue={methodValue}
              otpSent={otpSent}
              otpCode={otpCode}
              otpUserId={otpUserId}
              recoveryCodes={recoveryCodes}
              setupLoading={setupLoading}
              sendOtpLoading={sendOtpLoading}
              verifyLoading={verifyLoading}
              recoveryLoading={recoveryLoading}
              onMethodSelect={setSelectedMethod}
              onMethodValueChange={setMethodValue}
              onTotpCodeChange={setTotpCode}
              onOtpCodeChange={setOtpCode}
              onSetupTOTP={handleSetupTOTP}
              onSaveMethod={handleSaveMethod}
              onVerifyTOTP={handleVerifyTOTP}
              onSendOtp={handleSendOtp}
              onVerifyOtp={handleVerifyOtp}
              onGenerateRecoveryCodes={handleGenerateRecoveryCodes}
              onStepComplete={() => setShowSetup(false)}
              methodLabel={methodLabel}
            />
          )}
        </div>
      )}
    </SectionCard>
  );
};

export default TwoFactorSettings;