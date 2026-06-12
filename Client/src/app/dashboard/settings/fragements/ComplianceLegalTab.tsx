"use client";
// src/app/dashboard/settings/fragements/ComplianceLegalTab.tsx
//
// FIXES APPLIED:
// 1. Business region & compliance framework now save via
//    PATCH /user_business_info/update/:uuid
// 2. "Compliance is up to date" reads real data from
//    GET /compliance-licensing/user/:id/expiring
// 3. Legal document buttons open the full LegalDocumentModal
//    with real Privacy Policy, Terms of Service, and DPA text

import React, { useEffect, useState } from "react";
import {
  FileText, Check, ChevronRight, AlertTriangle, Loader2,
  Shield, Calendar, Globe, Building2, RefreshCcw,
} from "lucide-react";
import SectionCard         from "@/components/section-card/SectionCard";
import LegalDocumentModal  from "@/components/legal-modal/LegalDocumentModal";
import {
  PRIVACY_POLICY, TERMS_OF_SERVICE, DATA_PROCESSING_AGREEMENT,
  type LegalDocument,
} from "@/components/legal-modal/legalContent";
import axiosInstance  from "@/utils/axiosInstance";
import { useAuth }    from "@/context/AuthContext";
import toast          from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BusinessInfoRecord {
  uuid:                 string;
  business_location:    string | null;
  compliance_framework: string | null;
  business_region:      string | null;
}

interface ExpiringLicense {
  uuid:         string;
  license_type: string;
  expiry_date:  string;
  status:       "active" | "expired" | "suspended";
}

// ─── Constants ────────────────────────────────────────────────────────────────
const REGION_OPTIONS = [
  { value: "uae",     label: "United Arab Emirates (UAE)" },
  { value: "saudi",   label: "Saudi Arabia"               },
  { value: "qatar",   label: "Qatar"                      },
  { value: "kuwait",  label: "Kuwait"                     },
  { value: "bahrain", label: "Bahrain"                    },
  { value: "oman",    label: "Oman"                       },
];

const FRAMEWORK_OPTIONS = [
  { value: "mainland",  label: "UAE Mainland",  desc: "Registered with DED — VAT, WPS, and federal regulations apply" },
  { value: "free_zone", label: "Free Zone",     desc: "Registered in a UAE Free Zone (DMCC, ADGM, DIFC, Jebel Ali, etc.)" },
  { value: "offshore",  label: "Offshore",      desc: "Offshore company (Ajman, RAK ICC, etc.) — limited UAE activity" },
];

const LEGAL_DOCS: { doc: LegalDocument; badge: string }[] = [
  { doc: PRIVACY_POLICY,             badge: `v${PRIVACY_POLICY.version}`             },
  { doc: TERMS_OF_SERVICE,           badge: `v${TERMS_OF_SERVICE.version}`           },
  { doc: DATA_PROCESSING_AGREEMENT,  badge: `v${DATA_PROCESSING_AGREEMENT.version}`  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const ComplianceLegalTab: React.FC = () => {
  const { user } = useAuth();
  const userId   = user?.user?.user_id as string | undefined;

  // Business info record
  const [bizInfo,   setBizInfo]   = useState<BusinessInfoRecord | null>(null);
  const [isFetching,setIsFetching]= useState(true);
  const [isSaving,  setIsSaving]  = useState(false);
  const [isDirty,   setIsDirty]   = useState(false);

  // Compliance status
  const [expiringLicenses, setExpiringLicenses] = useState<ExpiringLicense[]>([]);
  const [complianceLoading,setComplianceLoading]= useState(true);

  // Form state
  const [businessRegion,      setBusinessRegion]      = useState("uae");
  const [complianceFramework,  setComplianceFramework]  = useState("mainland");
  const [originalRegion,       setOriginalRegion]       = useState("uae");
  const [originalFramework,    setOriginalFramework]    = useState("mainland");

  // Legal modal
  const [openDoc, setOpenDoc] = useState<LegalDocument | null>(null);

  // ── Fetch business info (to get uuid and pre-fill dropdowns) ─────────────
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/user_business_info/user/${userId}`);
        const record: BusinessInfoRecord | null = res.data?.response?.[0] ?? null;
        if (record) {
          setBizInfo(record);
          const region    = record.business_region      || "uae";
          const framework = record.compliance_framework || "mainland";
          setBusinessRegion(region);     setOriginalRegion(region);
          setComplianceFramework(framework); setOriginalFramework(framework);
        }
      } catch {
        // no record yet — user will fill and create
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, [userId]);

  // ── Fetch expiring licenses — drives the compliance status banner ────────
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      try {
        // GET /compliance-licensing/user/:user_id/expiring?daysBefore=30
        const res = await axiosInstance.get(
          `/compliance-licensing/user/${userId}/expiring`,
          { params: { daysBefore: 30 } }
        );
        setExpiringLicenses(res.data?.response ?? []);
      } catch {
        // no licenses yet — treat as all-clear
        setExpiringLicenses([]);
      } finally {
        setComplianceLoading(false);
      }
    };
    load();
  }, [userId]);

  // ── Track dirty state ─────────────────────────────────────────────────────
  const handleRegionChange = (val: string) => {
    setBusinessRegion(val);
    setIsDirty(val !== originalRegion || complianceFramework !== originalFramework);
  };

  const handleFrameworkChange = (val: string) => {
    setComplianceFramework(val);
    setIsDirty(businessRegion !== originalRegion || val !== originalFramework);
  };

  // ── Save compliance settings ──────────────────────────────────────────────
  const handleSave = async () => {
    if (!userId) return toast.error("User ID not found.");
    setIsSaving(true);
    try {
      const payload = {
        business_region:      businessRegion,
        compliance_framework: complianceFramework,
        // Sync business_location to match compliance_framework
        // (free_zone/mainland/offshore are used interchangeably)
        business_location: complianceFramework,
      };

      if (bizInfo?.uuid) {
        // Update existing business info record
        await axiosInstance.patch(
          `/user_business_info/update/${bizInfo.uuid}`,
          payload
        );
      } else {
        // No business info record yet — create a minimal one
        const createRes = await axiosInstance.post(`/user_business_info/create`, {
          user_id:          userId,
          business_name:    user?.user?.company_name || user?.user?.full_name + "'s Business",
          industry:         user?.user?.industry || "other",
          services_offered: "To be updated",
          ...payload,
        });
        if (createRes.data?.response) {
          setBizInfo(createRes.data.response);
        }
      }

      setOriginalRegion(businessRegion);
      setOriginalFramework(complianceFramework);
      setIsDirty(false);
      toast.success("Compliance settings saved.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save compliance settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setBusinessRegion(originalRegion);
    setComplianceFramework(originalFramework);
    setIsDirty(false);
  };

  // ── Compliance status logic ───────────────────────────────────────────────
  const expiredLicenses  = expiringLicenses.filter((l) => l.status === "expired");
  const expiringSoon     = expiringLicenses.filter((l) => l.status === "active");
  const isCompliant      = !complianceLoading && expiredLicenses.length === 0 && expiringSoon.length === 0;
  const hasIssues        = expiredLicenses.length > 0;

  const selectCls = "w-full px-3 py-2.5 bg-bg-base border border-border rounded-lg text-sm text-text-heading focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all";

  return (
    <div className="space-y-6">

      {/* ── Regional Compliance ─────────────────────────────────────────── */}
      <SectionCard title="Regional Compliance" icon={Globe}>
        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
          </div>
        ) : (
          <div className="space-y-5">

            {/* Business Region */}
            <div>
              <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                Business Region
              </label>
              <select
                value={businessRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                className={selectCls}
              >
                {REGION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-xs text-text-muted mt-1.5">
                Determines which compliance rules, tax regulations, and invoice templates apply to your business.
              </p>
            </div>

            {/* Compliance Framework — only shown for UAE */}
            {businessRegion === "uae" && (
              <div>
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                  Compliance Framework
                </label>
                <div className="space-y-2">
                  {FRAMEWORK_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleFrameworkChange(opt.value)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                        complianceFramework === opt.value
                          ? "border-secondary bg-brand-light"
                          : "border-border bg-bg-base hover:border-border-strong hover:bg-surface"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        complianceFramework === opt.value
                          ? "border-secondary"
                          : "border-border"
                      }`}>
                        {complianceFramework === opt.value && (
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${
                          complianceFramework === opt.value ? "text-secondary" : "text-text-heading"
                        }`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {bizInfo?.business_location && bizInfo.business_location !== complianceFramework && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                    Your signup selection was "{bizInfo.business_location.replace("_", " ")}". You are changing it — make sure this matches your actual business registration.
                  </p>
                )}
              </div>
            )}

            {/* For non-UAE: mainland always applies */}
            {businessRegion !== "uae" && (
              <div className="flex items-center gap-3 p-3.5 bg-bg-base rounded-xl border border-border">
                <Building2 className="w-4 h-4 text-text-muted flex-shrink-0" />
                <p className="text-sm text-text-secondary">
                  Compliance framework defaults to <strong>Mainland</strong> for GCC countries outside the UAE.
                </p>
              </div>
            )}

            {/* Save / Cancel */}
            {isDirty && (
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-semibold text-text-secondary border border-border bg-surface hover:bg-bg-base rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-on-brand bg-secondary hover:opacity-90 rounded-lg transition-all disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isSaving ? "Saving…" : "Save Settings"}
                </button>
              </div>
            )}

            {!isDirty && bizInfo?.uuid && (
              <p className="text-xs text-text-muted text-center">
                Compliance settings saved · Last updated when you changed them
              </p>
            )}
          </div>
        )}
      </SectionCard>

      {/* ── Compliance Status ────────────────────────────────────────────── */}
      <SectionCard title="Compliance Status" icon={Shield}>
        {complianceLoading ? (
          <div className="flex items-center gap-3 p-4 bg-bg-base rounded-xl border border-border">
            <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
            <span className="text-sm text-text-muted">Checking compliance status…</span>
          </div>
        ) : hasIssues ? (
          /* ── Expired licenses ── */
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-status-error-bg border border-status-error-border rounded-xl">
              <div className="w-8 h-8 bg-status-error-bg border border-status-error-border rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-status-error" />
              </div>
              <div>
                <p className="text-sm font-semibold text-status-error">
                  {expiredLicenses.length} license{expiredLicenses.length !== 1 ? "s have" : " has"} expired
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Expired licenses may affect your ability to operate legally. Renew immediately.
                </p>
              </div>
            </div>
            {expiredLicenses.map((lic) => (
              <div key={lic.uuid} className="flex items-center justify-between p-3 bg-bg-base border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-status-error flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-text-heading">{lic.license_type}</p>
                    <p className="text-xs text-status-error mt-0.5">
                      Expired {new Date(lic.expiry_date).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <a
                  href="/dashboard/compliance"
                  className="text-xs font-semibold text-secondary hover:underline"
                >
                  Renew →
                </a>
              </div>
            ))}
          </div>
        ) : expiringSoon.length > 0 ? (
          /* ── Expiring within 30 days ── */
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-status-warning-bg border border-status-warning-border rounded-xl">
              <div className="w-8 h-8 bg-status-warning-bg border border-status-warning-border rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-status-warning" />
              </div>
              <div>
                <p className="text-sm font-semibold text-status-warning">
                  {expiringSoon.length} license{expiringSoon.length !== 1 ? "s expire" : " expires"} within 30 days
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Renew before the expiry date to avoid service disruption.
                </p>
              </div>
            </div>
            {expiringSoon.map((lic) => (
              <div key={lic.uuid} className="flex items-center justify-between p-3 bg-bg-base border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-status-warning flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-text-heading">{lic.license_type}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Expires {new Date(lic.expiry_date).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <a
                  href="/dashboard/compliance"
                  className="text-xs font-semibold text-secondary hover:underline"
                >
                  View →
                </a>
              </div>
            ))}
            <button
              onClick={() => setComplianceLoading(true)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              <RefreshCcw className="w-3 h-3" /> Refresh status
            </button>
          </div>
        ) : (
          /* ── All clear ── */
          <div className="flex items-start gap-3 p-4 bg-status-success-bg border border-status-success-border rounded-xl">
            <div className="w-8 h-8 bg-status-success-bg border border-status-success-border rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-status-success" />
            </div>
            <div>
              <p className="text-sm font-semibold text-status-success">
                All compliance records are up to date
              </p>
              <p className="text-xs text-text-secondary mt-1">
                No licenses are expired or expiring in the next 30 days.
                {expiringLicenses.length === 0 && " Add your licenses in the "}
                {expiringLicenses.length === 0 && (
                  <a href="/dashboard/compliance" className="text-secondary hover:underline font-medium">
                    Compliance module
                  </a>
                )}
                {expiringLicenses.length === 0 && " to enable automated expiry reminders."}
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── Legal Documents ──────────────────────────────────────────────── */}
      <SectionCard title="Legal Documents" icon={FileText}>
        <div className="space-y-2">
          {LEGAL_DOCS.map(({ doc, badge }) => (
            <button
              key={doc.id}
              onClick={() => setOpenDoc(doc)}
              className="flex items-center justify-between w-full p-4 bg-bg-base border border-border rounded-xl hover:border-secondary hover:bg-surface hover:shadow-card transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-light border border-border rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:border-secondary transition-colors">
                  <FileText className="w-4 h-4 text-secondary group-hover:text-on-brand transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-heading">{doc.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Effective {doc.effectiveDate} · Updated {doc.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <span className="hidden sm:block text-xs font-semibold text-secondary bg-brand-light border border-border px-2 py-0.5 rounded-full">
                  {badge}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-3 p-3.5 bg-bg-base border border-border rounded-xl">
          <Shield className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            By using BizMate AI, you agree to our Terms of Service and Privacy Policy. Our Data Processing Agreement governs how we handle your clients' personal data. For legal enquiries, contact{" "}
            <a href="mailto:legal@bizmate.ai" className="text-secondary hover:underline font-medium">
              legal@bizmate.ai
            </a>
          </p>
        </div>
      </SectionCard>

      {/* ── Legal Document Modal ─────────────────────────────────────────── */}
      <LegalDocumentModal
        document={openDoc}
        onClose={() => setOpenDoc(null)}
      />
    </div>
  );
};

export default ComplianceLegalTab;
