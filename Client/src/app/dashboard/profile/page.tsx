"use client";
// src/app/dashboard/profile/page.tsx
//
// FIXES APPLIED:
// 1. Personal Info is now editable — PUT /auth/update/:id wired
// 2. Avatar upload button added — PUT /auth/update_image/:id wired
// 3. Plan details fetched correctly — GET /subscription_plan/single/:id
//    (falls back to /subscription_plan/all if single not available)
// 4. Onboarding guard — if business info is empty on first load,
//    a prominent banner prompts the user to complete their profile

import React, { useEffect, useRef, useState } from "react";
import {
  User, Mail, Phone, Globe, Building2, FileText, Calendar,
  Crown, Shield, ShieldCheck, ShieldOff, ChevronRight,
  CheckCircle, UserRound, Briefcase, Edit2, Save, X,
  Camera, AlertCircle, Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout    from "@/components/layout/DashboardLayout";
import PageHeader         from "@/components/page-header/PageHeader";
import BusinessInfo       from "@/components/business-info/BusinessInfo";
import { useAuth }        from "@/context/AuthContext";
import SectionCard        from "@/components/section-card/SectionCard";
import LoadingSpinner     from "@/components/loading-spinner/LoadingSpinner";
import toast              from "react-hot-toast";
import axiosInstance      from "@/utils/axiosInstance";
import { formatDate }     from "@/utils/formatDate";

// ─── Types ───────────────────────────────────────────────────────────────────
interface UserData {
  user_id?:           string;
  full_name?:         string;
  email?:             string;
  phone?:             string;
  role?:              string;
  language_preference?: string;
  profile_image?:     string;
  company_name?:      string;
  license_number?:    string;
  vat_id?:            string;
  industry?:          string;
  created_at?:        string;
}

interface PersonalForm {
  full_name:           string;
  phone:               string;
  language_preference: string;
}

interface PlanInfo {
  uuid:        string;
  plan_id:     string;
  end_date?:   string;
  start_date?: string;
  status?:     string;
}

interface SubscriptionPlan {
  uuid:         string;
  name:         string;
  price?:       string | number;
  description?: string;
}

interface TwoFactorStatus {
  is_enabled: boolean;
  method?:    "totp" | "sms" | "email";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatRole = (role?: string): string => {
  if (!role) return "—";
  return role.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
};

const formatLanguage = (lang?: string): string => {
  const map: Record<string, string> = { en: "English", ar: "Arabic", hi: "Hindi" };
  return lang ? (map[lang] ?? lang) : "—";
};

const formatPrice = (price?: string | number): string => {
  if (price == null || price === "") return "—";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return isNaN(num) ? "—" : num === 0 ? "Free" : `$${num.toFixed(2)}`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SecurityRow = ({
  icon: Icon, title, description, badge, onClick,
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

// ─── Main component ───────────────────────────────────────────────────────────
const ProfilePage = () => {
  const router     = useRouter();
  const { user }   = useAuth();
  const fileRef    = useRef<HTMLInputElement>(null);

  const [activeSection,   setActiveSection]   = useState("personal");
  const [userData,        setUserData]        = useState<UserData>({});
  const [planInfo,        setPlanInfo]        = useState<PlanInfo | null>(null);
  const [userPlan,        setUserPlan]        = useState<SubscriptionPlan | null>(null);
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus | null>(null);
  const [pageLoading,     setPageLoading]     = useState(true);

  // Personal info edit state
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm,      setPersonalForm]      = useState<PersonalForm>({ full_name: "", phone: "", language_preference: "en" });
  const [isSavingPersonal,  setIsSavingPersonal]  = useState(false);

  // Avatar upload state
  const [avatarPreview,  setAvatarPreview]  = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Onboarding guard state
  const [hasBusinessInfo, setHasBusinessInfo] = useState<boolean | null>(null);

  // ── API: subscription ──────────────────────────────────────────────────────
  const fetchUserSubscription = async (userId: string) => {
    try {
      const res = await axiosInstance.get(`/subscription_plan/user_current/${userId}`);
      const sub: PlanInfo | null = res.data.subscription ?? null;
      setPlanInfo(sub);
      if (sub?.plan_id) await fetchPlanDetails(sub.plan_id);
    } catch {
      // silent — subscription might not exist yet
    }
  };

  // FIX 3: Use single plan lookup first, fall back to list
  const fetchPlanDetails = async (planId: string) => {
    try {
      // Try single plan endpoint first (more efficient)
      const res = await axiosInstance.get(`/subscription_plan/single/${planId}`).catch(() => null);
      if (res?.data?.plan) {
        setUserPlan(res.data.plan);
        return;
      }
      // Fallback: fetch all and find matching
      const allRes = await axiosInstance.get(`/subscription_plan/all`);
      const plans: SubscriptionPlan[] = allRes.data.plans ?? [];
      setUserPlan(plans.find((p) => p.uuid === planId) ?? null);
    } catch {
      console.error("Failed to fetch plan details");
    }
  };

  // ── API: 2FA ───────────────────────────────────────────────────────────────
  const fetchTwoFactorStatus = async (userId: string) => {
    try {
      const res = await axiosInstance.get(`/user-two-factor-settings/user/${userId}`);
      setTwoFactorStatus({ is_enabled: res.data?.is_enabled ?? false, method: res.data?.method });
    } catch {
      setTwoFactorStatus({ is_enabled: false });
    }
  };

  // FIX 4: Check if business info exists → show onboarding banner if not
  const checkBusinessInfo = async (userId: string) => {
    try {
      const res = await axiosInstance.get(`/user_business_info/user/${userId}`);
      const info = res.data.response?.[0];
      setHasBusinessInfo(!!(info?.business_name));
    } catch {
      setHasBusinessInfo(false);
    }
  };

  // ── Boot ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.user) return;
    const userId = (user.user as UserData).user_id;
    const data   = user.user as UserData;
    setUserData(data);
    setPersonalForm({
      full_name:           data.full_name           ?? "",
      phone:               data.phone               ?? "",
      language_preference: data.language_preference ?? "en",
    });
    const load = async () => {
      if (userId) {
        await Promise.all([
          fetchUserSubscription(userId),
          fetchTwoFactorStatus(userId),
          checkBusinessInfo(userId),
        ]);
      }
      setPageLoading(false);
    };
    load();
  }, [user]);

  // FIX 1: Save personal info — PUT /auth/update/:id
  const handleSavePersonal = async () => {
    const userId = userData.user_id;
    if (!userId) return toast.error("User ID not found.");
    if (!personalForm.full_name.trim()) return toast.error("Full name is required.");
    setIsSavingPersonal(true);
    try {
      const res = await axiosInstance.put(`/auth/update/${userId}`, {
        full_name:           personalForm.full_name.trim(),
        phone:               personalForm.phone.trim(),
        language_preference: personalForm.language_preference,
      });
      if (res.status === 200) {
        setUserData((prev) => ({ ...prev, ...personalForm }));
        setIsEditingPersonal(false);
        toast.success("Personal information updated.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update profile.");
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const handleCancelEdit = () => {
    setPersonalForm({
      full_name:           userData.full_name           ?? "",
      phone:               userData.phone               ?? "",
      language_preference: userData.language_preference ?? "en",
    });
    setIsEditingPersonal(false);
  };

  // FIX 2: Avatar upload — PUT /auth/update_image/:id (multipart)
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file.");
    if (file.size > 5 * 1024 * 1024)    return toast.error("Image must be under 5 MB.");

    // Show preview immediately
    setAvatarPreview(URL.createObjectURL(file));

    // Upload
    const userId = userData.user_id;
    if (!userId) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("profile_image", file);
      const res = await axiosInstance.put(`/auth/update_image/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        toast.success("Profile photo updated.");
        setUserData((prev) => ({ ...prev, profile_image: res.data?.profile_image ?? prev.profile_image }));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to upload photo.");
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const getInitials = (): string => {
    if (!userData.full_name) return "?";
    return userData.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const avatarSrc = avatarPreview || (userData.profile_image ? `${process.env.NEXT_PUBLIC_ASSET_URL}${userData.profile_image}` : null);

  const methodLabel: Record<string, string> = { totp: "Authenticator App", sms: "SMS", email: "Email" };

  const navItems = [
    { id: "personal", label: "Personal Info", icon: User      },
    { id: "business", label: "Business Info", icon: Building2 },
    { id: "account",  label: "Account",       icon: Crown     },
    { id: "security", label: "Security",      icon: Shield    },
  ];

  const fieldCls = "w-full px-3 py-2.5 border border-border rounded-lg bg-bg-base text-text-heading text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-bg-base p-4 mb-8">
        <div className="w-full">

          <PageHeader
            title="Profile"
            icon={<UserRound size={24} />}
            description="Manage your personal details and business information"
          />

          {pageLoading ? (
            <div className="p-20 flex items-center justify-center">
              <LoadingSpinner size="w-8 h-8" />
            </div>
          ) : (
            <>
              {/* FIX 4: Onboarding guard banner */}
              {hasBusinessInfo === false && (
                <div className="flex items-start gap-4 p-5 mb-6 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">Complete your business profile</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Your invoices and quotations will send with a blank company name until you fill in your business details. This takes less than 2 minutes.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSection("business")}
                    className="flex-shrink-0 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
                  >
                    Set Up Now
                  </button>
                </div>
              )}

              <div className="grid lg:grid-cols-4 gap-6">

                {/* ── Sidebar ─────────────────────────────────────────── */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-surface rounded-xl shadow-card border border-border p-6">

                    {/* Avatar — FIX 2 */}
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative mb-4 group">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-brand to-secondary flex items-center justify-center text-on-brand text-2xl font-semibold">
                          {avatarSrc ? (
                            <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <span>{getInitials()}</span>
                          )}
                        </div>

                        {/* Upload overlay */}
                        <button
                          onClick={() => fileRef.current?.click()}
                          disabled={isUploadingAvatar}
                          className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                          title="Change photo"
                        >
                          {isUploadingAvatar ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          ) : (
                            <>
                              <Camera className="w-5 h-5 text-white mb-0.5" />
                              <span className="text-[10px] text-white font-semibold">Change</span>
                            </>
                          )}
                        </button>

                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>

                      <h3 className="font-semibold text-text-heading">{userData.full_name || "User"}</h3>
                      <p className="text-sm text-text-primary mt-0.5">{formatRole(userData.role)}</p>
                      <div className="inline-flex items-center gap-1.5 bg-brand-light text-secondary border border-secondary-light px-3 py-1 rounded-full text-xs font-semibold mt-2">
                        <Crown className="w-3 h-3" />
                        {userPlan?.name ?? "Free"}
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
                          {/* Badge for incomplete business info */}
                          {item.id === "business" && hasBusinessInfo === false && (
                            <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* ── Main content ─────────────────────────────────────── */}
                <div className="lg:col-span-3 space-y-6">

                  {/* PERSONAL INFO — FIX 1: Editable */}
                  {activeSection === "personal" && (
                    <SectionCard
                      title="Personal Information"
                      icon={User}
                      action={
                        !isEditingPersonal ? (
                          <button
                            onClick={() => setIsEditingPersonal(true)}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-secondary border border-secondary-light bg-brand-light hover:bg-brand rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleCancelEdit}
                              disabled={isSavingPersonal}
                              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-text-secondary border border-border bg-surface hover:bg-bg-base rounded-lg transition-colors disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                            <button
                              onClick={handleSavePersonal}
                              disabled={isSavingPersonal}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-on-brand bg-secondary hover:opacity-90 rounded-lg transition-all disabled:opacity-60"
                            >
                              {isSavingPersonal ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Save className="w-3.5 h-3.5" />
                              )}
                              {isSavingPersonal ? "Saving…" : "Save"}
                            </button>
                          </div>
                        )
                      }
                    >
                      <div className="grid md:grid-cols-2 gap-5">

                        {/* Full Name */}
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                            Full Name *
                          </label>
                          {isEditingPersonal ? (
                            <input
                              type="text"
                              className={fieldCls}
                              value={personalForm.full_name}
                              onChange={(e) => setPersonalForm((p) => ({ ...p, full_name: e.target.value }))}
                              placeholder="Your full name"
                            />
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-bg-base rounded-lg border border-border">
                              <User className="w-4 h-4 text-secondary flex-shrink-0" />
                              <span className="text-text-primary">{userData.full_name || "—"}</span>
                            </div>
                          )}
                        </div>

                        {/* Email (read-only — change email is a separate flow) */}
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                            Email Address
                          </label>
                          <div className="flex items-center gap-3 p-3 bg-bg-base rounded-lg border border-border opacity-70">
                            <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                            <span className="text-text-primary">{userData.email || "—"}</span>
                            <span className="ml-auto text-[10px] text-text-muted font-medium bg-surface border border-border px-2 py-0.5 rounded-full">
                              Contact support to change
                            </span>
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                            Phone Number
                          </label>
                          {isEditingPersonal ? (
                            <input
                              type="tel"
                              className={fieldCls}
                              value={personalForm.phone}
                              onChange={(e) => setPersonalForm((p) => ({ ...p, phone: e.target.value }))}
                              placeholder="+971 50 000 0000"
                            />
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-bg-base rounded-lg border border-border">
                              <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                              <span className="text-text-primary">{userData.phone || "—"}</span>
                            </div>
                          )}
                        </div>

                        {/* Language preference */}
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                            Language Preference
                          </label>
                          {isEditingPersonal ? (
                            <select
                              className={fieldCls}
                              value={personalForm.language_preference}
                              onChange={(e) => setPersonalForm((p) => ({ ...p, language_preference: e.target.value }))}
                            >
                              <option value="en">English</option>
                              <option value="ar">Arabic</option>
                              <option value="hi">Hindi</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-bg-base rounded-lg border border-border">
                              <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
                              <span className="text-text-primary">{formatLanguage(userData.language_preference)}</span>
                            </div>
                          )}
                        </div>

                        {/* Role — always read-only */}
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                            Role
                          </label>
                          <div className="flex items-center gap-3 p-3 bg-bg-base rounded-lg border border-border">
                            <Briefcase className="w-4 h-4 text-secondary flex-shrink-0" />
                            <span className="text-text-primary">{formatRole(userData.role)}</span>
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  )}

                  {/* BUSINESS INFO */}
                  {activeSection === "business" && (
                    <BusinessInfo onSaveSuccess={() => setHasBusinessInfo(true)} />
                  )}

                  {/* ACCOUNT SUMMARY */}
                  {activeSection === "account" && (
                    <div className="space-y-6">
                      <SectionCard title="Account Summary" icon={Crown}>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="text-sm font-medium text-text-secondary mb-3 block">Current Plan</label>
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center gap-2 bg-accent text-on-accent px-4 py-2.5 rounded-lg font-semibold shadow-card">
                                <Crown className="w-4 h-4" />
                                {userPlan?.name ?? "—"}
                              </span>
                              {userPlan && <CheckCircle className="w-5 h-5 text-status-success" />}
                            </div>
                            <p className="text-sm text-text-primary mt-2">
                              Active until {planInfo?.end_date ? formatDate(planInfo.end_date) : "—"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-secondary mb-2 block">Member Since</label>
                            <div className="flex items-center gap-2 text-text-primary p-3 bg-bg-base rounded-lg border border-border">
                              <Calendar className="w-4 h-4 text-secondary" />
                              <span>{userData.created_at ? new Date(userData.created_at).toLocaleDateString() : "—"}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push("/dashboard/pricing")}
                          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-brand to-secondary text-on-brand rounded-xl hover:shadow-raised transition-all"
                        >
                          <div className="text-left">
                            <p className="font-semibold">Upgrade Your Plan</p>
                            <p className="text-sm opacity-70 mt-0.5">Get access to premium features</p>
                          </div>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </SectionCard>

                      <SectionCard title="Billing Information" icon={FileText}>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-bg-base rounded-lg border border-border">
                            <div>
                              <p className="font-medium text-text-heading">Next Billing</p>
                              <p className="text-sm text-text-primary">
                                {planInfo?.end_date ? formatDate(planInfo.end_date) : "—"}
                              </p>
                            </div>
                            <span className="font-semibold text-text-heading">{formatPrice(userPlan?.price)}</span>
                          </div>
                          <button
                            onClick={() => router.push("/dashboard/settings")}
                            className="w-full p-4 border-2 border-dashed border-border rounded-xl text-center hover:border-secondary hover:bg-bg-base transition-colors"
                          >
                            <p className="font-medium text-text-heading">View Billing History</p>
                            <p className="text-sm text-text-primary mt-1">Download invoices and receipts</p>
                          </button>
                        </div>
                      </SectionCard>
                    </div>
                  )}

                  {/* SECURITY */}
                  {activeSection === "security" && (
                    <SectionCard title="Security Settings" icon={Shield}>
                      <div className="space-y-3">
                        <SecurityRow icon={Shield} title="Change Password" description="Update your account password regularly" onClick={() => router.push("/dashboard/settings")} />
                        <SecurityRow
                          icon={twoFactorStatus?.is_enabled ? ShieldCheck : ShieldOff}
                          title="Two-Factor Authentication"
                          description={twoFactorStatus?.is_enabled ? `Enabled via ${methodLabel[twoFactorStatus.method ?? "totp"] ?? "Authenticator App"}` : "Add an extra layer of security to your account"}
                          badge={
                            twoFactorStatus?.is_enabled ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success-bg text-status-success-text border border-status-success-border">
                                <ShieldCheck className="w-3 h-3" /> Enabled
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-status-warning-bg text-status-warning-text border border-status-warning-border">
                                <ShieldOff className="w-3 h-3" /> Not Enabled
                              </span>
                            )
                          }
                          onClick={() => router.push("/dashboard/settings")}
                        />
                        <SecurityRow icon={User} title="Login Activity" description="Review recent account activity and devices" onClick={() => router.push("/dashboard/settings")} />
                      </div>
                    </SectionCard>
                  )}

                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
