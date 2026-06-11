"use client";
// src/components/business-info/BusinessInfo.tsx
//
// FIXES APPLIED:
// 1. Snapshot upload — FormData uncommented and sent as multipart/form-data
// 2. Missing business fields added: trade_license_number, trn, address, currency
// 3. Update response bug fixed — reads response.data.response (object, not array)
// 4. communication_channels type fixed — stored and sent as string[] JSONB array

import React, { ChangeEvent, useEffect, useState } from "react";
import SectionCard    from "../section-card/SectionCard";
import { Building2, Upload, Loader2, X } from "lucide-react";
import InputField     from "../ui/InputField";
import toast          from "react-hot-toast";
import axiosInstance  from "@/utils/axiosInstance";
import Button         from "../ui/Button";
import { useAuth }    from "@/context/AuthContext";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import Image          from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────
interface BusinessFormData {
  uuid:                   string;
  user_id:                string;
  business_name:          string;
  owner_name:             string;
  industry:               string;
  business_type:          string;
  services_offered:       string;
  // FIX 4: stored as string[] in DB (JSONB), managed as a comma-separated string in the UI
  communication_channels: string[];
  communication_channels_raw: string;  // local UI state for the text input
  availability:           string;
  faq:                    string;
  tone_examples:          string;
  snapshot:               File | string;
  // FIX 2: new fields that appear on invoices/quotations
  trade_license_number:   string;
  trn:                    string;
  address:                string;
  currency:               string;
}

interface Props {
  /** Called after a successful save/update so parent can update onboarding state */
  onSaveSuccess?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CHANNEL_OPTIONS = ["Email", "WhatsApp", "Phone", "Instagram", "Telegram", "LinkedIn"];
const CURRENCY_OPTIONS = ["AED", "USD", "EUR", "GBP", "SAR", "OMR", "KWD", "BHD", "QAR"];

const EMPTY_FORM = (user_id: string): BusinessFormData => ({
  uuid:                   "",
  user_id,
  business_name:          "",
  owner_name:             "",
  industry:               "",
  business_type:          "",
  services_offered:       "",
  communication_channels: ["Email", "WhatsApp"],
  communication_channels_raw: "Email, WhatsApp",
  availability:           "",
  faq:                    "",
  tone_examples:          "",
  snapshot:               "",
  trade_license_number:   "",
  trn:                    "",
  address:                "",
  currency:               "AED",
});

// ─── Component ────────────────────────────────────────────────────────────────
const BusinessInfo = ({ onSaveSuccess }: Props) => {
  const { user, loading } = useAuth();
  const user_id = user?.user.user_id as string;

  const [snapshotPreview, setSnapshotPreview] = useState("");
  const [isLoading,       setIsLoading]       = useState<boolean>(false);
  const [isSaving,        setIsSaving]        = useState<boolean>(false);
  const [isEditMode,      setIsEditMode]      = useState<boolean>(false);
  const [isEditing,       setIsEditing]       = useState(false);
  const [isDirty,         setIsDirty]         = useState<boolean>(false);
  const [originalData,    setOriginalData]    = useState<BusinessFormData | null>(null);
  const [formData,        setFormData]        = useState<BusinessFormData>(EMPTY_FORM(user_id));

  // ── Input change ──────────────────────────────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (isEditMode) setIsDirty(JSON.stringify(updated) !== JSON.stringify(originalData));
      return updated;
    });
  };

  // FIX 4: Parse communication_channels text input → string[]
  const handleChannelsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = raw.split(",").map((c) => c.trim()).filter(Boolean);
    setFormData((prev) => {
      const updated = { ...prev, communication_channels_raw: raw, communication_channels: parsed };
      if (isEditMode) setIsDirty(JSON.stringify(updated) !== JSON.stringify(originalData));
      return updated;
    });
  };

  const toggleChannel = (channel: string) => {
    setFormData((prev) => {
      const current = prev.communication_channels;
      const next    = current.includes(channel)
        ? current.filter((c) => c !== channel)
        : [...current, channel];
      const raw = next.join(", ");
      const updated = { ...prev, communication_channels: next, communication_channels_raw: raw };
      if (isEditMode) setIsDirty(JSON.stringify(updated) !== JSON.stringify(originalData));
      return updated;
    });
  };

  // FIX 1: Snapshot upload — file handled properly
  const handleSnapshotChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("No file selected.");
    if (!file.type.startsWith("image/")) return toast.error("Only image files are allowed.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB.");
    setSnapshotPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, snapshot: file }));
    if (isEditMode) setIsDirty(true);
  };

  const removeSnapshot = () => {
    setSnapshotPreview("");
    setFormData((prev) => ({ ...prev, snapshot: "" }));
    if (isEditMode) setIsDirty(true);
  };

  // ── Build multipart payload (for both create and update) ──────────────────
  const buildFormData = (): FormData => {
    const payload = new FormData();
    payload.append("user_id",              user_id);
    payload.append("business_name",        formData.business_name);
    payload.append("owner_name",           formData.owner_name);
    payload.append("industry",             formData.industry);
    payload.append("business_type",        formData.business_type);
    payload.append("services_offered",     formData.services_offered);
    payload.append("availability",         formData.availability);
    payload.append("faq",                  formData.faq);
    payload.append("tone_examples",        formData.tone_examples);
    payload.append("is_active",            String(formData.is_active ?? true));
    payload.append("trade_license_number", formData.trade_license_number);
    payload.append("trn",                  formData.trn);
    payload.append("address",              formData.address);
    payload.append("currency",             formData.currency);
    // FIX 4: Send as JSON string so backend can parse JSONB
    payload.append("communication_channels", JSON.stringify(formData.communication_channels));
    // FIX 1: Only append snapshot when it's a File (new upload)
    if (formData.snapshot instanceof File) {
      payload.append("snapshot", formData.snapshot);
    }
    return payload;
  };

  // ── Save (create) ─────────────────────────────────────────────────────────
  const handleSaveInfo = async () => {
    if (!user_id) return toast.error("User ID not loaded.");
    if (!formData.business_name || !formData.industry || !formData.services_offered) {
      return toast.error("Business name, industry, and services are required.");
    }
    setIsSaving(true);
    try {
      const payload  = buildFormData();
      const response = await axiosInstance.post("/user_business_info/create", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        toast.success("Business info saved successfully!");
        const saved = response.data.response;
        setIsEditMode(true);
        // FIX 3: response is an object, not array
        const savedData: BusinessFormData = {
          ...formData,
          ...saved,
          communication_channels:     Array.isArray(saved.communication_channels) ? saved.communication_channels : formData.communication_channels,
          communication_channels_raw: Array.isArray(saved.communication_channels) ? saved.communication_channels.join(", ") : formData.communication_channels_raw,
        };
        setFormData(savedData);
        setOriginalData(savedData);
        onSaveSuccess?.();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to save business info.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/user_business_info/user/${user_id}`);
      if (response.status === 200) {
        // FIX 3: response?.[0] is correct here (list endpoint returns array)
        const userInfo = response.data.response?.[0];
        if (userInfo?.uuid || userInfo?.business_name) {
          setIsEditMode(true);
          // FIX 4: Normalise communication_channels to string[]
          const channels = Array.isArray(userInfo.communication_channels)
            ? userInfo.communication_channels
            : typeof userInfo.communication_channels === "string"
              ? (userInfo.communication_channels as string).split(",").map((c: string) => c.trim()).filter(Boolean)
              : ["Email", "WhatsApp"];

          const mapped: BusinessFormData = {
            ...EMPTY_FORM(user_id),
            ...userInfo,
            communication_channels:     channels,
            communication_channels_raw: channels.join(", "),
          };
          setFormData(mapped);
          setOriginalData(mapped);

          if (userInfo.snapshot && typeof userInfo.snapshot === "string") {
            setSnapshotPreview(`${process.env.NEXT_PUBLIC_ASSET_URL}${userInfo.snapshot}`);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching business info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdateInfo = async () => {
    if (!formData.business_name || !formData.industry || !formData.services_offered) {
      return toast.error("Business name, industry, and services are required.");
    }
    setIsSaving(true);
    try {
      const payload  = buildFormData();
      const response = await axiosInstance.patch(
        `/user_business_info/update/${formData.uuid}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      if (response.status === 200) {
        toast.success("Business info updated successfully!");
        // FIX 3: PATCH endpoint returns object not array
        const updated = response.data.response;
        const updatedData: BusinessFormData = {
          ...formData,
          ...(updated ?? {}),
          communication_channels:     formData.communication_channels,
          communication_channels_raw: formData.communication_channels_raw,
        };
        setFormData(updatedData);
        setOriginalData(updatedData);
        setIsEditing(false);
        setIsDirty(false);
        onSaveSuccess?.();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to update business info.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteInfo = async (uuid: string) => {
    if (!confirm("Delete all business information? This cannot be undone.")) return;
    try {
      const response = await axiosInstance.delete(`/user_business_info/delete/${uuid}`);
      if (response.status === 200) {
        toast.success("Business info deleted.");
        setIsEditMode(false);
        setIsEditing(false);
        setIsDirty(false);
        setSnapshotPreview("");
        setFormData(EMPTY_FORM(user_id));
        setOriginalData(null);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to delete.");
    }
  };

  const handleCancelInfo = () => {
    if (isEditMode && isEditing && originalData) {
      setFormData(originalData);
      setIsEditing(false);
      setIsDirty(false);
      if (typeof originalData.snapshot === "string" && originalData.snapshot) {
        setSnapshotPreview(`${process.env.NEXT_PUBLIC_ASSET_URL}${originalData.snapshot}`);
      } else {
        setSnapshotPreview("");
      }
    } else {
      setFormData(EMPTY_FORM(user_id));
      setSnapshotPreview("");
    }
  };

  useEffect(() => {
    if (!loading && user_id) fetchUserInfo();
  }, [loading, user_id]);

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-lg bg-bg-base text-text-heading text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all";
  const isReadOnly = isEditMode && !isEditing;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <SectionCard title="Business Information" icon={Building2}>
      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">

            {/* Business Name */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Business Name *</label>
              <InputField name="business_name" value={formData.business_name} placeholder="Your business name" onChange={handleInputChange} readOnly={isReadOnly} required />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Owner Name</label>
              <InputField name="owner_name" value={formData.owner_name} placeholder="Owner's full name" onChange={handleInputChange} readOnly={isReadOnly} />
            </div>

            {/* FIX 2: Trade License Number */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Trade License Number</label>
              <InputField name="trade_license_number" value={formData.trade_license_number} placeholder="e.g. DED-123456" onChange={handleInputChange} readOnly={isReadOnly} />
            </div>

            {/* FIX 2: TRN */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Tax Registration Number (TRN)</label>
              <InputField name="trn" value={formData.trn} placeholder="e.g. 100123456700003" onChange={handleInputChange} readOnly={isReadOnly} />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Industry *</label>
              <InputField name="industry" value={formData.industry} placeholder="e.g. IT, Restaurant, Retail" onChange={handleInputChange} readOnly={isReadOnly} required />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Business Type</label>
              <InputField name="business_type" value={formData.business_type} placeholder="e.g. LLC, Freelance, FZCO" onChange={handleInputChange} readOnly={isReadOnly} />
            </div>

            {/* FIX 2: Address */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Business Address</label>
              <InputField name="address" value={formData.address} placeholder="e.g. Business Bay, Dubai, UAE" onChange={handleInputChange} readOnly={isReadOnly} />
            </div>

            {/* FIX 2: Currency */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Default Currency</label>
              {isReadOnly ? (
                <div className="flex items-center px-3 py-2.5 bg-bg-base border border-border rounded-lg text-text-heading text-sm">
                  {formData.currency}
                </div>
              ) : (
                <select name="currency" value={formData.currency} onChange={handleInputChange} className={inputCls}>
                  {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Availability</label>
              <InputField name="availability" value={formData.availability} placeholder="e.g. Mon–Fri 9am–6pm" onChange={handleInputChange} readOnly={isReadOnly} />
            </div>
          </div>

          {/* Services Offered */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Services Offered *</label>
            <InputField name="services_offered" value={formData.services_offered} type="textarea" placeholder="List all services your business offers" onChange={handleInputChange} readOnly={isReadOnly} required />
          </div>

          {/* FAQ */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">FAQ</label>
            <InputField name="faq" value={formData.faq} type="textarea" placeholder="Frequently asked questions and answers" onChange={handleInputChange} readOnly={isReadOnly} />
          </div>

          {/* Tone Examples */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Tone Examples</label>
            <InputField name="tone_examples" value={formData.tone_examples} placeholder="Communication style or example phrases" onChange={handleInputChange} readOnly={isReadOnly} />
          </div>

          {/* FIX 4: Communication Channels — toggle chips */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Communication Channels</label>
            {isReadOnly ? (
              <div className="flex flex-wrap gap-2">
                {formData.communication_channels.map((c) => (
                  <span key={c} className="px-3 py-1 bg-brand-light text-secondary border border-border rounded-full text-xs font-semibold">{c}</span>
                ))}
                {formData.communication_channels.length === 0 && <span className="text-sm text-text-muted">—</span>}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {CHANNEL_OPTIONS.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      formData.communication_channels.includes(ch)
                        ? "bg-secondary text-on-brand border-secondary"
                        : "bg-surface text-text-secondary border-border hover:border-secondary"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              disabled={isReadOnly}
              checked={!!(formData as any).is_active}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked } as any))}
              className="h-4 w-4 accent-secondary border-border rounded"
            />
            <label className="text-sm font-medium text-text-heading">Business is Active</label>
          </div>

          {/* FIX 1: Snapshot Upload — FormData properly built above */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Business Snapshot / Logo</label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-secondary transition-colors bg-bg-base">
              {snapshotPreview ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <Image src={snapshotPreview} alt="Snapshot Preview" width={120} height={120} className="rounded-xl object-cover border border-border" />
                    {!isReadOnly && (
                      <button onClick={removeSnapshot} className="absolute -top-2 -right-2 w-6 h-6 bg-status-error text-on-brand rounded-full flex items-center justify-center shadow-md hover:opacity-90">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {!isReadOnly && <p className="text-xs text-text-muted">Click below to change</p>}
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-text-muted mx-auto mb-2" />
                  <p className="text-sm font-medium text-text-heading">Upload business logo or snapshot</p>
                  <p className="text-xs text-text-muted mt-1 mb-3">PNG, JPG, SVG — max 5 MB</p>
                </>
              )}
              {!isReadOnly && (
                <>
                  <input type="file" accept="image/*" onChange={handleSnapshotChange} id="snapshotUpload" className="hidden" />
                  <label htmlFor="snapshotUpload" className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-on-brand rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                    <Upload className="w-4 h-4" />
                    {snapshotPreview ? "Change File" : "Upload File"}
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-end gap-3 pt-2 border-t border-border">
            <Button onClick={handleCancelInfo} className="border bg-surface border-border text-text-secondary hover:bg-bg-base" disabled={isSaving}>
              Cancel
            </Button>
            {formData.uuid && (
              <Button onClick={() => handleDeleteInfo(formData.uuid)} className="bg-status-error-bg text-status-error border border-status-error-border hover:bg-status-error hover:text-on-brand" disabled={isSaving}>
                Delete Info
              </Button>
            )}
            <Button
              disabled={(isEditMode && isEditing && !isDirty) || isSaving}
              onClick={() => {
                if (isEditMode && !isEditing) return setIsEditing(true);
                if (isEditMode && isEditing)  return handleUpdateInfo();
                handleSaveInfo();
              }}
              startIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {isSaving
                ? "Saving…"
                : isEditMode && !isEditing
                  ? "Edit Info"
                  : isEditMode && isEditing
                    ? "Update Info"
                    : "Save Info"}
            </Button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default BusinessInfo;
