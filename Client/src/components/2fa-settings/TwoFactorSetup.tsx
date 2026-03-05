import React from "react";
import {
  QrCode,
  Smartphone,
  Mail,
  Send,
  ShieldCheck,
  Check,
  KeyRound,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { TwoFactorMethod, SetupStep } from "./TwoFactorSettings";
import RecoveryPanel from "./RecoveryPanel";

// ================= STEP INDICATOR =================
const STEP_LABELS = ["Choose Method", "Verify", "Recovery Codes", "Done"];

const StepIndicator: React.FC<{ current: SetupStep }> = ({ current }) => (
  <div className="flex items-center gap-1 mb-6">
    {STEP_LABELS.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < current
              ? "bg-secondary text-on-secondary"
              : i === current
                ? "bg-brand text-on-brand"
                : "bg-bg-subtle text-text-muted"
              }`}
          >
            {i < current ? <Check className="w-3 h-3" /> : i + 1}
          </div>
          <span
            className={`text-xs font-medium hidden sm:block whitespace-nowrap ${i === current ? "text-text-heading" : "text-text-muted"
              }`}
          >
            {label}
          </span>
        </div>
        {i < STEP_LABELS.length - 1 && (
          <div
            className={`flex-1 h-px mx-1 ${i < current ? "bg-secondary" : "bg-border"}`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ================= OTP INPUT =================
const OtpInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}> = ({ value, onChange, placeholder = "000000", maxLength = 6 }) => (
  <input
    type="text"
    maxLength={maxLength}
    value={value}
    onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
    placeholder={placeholder}
    autoFocus
    className="w-full px-4 py-3 border border-border rounded-lg text-center font-mono text-2xl tracking-[0.4em] text-text-heading focus:outline-none focus:border-border-focus bg-bg-base placeholder:text-text-muted"
  />
);

// ================= ACTION BUTTON =================
const ActionButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  variant?: "primary" | "secondary";
}> = ({
  onClick,
  disabled,
  loading,
  loadingText,
  children,
  fullWidth = true,
  variant = "primary",
}) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? "w-full" : ""
        } ${variant === "primary"
          ? "bg-brand text-on-brand hover:bg-brand-hover"
          : "border border-secondary text-secondary bg-surface hover:bg-secondary-light"
        }`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );

interface TwoFactorSetupProps {
  step: SetupStep;
  selectedMethod: TwoFactorMethod;
  qrCode: string | null;
  totpSecret: string | null;
  totpCode: string;
  methodValue: string;
  otpSent: boolean;
  otpCode: string;
  otpUserId: string;
  recoveryCodes: string[];
  setupLoading: boolean;
  sendOtpLoading: boolean;
  verifyLoading: boolean;
  recoveryLoading: boolean;
  onMethodSelect: (method: TwoFactorMethod) => void;
  onMethodValueChange: (value: string) => void;
  onTotpCodeChange: (code: string) => void;
  onOtpCodeChange: (code: string) => void;
  onSetupTOTP: () => void;
  onSaveMethod: () => void;
  onVerifyTOTP: () => void;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
  onGenerateRecoveryCodes: () => void;
  onStepComplete: () => void;
  methodLabel: Record<TwoFactorMethod, string>;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  step,
  selectedMethod,
  qrCode,
  totpSecret,
  totpCode,
  methodValue,
  otpSent,
  otpCode,
  otpUserId,
  recoveryCodes,
  setupLoading,
  sendOtpLoading,
  verifyLoading,
  recoveryLoading,
  onMethodSelect,
  onMethodValueChange,
  onTotpCodeChange,
  onOtpCodeChange,
  onSetupTOTP,
  onSaveMethod,
  onVerifyTOTP,
  onSendOtp,
  onVerifyOtp,
  onGenerateRecoveryCodes,
  onStepComplete,
  methodLabel,
}) => {
  return (
    <div className="border border-border rounded-xl p-5 space-y-5">
      <StepIndicator current={step} />

      {/* STEP 0 — Choose Method */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-text-heading">Choose your authentication method</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                { key: "totp" as const, icon: QrCode, label: "Authenticator App", desc: "Google Authenticator, Authy, etc." },
                { key: "sms" as const, icon: Smartphone, label: "SMS", desc: "Receive code via text message" },
                { key: "email" as const, icon: Mail, label: "Email", desc: "Receive code via email" },
              ]
            ).map(({ key, icon: Icon, label, desc }) => (
              <button
                key={key}
                onClick={() => onMethodSelect(key)}
                className={`flex flex-col items-start gap-2 p-4 rounded-lg border text-left transition-all ${selectedMethod === key
                  ? "border-secondary bg-brand-light"
                  : "border-border bg-bg-base hover:bg-bg-subtle"
                  }`}
              >
                <div className="inline-flex p-2 rounded-md bg-surface border border-border">
                  <Icon className="w-4 h-4 text-text-heading" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-heading">{label}</p>
                  <p className="text-xs text-text-primary mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* SMS / Email: enter contact value */}
          {(selectedMethod === "sms" || selectedMethod === "email") && (
            <div className="space-y-2 pt-1">
              <label className="text-xs font-medium text-text-secondary">
                {selectedMethod === "sms" ? "Enter your phone number" : "Enter your email address"}
              </label>
              <input
                type={selectedMethod === "email" ? "email" : "tel"}
                value={methodValue}
                onChange={(e) => onMethodValueChange(e.target.value)}
                placeholder={selectedMethod === "sms" ? "+971 50 000 0000" : "you@example.com"}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text-heading focus:outline-none focus:border-border-focus bg-bg-base placeholder:text-text-muted"
              />
            </div>
          )}

          <ActionButton
            onClick={selectedMethod === "totp" ? onSetupTOTP : onSaveMethod}
            loading={setupLoading}
            loadingText={selectedMethod === "totp" ? "Generating QR…" : "Sending OTP…"}
          >
            {selectedMethod === "totp" ? (
              <><QrCode className="w-4 h-4" /> Continue with Authenticator App</>
            ) : (
              <><Send className="w-4 h-4" /> Send Verification Code</>
            )}
          </ActionButton>
        </div>
      )}

      {/* STEP 1 — Verify */}
      {step === 1 && (
        <div className="space-y-4">
          {selectedMethod === "totp" && (
            <>
              <p className="text-sm font-semibold text-text-heading">Scan with your authenticator app</p>

              {qrCode ? (
                <div className="flex justify-center">
                  <div className="p-4 bg-surface border border-border rounded-xl inline-block shadow-card">
                    <img src={qrCode} alt="TOTP QR Code" className="w-44 h-44" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
              )}

              {totpSecret && (
                <div className="bg-bg-base rounded-lg p-3 border border-border">
                  <p className="text-xs text-text-secondary mb-1 font-medium">Can&apos;t scan? Enter this key manually:</p>
                  <p className="font-mono text-sm text-text-heading tracking-widest break-all select-all">
                    {totpSecret}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-text-heading">Enter the 6-digit code from your app</p>
                <OtpInput value={totpCode} onChange={onTotpCodeChange} />
              </div>

              <ActionButton
                onClick={onVerifyTOTP}
                loading={verifyLoading}
                loadingText="Verifying…"
                disabled={totpCode.length < 6}
              >
                <ShieldCheck className="w-4 h-4" />
                Verify & Enable 2FA
              </ActionButton>
            </>
          )}

          {(selectedMethod === "sms" || selectedMethod === "email") && (
            <>
              <div className="flex items-start gap-3 p-3 bg-brand-light rounded-lg border border-secondary-light">
                {selectedMethod === "sms" ? (
                  <Smartphone className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                ) : (
                  <Mail className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-text-heading">
                    Code sent to your {selectedMethod === "sms" ? "phone" : "email"}
                  </p>
                  <p className="text-xs text-text-primary mt-0.5">
                    {methodValue} · Expires in 5 minutes
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-text-heading">Enter the 6-digit code you received</p>
                <OtpInput value={otpCode} onChange={onOtpCodeChange} />
              </div>

              <button
                onClick={onSendOtp}
                disabled={sendOtpLoading}
                className="flex items-center gap-1.5 text-xs text-secondary hover:underline disabled:opacity-50"
              >
                {sendOtpLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                {sendOtpLoading ? "Resending…" : "Resend code"}
              </button>

              <ActionButton
                onClick={onVerifyOtp}
                loading={verifyLoading}
                loadingText="Verifying…"
                disabled={otpCode.length < 6}
              >
                <ShieldCheck className="w-4 h-4" />
                Verify & Enable 2FA
              </ActionButton>
            </>
          )}
        </div>
      )}

      {/* STEP 2 — Recovery Codes */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-text-heading flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-secondary" />
              Save your recovery codes
            </p>
            <p className="text-xs text-text-primary mt-1">
              2FA is now active. Save these codes — they are your backup if you lose access to your {methodLabel[selectedMethod]}.
            </p>
          </div>

          {recoveryLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
            </div>
          ) : (
            <RecoveryPanel codes={recoveryCodes} />
          )}

          <ActionButton onClick={onStepComplete} disabled={recoveryLoading}>
            <Check className="w-4 h-4" />
            I&apos;ve saved my recovery codes
          </ActionButton>
        </div>
      )}

      {/* STEP 3 — Done */}
      {step === 3 && (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="inline-flex p-4 rounded-full bg-status-success-bg border border-status-success-border">
              <ShieldCheck className="w-8 h-8 text-status-success" />
            </div>
          </div>
          <div>
            <p className="text-base font-semibold text-text-heading">2FA is now active</p>
            <p className="text-sm text-text-primary mt-1">
              Your account is protected with <span className="font-medium">{methodLabel[selectedMethod]}</span>.
            </p>
          </div>
          <ActionButton onClick={onStepComplete}>Done</ActionButton>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;