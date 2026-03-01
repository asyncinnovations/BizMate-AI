"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Building,
  Plus,
  Upload,
  RefreshCw,
  Shield,
  Sparkles,
  TrendingUp,
  FolderOpen,
  Link2,
  Download,
  Trash2,
  Paperclip,
  X,
  FileBadge,
  BadgeCheck,
  Ban,
  Bell,
  Search,
  BarChart3,
  FileCheck,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/stat-card/StatCard";
import PageHeader from "@/components/page-header/PageHeader";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import InputField from "@/components/ui/InputField";
import EmptyState from "@/components/empty-state/EmptyState";
import LicenseCard from "@/components/license-card/LicenseCard";
import ActionMenu from "@/components/ui/ActionMenu";
import ComplianceHealthBar from "@/components/compliance-health/ComplianceHealthBar";
import QuickActions from "@/components/compliance-actions/QuickActions";
import UpcomingDeadlines from "@/components/compliance-deadlines-card/UpcomingDeadlines";
import ActivityTimeline from "@/components/compliance-activity/ActivityTimeline";
import ModeToggle from "@/components/mode-toggle/ModeToggle";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface License {
  id: string;
  uuid?: string;
  license_type: string;
  license_number: string;
  issue_date: string;
  expiry_date: string;
  status: "active" | "expired" | "renewal_pending" | "suspended";
  company_id: string;
  document_id?: string;
}

export interface ComplianceDocument {
  uuid?: string;
  id: string;
  document_type: string;
  filename: string;
  file_url: string;
  reminder_id?: string;
  is_verified?: boolean;
  is_rejected?: boolean;
  created_at: string;
  ai_summary?: string;
}

export interface ActivityEntry {
  id: string;
  event_type: string;
  details: string;
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const LICENSE_TYPES = [
  "Trade License",
  "VAT Registration",
  "ESR License",
  "Import/Export License",
  "Professional License",
  "Industrial License",
  "Commercial License",
  "Other",
];

export const DOC_TYPES = [
  "Trade License",
  "Passport Copy",
  "Tenancy Contract",
  "Emirates ID",
  "Memorandum of Association",
  "Share Certificate",
  "VAT Certificate",
  "ESR Report",
  "AML Policy",
  "Corporate Tax Return",
  "MOA/AOA",
  "Commercial Registration",
  "Bank Statement",
  "Other",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getDaysRemaining = (expiry: string) =>
  Math.floor((new Date(expiry).getTime() - Date.now()) / 86400000);

export const getLicenseStatusConfig = (status: License["status"]) => {
  switch (status) {
    case "active":
      return {
        badge:
          "bg-status-success-bg text-status-success-text border border-status-success-border",
        icon: <BadgeCheck className="w-3.5 h-3.5" />,
        label: "Active",
      };
    case "expired":
      return {
        badge:
          "bg-status-error-bg text-status-error-text border border-status-error-border",
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        label: "Expired",
      };
    case "renewal_pending":
      return {
        badge:
          "bg-status-warning-bg text-status-warning-text border border-status-warning-border",
        icon: <RefreshCw className="w-3.5 h-3.5" />,
        label: "Renewal Pending",
      };
    case "suspended":
      return {
        badge: "bg-bg-muted text-text-secondary border border-border",
        icon: <Ban className="w-3.5 h-3.5" />,
        label: "Suspended",
      };
    default:
      return {
        badge:
          "bg-status-info-bg text-status-info-text border border-status-info-border",
        icon: <FileBadge className="w-3.5 h-3.5" />,
        label: status,
      };
  }
};

export const fmtDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// ─── Shared select class ──────────────────────────────────────────────────────

const selectCls =
  "w-full border border-border text-text-primary rounded-xl px-4 py-3 text-sm bg-bg-base focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComplianceLicensingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.user?.user_id;
  const companyId = user?.user?.company_id;

  // ── Tab ──
  const [activeTab, setActiveTab] = useState<"licensing" | "documents">(
    "licensing",
  );

  // ── Data ──
  const [licenses, setLicenses] = useState<License[]>([]);
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  // ── Loading ──
  const [licensesLoading, setLicensesLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  // ── Search / filter ──
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // ── Modals ──
  const [isAddLicenseOpen, setIsAddLicenseOpen] = useState(false);
  const [isEditLicenseOpen, setIsEditLicenseOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isAttachDocOpen, setIsAttachDocOpen] = useState(false);
  const [isAttachToLicenseOpen, setIsAttachToLicenseOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ComplianceDocument | null>(
    null,
  );
  const [attachMode, setAttachMode] = useState<"upload" | "select">("upload");
  const [selectedExistingDocId, setSelectedExistingDocId] = useState("");
  const [selectedExistingLicId, setSelectedExistingLicId] = useState("");

  // ── Forms ──
  const [addForm, setAddForm] = useState({
    license_type: "",
    license_number: "",
    issue_date: "",
    expiry_date: "",
  });
  const [editForm, setEditForm] = useState({
    license_type: "",
    license_number: "",
    issue_date: "",
    expiry_date: "",
  });
  const [addFormErrors, setAddFormErrors] = useState<Record<string, string>>(
    {},
  );
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>(
    {},
  );
  const [addFormLoading, setAddFormLoading] = useState(false);
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [uploadDocForm, setUploadDocForm] = useState({
    document_type: "",
    file_url: "",
  });
  const [uploadDocFile, setUploadDocFile] = useState<File | null>(null);
  const [uploadDocLoading, setUploadDocLoading] = useState(false);
  const [attachDocLoading, setAttachDocLoading] = useState(false);
  const [attachToLicLoading, setAttachToLicLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [reminderLoading, setReminderLoading] = useState(false);

  // ── Reminder form — matches AiReminder entity exactly ──
  const [reminderForm, setReminderForm] = useState<{
    license_id: string;
    notify_before: string; // days before expiry — maps to entity notify_before (integer)
    notify_channels: { email: boolean; whatsapp: boolean; push: boolean };
  }>({
    license_id: "",
    notify_before: "30",
    notify_channels: { email: true, whatsapp: false, push: true },
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);

  /////////////////////////////////////////////////////////
  // History logger
  ///////////////////////////////////////////////////////////
  const logHistory = useCallback(
    async (endpoint: string, payload: Record<string, unknown>) => {
      try {
        await axiosInstance.post(`/compliance-history/${endpoint}`, {
          user_id: userId,
          ...payload,
        });
      } catch (error) {
        console.error("History log error:", error);
      }
    },
    [userId],
  );

  /////////////////////////////////////////////////////////////
  // Fetch User Licenses
  ////////////////////////////////////////////////////////////
  const fetchLicenses = useCallback(async () => {
    if (!userId) return;
    setLicensesLoading(true);
    try {
      const res = await axiosInstance.get(
        `/compliance-licensing/user/${userId}${companyId ? `?company_id=${companyId}` : ""}`,
      );
      const data = res.data || [];
      setLicenses(data.map((item: License) => ({ ...item, id: item.uuid })));
    } catch (error) {
      console.error("Failed to load licenses:", error);
      toast.error("Failed to load licenses");
    } finally {
      setLicensesLoading(false);
    }
  }, [userId, companyId]);

  ////////////////////////////////////////////////////
  // Fetch User Documents
  ///////////////////////////////////////////////////
  const fetchDocuments = useCallback(async () => {
    if (!userId) return;
    setDocsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/compliance-documents/user/${userId}`,
      );
      const data = res.data?.response || [];
      setDocuments(
        data.map((item: ComplianceDocument) => ({ ...item, id: item.uuid })),
      );
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setDocsLoading(false);
    }
  }, [userId]);

  ////////////////////////////////////////////////////
  // Fetch User Activity
  ///////////////////////////////////////////////////
  const fetchActivity = useCallback(async () => {
    if (!userId) return;
    setActivityLoading(true);
    try {
      const res = await axiosInstance.get(`/compliance-history/user`);
      const data = res.data?.response || res.data || [];
      setActivity(data.slice(0, 10));
    } catch (error) {
      console.error("Failed to load activity:", error);
    } finally {
      setActivityLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLicenses();
    fetchDocuments();
    fetchActivity();
  }, [fetchLicenses, fetchDocuments, fetchActivity]);

  /////////////////////////////////////////////////
  // Derived
  ////////////////////////////////////////////////////
  const getAttachedDocument = (license: License) =>
    license.document_id
      ? documents.find((d) => d.id === license.document_id)
      : undefined;

  const filteredLicenses = licenses.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      (!q ||
        l.license_type.toLowerCase().includes(q) ||
        l.license_number.toLowerCase().includes(q)) &&
      (statusFilter === "all" || l.status === statusFilter)
    );
  });

  //////////////////////////////////////////////////////
  // CRUD: License
  //////////////////////////////////////////////////////
  const validateAddForm = () => {
    const errs: Record<string, string> = {};
    if (!addForm.license_type.trim())
      errs.license_type = "License type is required";
    if (!addForm.license_number.trim())
      errs.license_number = "License number is required";
    if (!addForm.issue_date) errs.issue_date = "Issue date is required";
    if (!addForm.expiry_date) errs.expiry_date = "Expiry date is required";
    setAddFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddLicense = async () => {
    if (!validateAddForm()) return;
    setAddFormLoading(true);
    try {
      const res = await axiosInstance.post("/compliance-licensing/create", {
        user_id: userId,
        company_id: companyId,
        ...addForm,
      });
      toast.success("License added successfully");
      setIsAddLicenseOpen(false);
      setAddForm({
        license_type: "",
        license_number: "",
        issue_date: "",
        expiry_date: "",
      });
      fetchLicenses();
      fetchActivity();
    } catch (error) {
      console.error("Failed to add license:", error);
      toast.error("Failed to add license");
    } finally {
      setAddFormLoading(false);
    }
  };

  const openEditLicense = (lic: License) => {
    setSelectedLicense(lic);
    setEditForm({
      license_type: lic.license_type,
      license_number: lic.license_number,
      issue_date: lic.issue_date.split("T")[0] || "",
      expiry_date: lic.expiry_date.split("T")[0] || "",
    });
    setIsEditLicenseOpen(true);
  };

  const validateEditForm = () => {
    const errs: Record<string, string> = {};
    if (!editForm.license_type.trim())
      errs.license_type = "License type is required";
    if (!editForm.license_number.trim())
      errs.license_number = "License number is required";
    if (!editForm.issue_date) errs.issue_date = "Issue date is required";
    if (!editForm.expiry_date) errs.expiry_date = "Expiry date is required";
    setEditFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEditLicense = async () => {
    if (!validateEditForm() || !selectedLicense) return;
    setEditFormLoading(true);
    try {
      await axiosInstance.put(
        `/compliance-licensing/update/${selectedLicense.id}`,
        editForm,
      );
      toast.success("License updated");
      setIsEditLicenseOpen(false);
      fetchLicenses();
      logHistory("license-renewed", {
        license_id: selectedLicense.id,
        license_type: editForm.license_type,
      });
      fetchActivity();
    } catch (error) {
      console.error("Failed to update license:", error);
      toast.error("Failed to update license");
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleDeleteLicense = async (id: string) => {
    if (!confirm("Delete this license? This action cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/compliance-licensing/delete/${id}`);
      toast.success("License deleted");
      setLicenses((p) => p.filter((l) => l.id !== id));
      fetchActivity();
    } catch (error) {
      console.error("Failed to delete license:", error);
      toast.error("Failed to delete license");
    }
  };

  //////////////////////////////////////////////////////////////
  // CRUD: Documents
  ///////////////////////////////////////////////////////
  const handleUploadDocument = async () => {
    if (!uploadDocForm.document_type) {
      toast.error("Please select a document type");
      return;
    }
    if (!uploadDocFile && !uploadDocForm.file_url) {
      toast.error("Please upload a file");
      return;
    }
    setUploadDocLoading(true);
    try {
      const fd = new FormData();
      fd.append("user_id", userId as string);
      fd.append("document_type", uploadDocForm.document_type);
      if (uploadDocFile) {
        fd.append("filename", uploadDocFile);
      } else {
        fd.append("file_url", uploadDocForm.file_url);
        fd.append(
          "filename",
          uploadDocForm.file_url.split("/").pop() || "document",
        );
      }
      const res = await axiosInstance.post("/compliance-documents/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document uploaded successfully");
      setIsUploadDocOpen(false);
      setUploadDocForm({ document_type: "", file_url: "" });
      setUploadDocFile(null);
      fetchDocuments();
      const docId =
        res.data?.response?.uuid ??
        res.data?.response?.id ??
        res.data?.uuid ??
        res.data?.id;
      const filename =
        uploadDocFile?.name ??
        uploadDocForm.file_url.split("/").pop() ??
        "document";
      logHistory("document-uploaded", { document_id: docId, filename });
      fetchActivity();
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploadDocLoading(false);
    }
  };

  const genAI = async (doc: ComplianceDocument) => {
    setAiLoading(doc.id);
    try {
      const r = await axiosInstance.patch(
        `/compliance-documents/ai_summary/${doc.id}`,
      );
      toast.success("AI summary generated");
      setDocuments((p) =>
        p.map((d) =>
          d.id === doc.id
            ? { ...d, ai_summary: r.data?.response?.ai_summary }
            : d,
        ),
      );
      logHistory("ai-summary", { document_id: doc.id });
      fetchActivity();
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
      toast.error("Failed to generate AI summary");
    } finally {
      setAiLoading(null);
    }
  };

  const handleAttachDocToLicense = async () => {
    if (!selectedLicense) return;
    setAttachDocLoading(true);
    try {
      let docId = selectedExistingDocId;
      let docFilename = documents.find((d) => d.id === docId)?.filename ?? "";

      if (attachMode === "upload") {
        if (!uploadDocFile) {
          toast.error("Please select a file");
          setAttachDocLoading(false);
          return;
        }
        const fd = new FormData();
        fd.append("user_id", userId as string);
        fd.append("document_type", uploadDocForm.document_type || "Other");
        fd.append("filename", uploadDocFile);
        const res = await axiosInstance.post(
          "/compliance-documents/create",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        docId =
          res.data?.response?.uuid ??
          res.data?.response?.id ??
          res.data?.uuid ??
          res.data?.id;
        docFilename = uploadDocFile.name;
        logHistory("document-uploaded", {
          document_id: docId,
          filename: docFilename,
        });
      }

      if (!docId) {
        toast.error("No document selected");
        setAttachDocLoading(false);
        return;
      }

      await axiosInstance.put(
        `/compliance-licensing/${selectedLicense.id}/attach-document/${docId}`,
      );
      toast.success("Document attached to license");
      setIsAttachDocOpen(false);
      setSelectedExistingDocId("");
      setUploadDocFile(null);
      fetchLicenses();
      fetchDocuments();
      fetchActivity();
    } catch (error) {
      console.error("Failed to attach document:", error);
      toast.error("Failed to attach document");
    } finally {
      setAttachDocLoading(false);
    }
  };

  const handleAttachDocToSelectedLicense = async () => {
    if (!selectedDoc || !selectedExistingLicId) {
      toast.error("Please select a license");
      return;
    }
    setAttachToLicLoading(true);
    try {
      await axiosInstance.put(
        `/compliance-licensing/${selectedExistingLicId}/attach-document/${selectedDoc.id}`,
      );
      toast.success("Document attached to license");
      setIsAttachToLicenseOpen(false);
      setSelectedExistingLicId("");
      fetchLicenses();
      fetchActivity();
    } catch (error) {
      console.error("Failed to attach document:", error);
      toast.error("Failed to attach document");
    } finally {
      setAttachToLicLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Delete this document? This action cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/compliance-documents/delete/${id}`);
      toast.success("Document deleted");
      setDocuments((p) => p.filter((d) => d.id !== id));
      fetchActivity();
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    }
  };

  //////////////////////////////////////////
  // Handle Set Reminder
  /////////////////////////////////////////
  const handleSetReminder = async () => {
    if (!reminderForm.license_id) {
      toast.error("Please select a license");
      return;
    }

    const license = licenses.find((l) => l.id === reminderForm.license_id);
    if (!license) {
      toast.error("Selected license not found");
      return;
    }

    setReminderLoading(true);
    try {
      const payload = {
        user_id: userId,
        title: `${license.license_type} Renewal Reminder`,
        description: `Reminder for license ${license.license_number} (${license.license_type}) expiring on ${fmtDate(license.expiry_date)}. Notify ${reminderForm.notify_before} days before expiry.`,
        type: "License" as const,
        reminder_date: license.expiry_date,
        notify_before: parseInt(reminderForm.notify_before, 10),
        notify_channels: reminderForm.notify_channels,
        recurrence_rule: "none" as const, // always none — not user-configurable
        status: "pending" as const,
      };

      await axiosInstance.post("/ai_reminder/create", payload);

      toast.success("Reminder set successfully");
      setIsReminderOpen(false);
      // Reset reminder form
      setReminderForm({
        license_id: "",
        notify_before: "30",
        notify_channels: { email: true, whatsapp: false, push: true },
      });
      fetchActivity();
    } catch (error) {
      console.error("Failed to set reminder:", error);
      toast.error("Failed to set reminder");
    } finally {
      setReminderLoading(false);
    }
  };

  ////////////////////////////////////////////
  // Calculate Stats
  //////////////////////////////////////////////
  const expiringSoon = licenses.filter((l) => {
    const d = getDaysRemaining(l.expiry_date);
    return d > 0 && d <= 60;
  }).length;
  const verifiedDocs = documents.filter((d) => d.is_verified).length;
  const activeLicenses = licenses.filter((l) => l.status === "active").length;

  const statsData = [
    {
      icon: <FileBadge />,
      iconBg: "bg-status-info-bg",
      iconColor: "text-status-info",
      badgeText: `${activeLicenses} Active`,
      badgeBg: "bg-status-info-bg",
      badgeColor: "text-status-info-text",
      title: "Total Licenses",
      value: String(licenses.length),
      subtitle: "Across all entities",
    },
    {
      icon: <AlertTriangle />,
      iconBg: "bg-status-warning-bg",
      iconColor: "text-status-warning",
      badgeText: "Action needed",
      badgeBg: "bg-status-warning-bg",
      badgeColor: "text-status-warning-text",
      title: "Expiring Soon",
      value: String(expiringSoon),
      subtitle: "Within 60 days",
    },
    {
      icon: <FileText />,
      iconBg: "bg-brand-light",
      iconColor: "text-secondary",
      badgeText: `${verifiedDocs} Verified`,
      badgeBg: "bg-brand-light",
      badgeColor: "text-secondary",
      title: "Documents",
      value: String(documents.length),
      subtitle: "Total uploaded",
    },
    {
      icon: <TrendingUp />,
      iconBg: "bg-status-success-bg",
      iconColor: "text-status-success",
      badgeText: "AI Active",
      badgeBg: "bg-status-success-bg",
      badgeColor: "text-status-success-text",
      title: "Compliance Score",
      value:
        licenses.length === 0
          ? "—"
          : `${Math.round((activeLicenses / licenses.length) * 100)}%`,
      subtitle: "License health",
      gradient: true,
    },
  ];

  ///////////////////////////////////////////////////
  // ── Render ────────────────────────────────────────────────────────────────
  //////////////////////////////////////////////////////
  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8 bg-bg-base">
        {/* Header */}
        <PageHeader
          title="Compliance & Licensing"
          description="Manage UAE business licenses, compliance documents, and track expiry deadlines"
          showAIBadge={true}
          icon={<Shield size={24} />}
          buttons={[
            {
              text: "Upload Document",
              onClick: () => setIsUploadDocOpen(true),
              icon: <Upload size={18} />,
              className:
                "bg-surface border border-border text-text-primary hover:bg-bg-subtle",
            },
            {
              text: "Add License",
              onClick: () => setIsAddLicenseOpen(true),
              icon: <Plus size={18} />,
            },
          ]}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT ── */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
              {/* Panel title */}
              <div className="px-5 pt-5 pb-2">
                <h2 className="text-lg font-bold text-text-heading">
                  Licensing & Documents
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Manage your business compliance records
                </p>
              </div>

              {/* Tabs */}
              <div className="flex px-2 pt-1">
                {(["licensing", "documents"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all border-b-2 capitalize ${
                      activeTab === tab
                        ? "text-text-heading border-brand"
                        : "text-text-muted border-transparent hover:text-text-primary"
                    }`}
                  >
                    {tab === "licensing" ? (
                      <FileBadge className="w-4 h-4" />
                    ) : (
                      <FolderOpen className="w-4 h-4" />
                    )}
                    {tab === "licensing" ? "Licenses" : "Documents"}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-brand text-on-brand" : "bg-bg-subtle text-text-muted"}`}
                    >
                      {tab === "licensing" ? licenses.length : documents.length}
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border" />

              {/* ── Licensing Tab ── */}
              {activeTab === "licensing" && (
                <div className="p-5">
                  {licenses.length > 0 && (
                    <div className="flex items-center gap-3 mb-5">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          placeholder="Search licenses..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-muted border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 text-sm bg-bg-muted border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="renewal_pending">Renewal Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  )}

                  {licensesLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <LoadingSpinner size="w-7 h-7" />
                    </div>
                  ) : licenses.length === 0 ? (
                    <EmptyState
                      icon={FileBadge}
                      title="No licenses yet"
                      description="Add your first UAE business license to get started"
                      ctaLabel="Add License"
                      onCTAClick={() => setIsAddLicenseOpen(true)}
                    />
                  ) : filteredLicenses.length === 0 ? (
                    <EmptyState
                      icon={Search}
                      title="No matches found"
                      description="Try adjusting your search or filter"
                    />
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {filteredLicenses.map((lic) => (
                        <LicenseCard
                          key={lic.id}
                          license={lic}
                          attachedDocument={getAttachedDocument(lic)}
                          onViewDetails={() =>
                            router.push(
                              `/dashboard/compliance-licensing/licenses/${lic.id}`,
                            )
                          }
                          onEdit={() => openEditLicense(lic)}
                          onDelete={() => handleDeleteLicense(lic.id)}
                          onAttachDocument={() => {
                            setSelectedLicense(lic);
                            setAttachMode("upload");
                            setUploadDocFile(null);
                            setUploadDocForm({
                              document_type: "",
                              file_url: "",
                            });
                            setSelectedExistingDocId("");
                            setIsAttachDocOpen(true);
                          }}
                          onChangeDocument={() => {
                            setSelectedLicense(lic);
                            setAttachMode("select");
                            setUploadDocFile(null);
                            setUploadDocForm({
                              document_type: "",
                              file_url: "",
                            });
                            setSelectedExistingDocId("");
                            setIsAttachDocOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Documents Tab ── */}
              {activeTab === "documents" && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-text-muted">
                      {documents.length} document
                      {documents.length !== 1 ? "s" : ""}
                    </p>
                    <button
                      onClick={() => setIsUploadDocOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:text-text-heading bg-bg-subtle hover:bg-bg-muted px-3 py-1.5 rounded-lg border border-border transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Upload New
                    </button>
                  </div>

                  {docsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <LoadingSpinner size="w-7 h-7" />
                    </div>
                  ) : documents.length === 0 ? (
                    <EmptyState
                      icon={FileText}
                      title="No documents yet"
                      description="Upload compliance documents to manage them here"
                      ctaLabel="Upload Document"
                      onCTAClick={() => setIsUploadDocOpen(true)}
                    />
                  ) : (
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-4 p-4 border border-border rounded-xl hover:border-border-strong hover:bg-bg-subtle/40 transition-all"
                        >
                          <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="font-semibold text-text-heading text-sm truncate">
                                {doc.filename}
                              </span>
                              {doc.is_verified && (
                                <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-status-success-bg text-status-success-text text-xs rounded-full border border-status-success-border">
                                  <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                              )}
                              {doc.is_rejected && (
                                <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-status-error-bg text-status-error-text text-xs rounded-full border border-status-error-border">
                                  <X className="w-3 h-3" /> Rejected
                                </span>
                              )}
                              {doc.ai_summary && (
                                <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-brand-light text-secondary text-xs rounded-full border border-secondary-light">
                                  <Sparkles className="w-3 h-3" /> AI Summary
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-text-muted">
                              <span>{doc.document_type}</span>
                              <span>·</span>
                              <span>{fmtDate(doc.created_at)}</span>
                            </div>
                          </div>
                          {aiLoading === doc.id ? (
                            <LoadingSpinner size="w-4 h-4" />
                          ) : (
                            <ActionMenu
                              items={[
                                {
                                  icon: <Sparkles className="w-4 h-4" />,
                                  label: "Generate AI Summary",
                                  onClick: () => genAI(doc),
                                },
                                {
                                  icon: <Link2 className="w-4 h-4" />,
                                  label: "Attach to License",
                                  onClick: () => {
                                    setSelectedDoc(doc);
                                    setSelectedExistingLicId("");
                                    setIsAttachToLicenseOpen(true);
                                  },
                                },
                                {
                                  icon: <Download className="w-4 h-4" />,
                                  label: "Download",
                                  onClick: () => window.open(doc.file_url),
                                },
                                {
                                  icon: <span />,
                                  label: "---",
                                  onClick: () => {},
                                },
                                {
                                  icon: <Trash2 className="w-4 h-4" />,
                                  label: "Delete Document",
                                  onClick: () => handleDeleteDocument(doc.id),
                                  danger: true,
                                },
                              ]}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-5">
            <ComplianceHealthBar licenses={licenses} />
            <QuickActions
              onAddLicense={() => setIsAddLicenseOpen(true)}
              onUploadDoc={() => setIsUploadDocOpen(true)}
              onSetReminder={() => setIsReminderOpen(true)}
            />
            <UpcomingDeadlines
              licenses={licenses}
              onLicenseClick={(id) =>
                router.push(`/dashboard/compliance-licensing/licenses/${id}`)
              }
            />
            <ActivityTimeline activity={activity} loading={activityLoading} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          ADD LICENSE MODAL
      ═══════════════════════════════════════════ */}
      <Modal
        isOpen={isAddLicenseOpen}
        onClose={() => setIsAddLicenseOpen(false)}
        title="Add New License"
        showCloseButton
        closeOnOverlayClick
        size="md"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              License Type <span className="text-status-error">*</span>
            </label>
            <select
              className={selectCls}
              value={addForm.license_type}
              onChange={(e) =>
                setAddForm({ ...addForm, license_type: e.target.value })
              }
            >
              <option value="">Select license type</option>
              {LICENSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {addFormErrors.license_type && (
              <p className="text-xs text-status-error-text mt-1">
                {addFormErrors.license_type}
              </p>
            )}
          </div>
          <InputField
            label="License Number"
            name="license_number"
            required
            value={addForm.license_number}
            placeholder="e.g. CN-123456789"
            onChange={(e) =>
              setAddForm({ ...addForm, license_number: e.target.value })
            }
            error={addFormErrors.license_number}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Issue Date"
              name="issue_date"
              type="date"
              required
              value={addForm.issue_date}
              onChange={(e) =>
                setAddForm({ ...addForm, issue_date: e.target.value })
              }
              error={addFormErrors.issue_date}
            />
            <InputField
              label="Expiry Date"
              name="expiry_date"
              type="date"
              required
              value={addForm.expiry_date}
              onChange={(e) =>
                setAddForm({ ...addForm, expiry_date: e.target.value })
              }
              error={addFormErrors.expiry_date}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsAddLicenseOpen(false)}
              className="px-5 py-2.5 border border-border text-text-primary text-sm font-semibold rounded-lg hover:bg-bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddLicense}
              disabled={addFormLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-on-brand text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {addFormLoading && (
                <LoadingSpinner size="w-4 h-4" color="border-on-brand" />
              )}
              Add License
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════
          EDIT LICENSE MODAL
      ═══════════════════════════════════════════ */}
      <Modal
        isOpen={isEditLicenseOpen}
        onClose={() => setIsEditLicenseOpen(false)}
        title="Edit License"
        showCloseButton
        closeOnOverlayClick
        size="md"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              License Type <span className="text-status-error">*</span>
            </label>
            <select
              className={selectCls}
              value={editForm.license_type}
              onChange={(e) =>
                setEditForm({ ...editForm, license_type: e.target.value })
              }
            >
              <option value="">Select license type</option>
              {LICENSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {editFormErrors.license_type && (
              <p className="text-xs text-status-error-text mt-1">
                {editFormErrors.license_type}
              </p>
            )}
          </div>
          <InputField
            label="License Number"
            name="license_number"
            required
            value={editForm.license_number}
            onChange={(e) =>
              setEditForm({ ...editForm, license_number: e.target.value })
            }
            error={editFormErrors.license_number}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Issue Date"
              name="issue_date"
              type="date"
              required
              value={editForm.issue_date}
              onChange={(e) =>
                setEditForm({ ...editForm, issue_date: e.target.value })
              }
              error={editFormErrors.issue_date}
            />
            <InputField
              label="Expiry Date"
              name="expiry_date"
              type="date"
              required
              value={editForm.expiry_date}
              onChange={(e) =>
                setEditForm({ ...editForm, expiry_date: e.target.value })
              }
              error={editFormErrors.expiry_date}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsEditLicenseOpen(false)}
              className="px-5 py-2.5 border border-border text-text-primary text-sm font-semibold rounded-lg hover:bg-bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditLicense}
              disabled={editFormLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-on-brand text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {editFormLoading && (
                <LoadingSpinner size="w-4 h-4" color="border-on-brand" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════
          UPLOAD DOCUMENT MODAL
      ═══════════════════════════════════════════ */}
      <Modal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        title="Upload Document"
        showCloseButton
        closeOnOverlayClick
        size="md"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Document Type <span className="text-status-error">*</span>
            </label>
            <select
              className={selectCls}
              value={uploadDocForm.document_type}
              onChange={(e) =>
                setUploadDocForm({
                  ...uploadDocForm,
                  document_type: e.target.value,
                })
              }
            >
              <option value="">Select document type</option>
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Upload File <span className="text-status-error">*</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${uploadDocFile ? "border-status-success bg-status-success-bg" : "border-border hover:border-border-focus hover:bg-bg-subtle"}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${uploadDocFile ? "bg-status-success-bg" : "bg-bg-subtle"}`}
              >
                {uploadDocFile ? (
                  <FileCheck className="w-6 h-6 text-status-success" />
                ) : (
                  <Upload className="w-6 h-6 text-text-muted" />
                )}
              </div>
              {uploadDocFile ? (
                <>
                  <p className="text-sm font-semibold text-text-heading">
                    {uploadDocFile.name}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {(uploadDocFile.size / 1024).toFixed(1)} KB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-text-primary">
                    Drop file here or click to browse
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setUploadDocFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsUploadDocOpen(false)}
              className="px-5 py-2.5 border border-border text-text-primary text-sm font-semibold rounded-lg hover:bg-bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadDocument}
              disabled={uploadDocLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-on-brand text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {uploadDocLoading && (
                <LoadingSpinner size="w-4 h-4" color="border-on-brand" />
              )}
              Upload Document
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════
          ATTACH DOC TO LICENSE
      ═══════════════════════════════════════════ */}
      <Modal
        isOpen={isAttachDocOpen}
        onClose={() => setIsAttachDocOpen(false)}
        title={`Attach Document — ${selectedLicense?.license_type ?? ""}`}
        showCloseButton
        closeOnOverlayClick
        size="md"
      >
        <div className="p-6 space-y-4">
          <ModeToggle mode={attachMode} onChange={setAttachMode} />
          {attachMode === "upload" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Document Type
                </label>
                <select
                  className={selectCls}
                  value={uploadDocForm.document_type}
                  onChange={(e) =>
                    setUploadDocForm({
                      ...uploadDocForm,
                      document_type: e.target.value,
                    })
                  }
                >
                  <option value="">Select type</option>
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div
                onClick={() => fileRef2.current?.click()}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${uploadDocFile ? "border-status-success bg-status-success-bg" : "border-border hover:border-border-focus hover:bg-bg-subtle"}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${uploadDocFile ? "bg-status-success-bg" : "bg-bg-subtle"}`}
                >
                  {uploadDocFile ? (
                    <FileCheck className="w-5 h-5 text-status-success" />
                  ) : (
                    <Upload className="w-5 h-5 text-text-muted" />
                  )}
                </div>
                {uploadDocFile ? (
                  <p className="text-sm font-semibold text-text-heading">
                    {uploadDocFile.name}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-text-primary">
                    Drop file here or click to browse
                  </p>
                )}
                <p className="text-xs text-text-muted mt-1">
                  PDF, JPG, PNG up to 10MB
                </p>
                <input
                  ref={fileRef2}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setUploadDocFile(e.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-text-secondary mb-3">
                Select from your existing documents
              </p>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {documents.length === 0 ? (
                  <p className="text-xs text-text-muted text-center py-4">
                    No documents available
                  </p>
                ) : (
                  documents.map((doc) => (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedExistingDocId === doc.id ? "border-secondary bg-brand-light" : "border-border hover:border-border-strong"}`}
                    >
                      <input
                        type="radio"
                        name="existingDoc"
                        value={doc.id}
                        className="accent-secondary"
                        checked={selectedExistingDocId === doc.id}
                        onChange={() => setSelectedExistingDocId(doc.id)}
                      />
                      <FileText className="w-4 h-4 text-secondary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-heading truncate">
                          {doc.filename}
                        </p>
                        <p className="text-xs text-text-muted">
                          {doc.document_type}
                        </p>
                      </div>
                      {doc.is_verified && (
                        <CheckCircle className="w-4 h-4 text-status-success shrink-0" />
                      )}
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsAttachDocOpen(false)}
              className="px-5 py-2.5 border border-border text-text-primary text-sm font-semibold rounded-lg hover:bg-bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAttachDocToLicense}
              disabled={attachDocLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-on-brand text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {attachDocLoading && (
                <LoadingSpinner size="w-4 h-4" color="border-on-brand" />
              )}
              {attachMode === "upload" ? "Upload & Attach" : "Attach Document"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════
          ATTACH TO LICENSE (from document card)
      ═══════════════════════════════════════════ */}
      <Modal
        isOpen={isAttachToLicenseOpen}
        onClose={() => setIsAttachToLicenseOpen(false)}
        title={`Attach to License — ${selectedDoc?.filename ?? ""}`}
        showCloseButton
        closeOnOverlayClick
        size="md"
      >
        <div className="p-6 space-y-3">
          <p className="text-sm text-text-secondary mb-4">
            Select the license to attach this document to
          </p>
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {licenses.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">
                No licenses available
              </p>
            ) : (
              licenses.map((lic) => {
                const statusCfg = getLicenseStatusConfig(lic.status);
                return (
                  <label
                    key={lic.id}
                    className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${selectedExistingLicId === lic.id ? "border-secondary bg-brand-light" : "border-border hover:border-border-strong"}`}
                  >
                    <input
                      type="radio"
                      name="attachLicense"
                      value={lic.id}
                      className="accent-secondary"
                      checked={selectedExistingLicId === lic.id}
                      onChange={() => setSelectedExistingLicId(lic.id)}
                    />
                    <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4 text-on-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-heading">
                        {lic.license_type}
                      </p>
                      <p className="text-xs text-text-muted font-mono">
                        {lic.license_number}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold shrink-0 ${statusCfg.badge}`}
                    >
                      {statusCfg.label}
                    </span>
                  </label>
                );
              })
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsAttachToLicenseOpen(false)}
              className="px-5 py-2.5 border border-border text-text-primary text-sm font-semibold rounded-lg hover:bg-bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAttachDocToSelectedLicense}
              disabled={attachToLicLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-on-brand text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {attachToLicLoading && (
                <LoadingSpinner size="w-4 h-4" color="border-on-brand" />
              )}
              Attach Document
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════
          SET REMINDER MODAL
          POST /ai_reminder/create
          Maps license → AiReminder entity fields
      ═══════════════════════════════════════════ */}
      <Modal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        title="Set Renewal Reminder"
        showCloseButton
        closeOnOverlayClick
        size="md"
      >
        <div className="p-6 space-y-4">
          {/* Info banner */}
          <div className="p-4 bg-status-warning-bg border border-status-warning-border rounded-xl flex items-start gap-3">
            <Bell className="w-4 h-4 text-status-warning mt-0.5 shrink-0" />
            <p className="text-xs text-status-warning-text">
              Get notified before your license expires so you never miss a
              renewal deadline.
            </p>
          </div>

          {/* License selector */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              License <span className="text-status-error">*</span>
            </label>
            <select
              className={selectCls}
              value={reminderForm.license_id}
              onChange={(e) =>
                setReminderForm({ ...reminderForm, license_id: e.target.value })
              }
            >
              <option value="">Select a license</option>
              {licenses.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.license_type} — {l.license_number}
                </option>
              ))}
            </select>
            {/* Show expiry of the selected license as a helper */}
            {reminderForm.license_id && (
              <p className="text-xs text-text-muted mt-1.5">
                Expiry:{" "}
                <span className="font-semibold text-text-primary">
                  {fmtDate(
                    licenses.find((l) => l.id === reminderForm.license_id)
                      ?.expiry_date,
                  )}
                </span>
              </p>
            )}
          </div>

          {/* Notify before (days) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Notify me before expiry
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["7", "14", "30", "60"].map((d) => (
                <button
                  key={d}
                  onClick={() =>
                    setReminderForm({ ...reminderForm, notify_before: d })
                  }
                  className={`py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                    reminderForm.notify_before === d
                      ? "bg-brand text-on-brand border-brand"
                      : "bg-surface text-text-secondary border-border hover:border-border-strong hover:text-text-primary"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Notification channels */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Notification Channels
            </label>
            <div className="space-y-2.5">
              {(
                [
                  { key: "email", label: "Email" },
                  { key: "whatsapp", label: "WhatsApp" },
                  { key: "push", label: "Push Notification" },
                ] as const
              ).map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div
                    onClick={() =>
                      setReminderForm({
                        ...reminderForm,
                        notify_channels: {
                          ...reminderForm.notify_channels,
                          [key]: !reminderForm.notify_channels[key],
                        },
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                      reminderForm.notify_channels[key]
                        ? "bg-brand"
                        : "bg-bg-subtle border border-border"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-on-brand rounded-full shadow-card absolute top-0.5 transition-transform ${
                        reminderForm.notify_channels[key]
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-text-primary">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsReminderOpen(false)}
              className="px-5 py-2.5 border border-border text-text-primary text-sm font-semibold rounded-lg hover:bg-bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSetReminder}
              disabled={reminderLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent text-on-accent text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-60"
            >
              {reminderLoading && (
                <LoadingSpinner size="w-4 h-4" color="border-on-accent" />
              )}
              <Bell className="w-4 h-4" /> Set Reminder
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
