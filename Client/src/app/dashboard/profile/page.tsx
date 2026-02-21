"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Globe,
  Building2,
  FileText,
  Calendar,
  Crown,
  Shield,
  ShieldCheck,
  ShieldOff,
  ChevronRight,
  CheckCircle,
  UserRound,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import BusinessInfo from "@/components/business-info/BusinessInfo";
import { useAuth } from "@/context/AuthContext";
import SectionCard from "@/components/section-card/SectionCard";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { formatDate } from "@/utils/formatDate";

// ================= TYPES =================
interface UserData {
  user_id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  language?: string;
  plan?: string;
  created_at?: string;
}

interface PlanInfo {
  uuid: string;
  plan_id: string;
  end_date?: string;
  start_date?: string;
  status?: string;
}

interface SubscriptionPlan {
  uuid: string;
  name: string;
  price?: string | number; /* API returns price as string */
  description?: string;
}

interface TwoFactorStatus {
  is_enabled: boolean;
  method?: "totp" | "sms" | "email";
}

// ================= HELPERS =================
const formatRole = (role?: string): string => {
  if (!role) return "—";
  return role
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

const formatLanguage = (lang?: string): string => {
  if (!lang) return "—";
  const map: Record<string, string> = {
    en: "English", es: "Spanish",
    fr: "French",  de: "German", ar: "Arabic",
  };
  return map[lang.toLowerCase()] || lang;
};

// Handles price coming as string or number from the API
const formatPrice = (price?: string | number): string => {
  if (price == null || price === "") return "—";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "—";
  return num === 0 ? "Free" : `$${num.toFixed(2)}`;
};

// ================= INFO FIELD =================
const InfoField = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-text-secondary">{label}</label>
    <div className="flex items-center gap-3 p-3 bg-bg-base rounded-lg border border-border">
      <Icon className="w-4 h-4 text-secondary flex-shrink-0" />
      <span className="text-text-primary">{value || "—"}</span>
    </div>
  </div>
);

// ================= SECURITY ROW =================
const SecurityRow = ({
  icon: Icon,
  title,
  description,
  badge,
  onClick,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  badge?: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-bg-base rounded-xl hover:bg-bg-subtle transition-colors group border border-border"
  >
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-surface rounded-lg border border-border shrink-0">
        <Icon className="w-5 h-5 text-secondary" />
      </div>
      <div className="text-left">
        <p className="font-semibold text-text-heading">{title}</p>
        <p className="text-sm text-text-primary">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {badge}
      <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-text-heading transition-colors" />
    </div>
  </button>
);

// ================= COMPONENT =================
const ProfilePage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("personal");
  const [userData, setUserData] = useState<UserData>({});
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [userPlan, setUserPlan] = useState<SubscriptionPlan | null>(null);
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // ─────────────────────────────────────────
  // API: GET /subscription_plan/user_current/:userId
  // Returns: { subscription: PlanInfo }
  // ─────────────────────────────────────────
  const fetchUserSubscription = async (userId: string) => {
    try {
      const res = await axiosInstance.get(`/subscription_plan/user_current/${userId}`);
      const sub: PlanInfo | null = res.data.subscription ?? null;
      setPlanInfo(sub);
      if (sub?.plan_id) await fetchPlanDetails(sub.plan_id);
    } catch {
      toast.error("Failed to load subscription");
    }
  };

  // ─────────────────────────────────────────
  // API: GET /subscription_plan/all
  // Match plan uuid === planInfo.plan_id
  // ─────────────────────────────────────────
  const fetchPlanDetails = async (planId: string) => {
    try {
      const res = await axiosInstance.get(`/subscription_plan/all`);
      const plans: SubscriptionPlan[] = res.data.plans ?? [];
      setUserPlan(plans.find((p) => p.uuid === planId) ?? null);
    } catch {
      console.error("Failed to fetch plan details");
    }
  };

  // ─────────────────────────────────────────
  // API: GET /user-two-factor-settings/user/:userId
  // Returns: { is_enabled: boolean, method: string }
  // ─────────────────────────────────────────
  const fetchTwoFactorStatus = async (userId: string) => {
    try {
      const res = await axiosInstance.get(`/user-two-factor-settings/user/${userId}`);
      setTwoFactorStatus({
        is_enabled: res.data?.is_enabled ?? false,
        method: res.data?.method,
      });
    } catch {
      setTwoFactorStatus({ is_enabled: false });
    }
  };

  // Boot: load all data in parallel then clear loading
  useEffect(() => {
    if (!user?.user) return;

    const userId = (user.user as UserData).user_id;
    setUserData(user.user);

    const load = async () => {
      if (userId) {
        await Promise.all([
          fetchUserSubscription(userId),
          fetchTwoFactorStatus(userId),
        ]);
      }
      setPageLoading(false);
    };

    load();
  }, [user]);

  const getInitials = (): string => {
    if (!userData.full_name) return "?";
    return userData.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const methodLabel: Record<string, string> = {
    totp: "Authenticator App",
    sms: "SMS",
    email: "Email",
  };

  const navItems = [
    { id: "personal",  label: "Personal Info", icon: User },
    { id: "business",  label: "Business Info", icon: Building2 },
    { id: "account",   label: "Account",       icon: Crown },
    { id: "security",  label: "Security",      icon: Shield },
  ];

  // ================= RENDER =================
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-bg-base p-4 mb-8">
        <div className="w-full">

          <PageHeader
            title="Profile"
            icon={<UserRound size={24} />}
            description="View your identity and business information"
          />

          {/* ── Full page loading state — same pattern used across all components ── */}
          {pageLoading ? (
            <div className="p-20 flex items-center justify-center">
              <LoadingSpinner size="w-8 h-8" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-6">

              {/* ── Sidebar ── */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-surface rounded-xl shadow-card border border-border p-6">

                  {/* Avatar + name */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand to-secondary flex items-center justify-center text-on-brand text-2xl font-semibold">
                        <span>{getInitials()}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-text-heading">
                      {userData.full_name || "User"}
                    </h3>
                    <p className="text-sm text-text-primary mt-0.5">
                      {formatRole(userData.role)}
                    </p>

                    {/* Plan badge — uses brand-light + secondary so it reads
                        correctly in both light and dark mode */}
                    <div className="inline-flex items-center gap-1.5 bg-brand-light text-secondary border border-secondary-light px-3 py-1 rounded-full text-xs font-semibold mt-2">
                      <Crown className="w-3 h-3" />
                      {userPlan?.name ?? "Starter"}
                    </div>
                  </div>

                  {/* Nav */}
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                          activeSection === item.id
                            ? "bg-brand-light text-secondary border border-border"
                            : "text-text-primary hover:bg-bg-base"
                        }`}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* ── Main Content ── */}
              <div className="lg:col-span-3 space-y-6">

                {/* ════════════════════════
                    PERSONAL INFORMATION
                ════════════════════════ */}
                {activeSection === "personal" && (
                  <SectionCard title="Personal Information" icon={User}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <InfoField label="Full Name"           value={userData.full_name || ""}          icon={User} />
                      <InfoField label="Email Address"       value={userData.email || ""}              icon={Mail} />
                      <InfoField label="Phone Number"        value={userData.phone || ""}              icon={Phone} />
                      <InfoField label="Role"                value={formatRole(userData.role)}         icon={Briefcase} />
                      <InfoField label="Language Preference" value={formatLanguage(userData.language)} icon={Globe} />
                    </div>
                  </SectionCard>
                )}

                {/* ════════════════════════
                    BUSINESS INFORMATION
                ════════════════════════ */}
                {activeSection === "business" && <BusinessInfo />}

                {/* ════════════════════════
                    ACCOUNT SUMMARY
                ════════════════════════ */}
                {activeSection === "account" && (
                  <div className="space-y-6">
                    <SectionCard title="Account Summary" icon={Crown}>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">

                        {/* Current Plan */}
                        <div>
                          <label className="text-sm font-medium text-text-secondary mb-3 block">
                            Current Plan
                          </label>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-2 bg-accent text-on-accent px-4 py-2.5 rounded-lg font-semibold shadow-card">
                              <Crown className="w-4 h-4" />
                              {userPlan?.name ?? "—"}
                            </span>
                            {userPlan && (
                              <CheckCircle className="w-5 h-5 text-status-success" />
                            )}
                          </div>
                          <p className="text-sm text-text-primary mt-2">
                            Active until{" "}
                            {planInfo?.end_date ? formatDate(planInfo.end_date) : "—"}
                          </p>
                        </div>

                        {/* Member Since */}
                        <div>
                          <label className="text-sm font-medium text-text-secondary mb-2 block">
                            Member Since
                          </label>
                          <div className="flex items-center gap-2 text-text-primary p-3 bg-bg-base rounded-lg border border-border">
                            <Calendar className="w-4 h-4 text-secondary" />
                            <span>
                              {userData.created_at
                                ? new Date(userData.created_at).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Upgrade CTA */}
                      <button
                        onClick={() => router.push("/dashboard/settings")}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-brand to-secondary text-on-brand rounded-xl hover:shadow-raised transition-all"
                      >
                        <div className="text-left">
                          <p className="font-semibold">Upgrade Your Plan</p>
                          <p className="text-sm opacity-70 mt-0.5">
                            Get access to premium features
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </SectionCard>

                    {/* Billing Information */}
                    <SectionCard title="Billing Information" icon={FileText}>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-bg-base rounded-lg border border-border">
                          <div>
                            <p className="font-medium text-text-heading">Next Billing</p>
                            <p className="text-sm text-text-primary">
                              {planInfo?.end_date ? formatDate(planInfo.end_date) : "—"}
                            </p>
                          </div>
                          {/* formatPrice handles string price from API */}
                          <span className="font-semibold text-text-heading">
                            {formatPrice(userPlan?.price)}
                          </span>
                        </div>

                        <button
                          onClick={() => router.push("/dashboard/settings")}
                          className="w-full p-4 border-2 border-dashed border-border rounded-xl text-center hover:border-secondary hover:bg-bg-base transition-colors"
                        >
                          <p className="font-medium text-text-heading">View Billing History</p>
                          <p className="text-sm text-text-primary mt-1">
                            Download invoices and receipts
                          </p>
                        </button>
                      </div>
                    </SectionCard>
                  </div>
                )}

                {/* ════════════════════════
                    SECURITY
                ════════════════════════ */}
                {activeSection === "security" && (
                  <SectionCard title="Security Settings" icon={Shield}>
                    <div className="space-y-3">

                      {/* Change Password */}
                      <SecurityRow
                        icon={Shield}
                        title="Change Password"
                        description="Update your account password regularly"
                        onClick={() => router.push("/dashboard/settings")}
                      />

                      {/* Two-Factor Authentication — dynamic from API */}
                      <SecurityRow
                        icon={twoFactorStatus?.is_enabled ? ShieldCheck : ShieldOff}
                        title="Two-Factor Authentication"
                        description={
                          twoFactorStatus?.is_enabled
                            ? `Enabled via ${methodLabel[twoFactorStatus.method ?? "totp"] ?? "Authenticator App"}`
                            : "Add an extra layer of security to your account"
                        }
                        badge={
                          twoFactorStatus?.is_enabled ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success-bg text-status-success-text border border-status-success-border">
                              <ShieldCheck className="w-3 h-3" />
                              Enabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-status-warning-bg text-status-warning-text border border-status-warning-border">
                              <ShieldOff className="w-3 h-3" />
                              Not Enabled
                            </span>
                          )
                        }
                        onClick={() => router.push("/dashboard/settings")}
                      />

                      {/* Login Activity */}
                      <SecurityRow
                        icon={User}
                        title="Login Activity"
                        description="Review recent account activity and devices"
                        onClick={() => router.push("/dashboard/settings")}
                      />

                    </div>
                  </SectionCard>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;