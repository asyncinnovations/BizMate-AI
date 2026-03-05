"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import {
  ShieldCheck,
  FileText,
  MessageSquare,
  Receipt,
  CheckCircle,
  Plus,
  Shield,
  KeyRound,
  Loader2,
  ArrowLeft,
  Smartphone,
  Mail,
  QrCode,
  RefreshCw,
} from "lucide-react";
import TypeWriter from "@/components/type-writer/TypeWriter";
import { useAuth } from "@/context/AuthContext";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { buildSessionPayload } from "@/utils/sessionData";

// ================= TYPES =================
interface FormError {
  email: string;
  password: string;
}

interface FormData {
  email: string;
  password: string;
}

interface PlatformFeature {
  icon: React.ReactNode;
  text: string;
}

interface AuthResponse {
  token: string;
  user: Record<string, unknown>;
}

interface TwoFactorSettingsData {
  is_enabled: boolean;
  method: "totp" | "sms" | "email";
}

type LoginStep = "credentials" | "2fa_challenge" | "recovery";

// ================= STATIC DATA =================
const platformTexts: string[] = [
  "AI-Powered Business Assistant for SMEs",
  "Automate Compliance, Invoices & VAT",
  "Smart Reminders & WhatsApp Auto-Replies",
  "UAE's Smart Business Companion",
  "From Compliance to Conversations, AI-Driven",
];

const features: PlatformFeature[] = [
  { icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />, text: "AI Compliance Assistant - UAE Regulations" },
  { icon: <Receipt className="w-4 h-4 text-cyan-400" />, text: "Smart Invoicing with VAT Automation" },
  { icon: <MessageSquare className="w-4 h-4 text-cyan-400" />, text: "WhatsApp & Instagram Auto-Replies" },
  { icon: <FileText className="w-4 h-4 text-cyan-400" />, text: "Document Generation & Reminder System" },
];

const methodLabel: Record<string, string> = {
  totp: "Authenticator App",
  sms: "SMS",
  email: "Email",
};

// ================= SHARED SUB-COMPONENTS =================

const MethodIcon = ({ method }: { method: "totp" | "sms" | "email" }) => {
  if (method === "totp") return <QrCode className="w-4 h-4 text-secondary" />;
  if (method === "sms") return <Smartphone className="w-4 h-4 text-secondary" />;
  return <Mail className="w-4 h-4 text-secondary" />;
};

const OtpInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <input
    type="text"
    inputMode="numeric"
    maxLength={6}
    value={value}
    onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
    placeholder="000000"
    autoFocus
    className="w-full px-4 py-3 border border-border rounded-lg text-center font-mono text-2xl tracking-[0.5em] text-text-heading focus:outline-none focus:border-border-focus bg-bg-base placeholder:text-text-muted"
  />
);

const StepButton = ({
  onClick,
  disabled,
  loading,
  loadingText,
  icon,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="w-full flex items-center justify-center gap-2 bg-brand text-on-brand px-4 py-3 rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
    {loading ? loadingText : children}
  </button>
);

const BackButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-sm text-text-primary hover:text-text-heading mb-6 transition-colors"
  >
    <ArrowLeft className="w-4 h-4" />
    {label}
  </button>
);

const StepHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <div className="text-center mb-6">
    <div className="inline-flex p-3 rounded-full bg-brand-light mb-3">
      {icon}
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-text-heading">{title}</h2>
    <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
  </div>
);

// ================= MAIN COMPONENT =================
const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const API = process.env.NEXT_PUBLIC_API_URL;

  // ── Credentials ──
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormError | null>(null);
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });

  // ── 2FA flow ──
  const [step, setStep] = useState<LoginStep>("credentials");
  const [twoFactorSettings, setTwoFactorSettings] = useState<TwoFactorSettingsData | null>(null);

  // Pending auth held until 2FA passes
  const [pendingUserId, setPendingUserId] = useState("");
  const [pendingToken, setPendingToken] = useState("");
  const [pendingUser, setPendingUser] = useState<Record<string, unknown> | null>(null);

  // ── 2FA inputs ──
  const [tfCode, setTfCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [tfLoading, setTfLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);

  // ================= HELPERS =================
  const validateForm = (): boolean => {
    const newErrors: FormError = { email: "", password: "" };
    if (!formData.email?.trim()) newErrors.email = "Email is required!";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid!";
    if (!formData.password?.trim()) newErrors.password = "Password is required!";
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    if (errors?.[name as keyof FormError]) {
      setErrors((prev) => (prev ? { ...prev, [name]: "" } : null));
    }
  };

  const resetTwoFactor = () => {
    setStep("credentials");
    setTfCode("");
    setRecoveryCode("");
    setPendingUserId("");
    setPendingToken("");
    setPendingUser(null);
    setTwoFactorSettings(null);
    setOtpSent(false);
  };

  // ================= SESSION =================
  const createSession = async (userId: string) => {
    try {
      const payload = await buildSessionPayload(userId);
      await axios.post(`${API}/user-sessions/create`, payload);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  // ================= COMPLETE LOGIN =================
  const completeLogin = (token: string, user: Record<string, unknown>, userId: string) => {
    login(token, user);
    createSession(userId); // fire and forget
    toast.success("Login successful! Redirecting to your dashboard…");
    router.push("/dashboard");
  };

  // ================= STEP 1 — CREDENTIALS =================
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await axios.post<AuthResponse>(`${API}/auth/login`, formData);

      if (response.status === 200) {
        const userId =
          (response.data.user as { user_id?: string })?.user_id ||
          (response.data.user as { uuid?: string })?.uuid ||
          "";

        // ─────────────────────────────────────────
        // API: GET /user-two-factor-settings/user/:userId
        // Returns: { is_enabled, method }
        // ─────────────────────────────────────────
        const tfRes = await axios.get(`${API}/user-two-factor-settings/user/${userId}`);
        const tfData: TwoFactorSettingsData = tfRes.data;

        if (tfData?.is_enabled) {
          // Hold token — do NOT call login() yet
          setPendingUserId(userId);
          setPendingToken(response.data.token);
          setPendingUser(response.data.user);
          setTwoFactorSettings(tfData);
          setStep("2fa_challenge");

          // Auto-send OTP for SMS/Email — pass userId directly (state not flushed yet)
          if (tfData.method === "sms" || tfData.method === "email") {
            await sendOtp(userId);
          }
        } else {
          completeLogin(response.data.token, response.data.user, userId);
        }
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string; error?: string }>;
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed! Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // API: POST /two-factor-otps/generate/:user_id
  // Sends OTP to user's phone or email
  // ─────────────────────────────────────────
  const sendOtp = async (userIdOverride?: string) => {
    const id = userIdOverride || pendingUserId;
    setOtpSending(true);
    try {
      await axios.post(`${API}/two-factor-otps/generate/${id}`);
      setOtpSent(true);
      toast.success(`OTP sent to your ${twoFactorSettings?.method === "sms" ? "phone" : "email"}`);
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  // ─────────────────────────────────────────
  // API: POST /user-two-factor-settings/verify_user_totp/:userId
  // Body: { code }
  // Returns: { is_enabled: boolean } — true means verified
  // ─────────────────────────────────────────
  const handleVerifyTOTP = async () => {
    if (tfCode.length < 6) { toast.error("Please enter the 6-digit code"); return; }
    setTfLoading(true);
    try {
      const res = await axios.post(
        `${API}/user-two-factor-settings/verify_user_totp/${pendingUserId}`,
        { code: tfCode }
      );
      if (res.data?.is_enabled === true) {
        completeLogin(pendingToken, pendingUser!, pendingUserId);
      } else {
        toast.error("Invalid code. Please try again.");
        setTfCode("");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Verification failed.");
      setTfCode("");
    } finally {
      setTfLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // API: POST /two-factor-otps/verify/:user_id
  // Body: { otpCode }
  // Returns: { success: boolean }
  // ─────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!tfCode.trim()) { toast.error("Please enter the OTP"); return; }
    setTfLoading(true);
    try {
      const res = await axios.post(
        `${API}/two-factor-otps/verify/${pendingUserId}`,
        { otpCode: tfCode }
      );
      if (res.data?.success === true) {
        completeLogin(pendingToken, pendingUser!, pendingUserId);
      } else {
        toast.error("Invalid OTP. Please try again.");
        setTfCode("");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "OTP verification failed.");
      setTfCode("");
    } finally {
      setTfLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // API: POST /two-factor-recovery-codes/verify/:user_id
  // Body: { code }
  // Returns: { success: boolean }
  // ─────────────────────────────────────────
  const handleVerifyRecovery = async () => {
    if (!recoveryCode.trim()) { toast.error("Please enter your recovery code"); return; }
    setTfLoading(true);
    try {
      const res = await axios.post(
        `${API}/two-factor-recovery-codes/verify/${pendingUserId}`,
        { code: recoveryCode }
      );
      if (res.data?.success === true) {
        completeLogin(pendingToken, pendingUser!, pendingUserId);
      } else {
        toast.error("Invalid recovery code. Please try again.");
        setRecoveryCode("");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Recovery verification failed.");
      setRecoveryCode("");
    } finally {
      setTfLoading(false);
    }
  };

  // ================= RENDER =================
  return (
    <div
      style={{ backgroundImage: "url('/login_background.jpg')" }}
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center w-full bg-bg-base"
    >
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row bg-surface border border-border rounded-xl shadow-modal overflow-hidden">

          {/* ═══════════════════════════════════
              LEFT — Branding panel
          ═══════════════════════════════════ */}
          <div className="lg:w-2/5 p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-brand via-secondary to-[#162038]">
            <div className="h-full flex flex-col justify-center">

              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-card shrink-0">
                  <span className="text-base sm:text-xl font-bold text-white">AI</span>
                </div>
                <span className="text-white text-sm sm:text-base font-semibold">
                  BusinessAssistant
                </span>
              </div>

              <div className="mb-4">
                <TypeWriter texts={platformTexts} />
                <p className="text-blue-200/80 text-xs sm:text-sm leading-relaxed mt-2">
                  Your intelligent partner for UAE business compliance, invoicing,
                  and customer communication. Powered by AI to save you time and money.
                </p>
              </div>

              {/* Hidden on mobile to keep the branding strip compact */}
              <div className="hidden sm:flex flex-col gap-2">
                {features.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5">
                    {item.icon}
                    <span className="text-blue-100 text-xs sm:text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/20">
                <p className="text-blue-200/60 text-xs">
                  Trusted by SMEs and startups across UAE • Arabic & English Support
                  • Free Zone Compliance Ready
                </p>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════
              RIGHT — Dynamic step content
          ═══════════════════════════════════ */}
          <div className="lg:w-3/5 p-5 sm:p-8 lg:p-10 flex items-center min-h-[440px]">
            <div className="w-full mx-auto">

              {/* ─────────────────────────
                  STEP 1 — CREDENTIALS
              ───────────────────────── */}
              {step === "credentials" && (
                <>
                  <div className="text-center mb-7">
                    <h2 className="text-xl sm:text-2xl font-bold text-text-heading">
                      Access Your Dashboard
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">
                      Sign in to your AI Business Assistant
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-4">
                      <InputField
                        label="Email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        value={formData.email}
                        placeholder="business@company.ae"
                        error={errors?.email}
                      />
                      <InputField
                        label="Password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        value={formData.password}
                        placeholder="Enter your password"
                        error={errors?.password}
                      />
                    </div>

                    <div className="text-right">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-link hover:text-link-hover font-medium transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        startIcon={<CheckCircle size={18} />}
                        disabled={isLoading}
                        loading={isLoading}
                        type="submit"
                      >
                        Secure Login
                      </Button>
                      <Button
                        startIcon={<Plus size={18} />}
                        variant="secondary"
                        type="button"
                        onClick={() => router.push("/register")}
                      >
                        Create Business Account
                      </Button>
                    </div>

                    <div className="text-center pt-4 border-t border-border">
                      <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-text-secondary flex-wrap">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse" />
                          <span>AI Services: Operational</span>
                        </div>
                        <span className="text-text-muted">•</span>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                          <span>UAE Compliance: Updated</span>
                        </div>
                      </div>
                      <p className="text-text-muted text-xs mt-1">
                        Supporting English & Arabic • VAT 2024 Ready
                      </p>
                    </div>
                  </form>
                </>
              )}

              {/* ─────────────────────────
                  STEP 2 — 2FA CHALLENGE
              ───────────────────────── */}
              {step === "2fa_challenge" && (
                <>
                  <BackButton onClick={resetTwoFactor} label="Back to login" />

                  <StepHeader
                    icon={<Shield className="w-6 h-6 text-secondary" />}
                    title="Two-Factor Verification"
                    subtitle="Verify your identity to continue"
                  />

                  <div className="flex justify-center mb-5">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-base rounded-full border border-border">
                      <MethodIcon method={twoFactorSettings!.method} />
                      <span className="text-sm text-text-heading font-medium">
                        {methodLabel[twoFactorSettings!.method]}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">

                    {/* TOTP */}
                    {twoFactorSettings?.method === "totp" && (
                      <>
                        <label className="text-sm font-medium text-text-heading block">
                          Enter the 6-digit code from your authenticator app
                        </label>
                        <OtpInput value={tfCode} onChange={setTfCode} />
                        <StepButton
                          onClick={handleVerifyTOTP}
                          disabled={tfCode.length < 6}
                          loading={tfLoading}
                          loadingText="Verifying…"
                          icon={<ShieldCheck className="w-4 h-4" />}
                        >
                          Verify & Continue
                        </StepButton>
                      </>
                    )}

                    {/* SMS / Email */}
                    {(twoFactorSettings?.method === "sms" ||
                      twoFactorSettings?.method === "email") && (
                        <>
                          {!otpSent ? (
                            <div className="flex items-center gap-2 p-4 bg-bg-base rounded-lg border border-border text-sm text-text-primary">
                              <Loader2 className="w-4 h-4 animate-spin text-secondary shrink-0" />
                              Sending OTP to your{" "}
                              {twoFactorSettings.method === "sms" ? "phone" : "email"}…
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start gap-3 p-3 bg-brand-light rounded-lg border border-secondary-light">
                                {twoFactorSettings.method === "sms"
                                  ? <Smartphone className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                                  : <Mail className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                                }
                                <div>
                                  <p className="text-sm font-medium text-text-heading">
                                    Code sent to your{" "}
                                    {twoFactorSettings.method === "sms" ? "phone" : "email"}
                                  </p>
                                  <p className="text-xs text-text-primary mt-0.5">
                                    Expires in 5 minutes
                                  </p>
                                </div>
                              </div>

                              <label className="text-sm font-medium text-text-heading block">
                                Enter the 6-digit code
                              </label>
                              <OtpInput value={tfCode} onChange={setTfCode} />

                              <button
                                onClick={() => { setTfCode(""); sendOtp(); }}
                                disabled={otpSending}
                                className="flex items-center gap-1.5 text-xs text-secondary hover:underline disabled:opacity-50 transition-colors"
                              >
                                {otpSending
                                  ? <Loader2 className="w-3 h-3 animate-spin" />
                                  : <RefreshCw className="w-3 h-3" />
                                }
                                {otpSending ? "Resending…" : "Resend code"}
                              </button>

                              <StepButton
                                onClick={handleVerifyOtp}
                                disabled={tfCode.length < 6}
                                loading={tfLoading}
                                loadingText="Verifying…"
                                icon={<ShieldCheck className="w-4 h-4" />}
                              >
                                Verify & Continue
                              </StepButton>
                            </>
                          )}
                        </>
                      )}

                    <div className="text-center pt-2 border-t border-border">
                      <button
                        onClick={() => setStep("recovery")}
                        className="flex items-center justify-center gap-1.5 text-sm text-text-secondary hover:text-text-heading mx-auto transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        Use a recovery code instead
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ─────────────────────────
                  STEP 3 — RECOVERY CODE
              ───────────────────────── */}
              {step === "recovery" && (
                <>
                  <BackButton
                    onClick={() => { setStep("2fa_challenge"); setRecoveryCode(""); }}
                    label="Back to verification"
                  />

                  <StepHeader
                    icon={<KeyRound className="w-6 h-6 text-secondary" />}
                    title="Recovery Code"
                    subtitle="Enter one of your saved recovery codes"
                  />

                  <div className="space-y-4">
                    <div className="bg-status-warning-bg border border-status-warning-border rounded-lg p-3">
                      <p className="text-xs text-status-warning-text">
                        ⚠ Each recovery code can only be used once. Generate new
                        ones after logging in.
                      </p>
                    </div>

                    <input
                      type="text"
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value.trim())}
                      placeholder="xxxxxxxx"
                      autoFocus
                      className="w-full px-4 py-3 border border-border rounded-lg text-center font-mono text-lg tracking-widest text-text-heading focus:outline-none focus:border-border-focus bg-bg-base placeholder:text-text-muted"
                    />

                    <StepButton
                      onClick={handleVerifyRecovery}
                      disabled={!recoveryCode.trim()}
                      loading={tfLoading}
                      loadingText="Verifying…"
                      icon={<KeyRound className="w-4 h-4" />}
                    >
                      Verify Recovery Code
                    </StepButton>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;