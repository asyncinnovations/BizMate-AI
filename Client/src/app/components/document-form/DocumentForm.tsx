"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Save,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  Upload,
  Image,
} from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import PageHeader from "@/app/components/page-header/PageHeader";
import { documentConfigs } from "@/app/config/documentConfigs";
import ProtectedRoute from "@/app/components/protected-route/ProtectedRoute";
import Modal from "@/app/components/ui/Modal";
import toast from "react-hot-toast";
import Card from "@/app/components/ui/Card";

interface FieldConfig {
  id: string;
  label: string;
  type: "text" | "email" | "date" | "number" | "textarea" | "select" | "file";
  placeholder?: string;
  required: boolean;
  aiSuggestion?: string;
  helpText?: string;
  options?: string[];
  isCustomAdded?: boolean;
}

export default function DocumentForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const documentType = params?.type as string;
  const promptFromUrl = searchParams?.get("prompt") || "";

  const isCustomTemplate = !!promptFromUrl;

  const [isGenerating, setIsGenerating] = useState<boolean>(isCustomTemplate);
  const [aiProcessing, setAiProcessing] = useState<boolean>(false);
  const [savedDraft, setSavedDraft] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [templateName, setTemplateName] = useState<string>("");
  const [templateDescription, setTemplateDescription] = useState<string>("");
  const [hasAutoFilled, setHasAutoFilled] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Add Field Modal States
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] =
    useState<boolean>(false);
  const [newFieldLabel, setNewFieldLabel] = useState<string>("");
  const [newFieldType, setNewFieldType] = useState<string>("text");
  const [newFieldRequired, setNewFieldRequired] = useState<boolean>(false);
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState<string>("");
  const [newFieldOptions, setNewFieldOptions] = useState<string>("");

  // Edit Field Modal States
  const [isEditFieldModalOpen, setIsEditFieldModalOpen] =
    useState<boolean>(false);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [editFieldLabel, setEditFieldLabel] = useState<string>("");
  const [editFieldRequired, setEditFieldRequired] = useState<boolean>(false);

  // Header fields configuration
  const headerFields: FieldConfig[] = [
    {
      id: "formName",
      label: "Form Name",
      type: "text",
      placeholder: "e.g., Contract Form, Employment Agreement, NDA",
      required: true,
      helpText: "This will be displayed as the main title of your document",
    },
    {
      id: "documentTitle",
      label: "Document Title",
      type: "text",
      placeholder: "e.g., Service Agreement, Employment Contract",
      required: false,
      helpText: "Specific title for this document instance",
    },
  ];

  // Footer fields configuration
  const footerFields: FieldConfig[] = [
    {
      id: "preparedBy",
      label: "Prepared By",
      type: "text",
      placeholder: "Name of person/organization who prepared this document",
      required: false,
    },
    {
      id: "reviewedBy",
      label: "Reviewed By",
      type: "text",
      placeholder: "Name of reviewer",
      required: false,
    },
    {
      id: "approvedBy",
      label: "Approved By",
      type: "text",
      placeholder: "Name of approver",
      required: false,
    },
    {
      id: "effectiveDate",
      label: "Effective Date",
      type: "date",
      placeholder: "When this document becomes effective",
      required: false,
    },
    {
      id: "expiryDate",
      label: "Expiry Date",
      type: "date",
      placeholder: "When this document expires (if applicable)",
      required: false,
    },
    {
      id: "footerNotes",
      label: "Footer Notes",
      type: "textarea",
      placeholder:
        "Any additional notes, disclaimers, or important information to display in footer",
      required: false,
      helpText: "This text will appear at the bottom of each page",
    },
    {
      id: "confidentialityLevel",
      label: "Confidentiality Level",
      type: "select",
      placeholder: "Select confidentiality level",
      required: false,
      options: [
        "Public",
        "Internal Use",
        "Confidential",
        "Strictly Confidential",
      ],
    },
  ];

  // Get current configuration based on template type
  const getCurrentConfig = () => {
    if (isCustomTemplate) {
      return {
        title: templateName,
        description: templateDescription,
        fields: fields,
      };
    }
    return documentConfigs[documentType] || documentConfigs["nda"];
  };

  const currentConfig = getCurrentConfig();

  useEffect(() => {
    if (isCustomTemplate) {
      generateTemplateFromPrompt();
    } else {
      initializeStandardTemplate();
    }
  }, [documentType, promptFromUrl]);

  const generateTemplateFromPrompt = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const decodedPrompt = decodeURIComponent(promptFromUrl);

    // Mock AI-generated template based on prompt
    const generatedTemplate = {
      name: "Custom Business Agreement",
      description: `AI-generated template based on: "${decodedPrompt.substring(
        0,
        100
      )}${decodedPrompt.length > 100 ? "..." : ""}"`,
      fields: [
        {
          id: "partyAName",
          label: "First Party Name",
          type: "text" as const,
          placeholder: "Enter first party legal name",
          required: true,
          aiSuggestion: "Auto-filled from profile",
          helpText: "Legal name of the first party in this agreement",
        },
        {
          id: "partyAAddress",
          label: "First Party Address",
          type: "text" as const,
          placeholder: "Enter complete address",
          required: true,
          helpText: "Complete registered business address",
        },
        {
          id: "partyBName",
          label: "Second Party Name",
          type: "text" as const,
          placeholder: "Enter second party legal name",
          required: true,
        },
        {
          id: "partyBAddress",
          label: "Second Party Address",
          type: "text" as const,
          placeholder: "Enter complete address",
          required: true,
        },
        {
          id: "agreementDate",
          label: "Agreement Date",
          type: "date" as const,
          placeholder: "Select date",
          required: true,
          aiSuggestion: "Today's date",
        },
        {
          id: "effectiveDate",
          label: "Effective Date",
          type: "date" as const,
          placeholder: "Select effective date",
          required: true,
        },
        {
          id: "agreementTerm",
          label: "Agreement Term",
          type: "select" as const,
          placeholder: "Select term duration",
          required: true,
          options: [
            "6 Months",
            "1 Year",
            "2 Years",
            "3 Years",
            "5 Years",
            "Indefinite",
          ],
        },
        {
          id: "purpose",
          label: "Purpose of Agreement",
          type: "textarea" as const,
          placeholder: "Describe the purpose and scope of this agreement",
          required: true,
          helpText:
            "Clearly define what this agreement covers and its objectives",
        },
        {
          id: "compensation",
          label: "Compensation Details",
          type: "textarea" as const,
          placeholder: "Describe payment terms and amounts",
          required: true,
        },
        {
          id: "paymentTerms",
          label: "Payment Terms",
          type: "textarea" as const,
          placeholder: "Specify payment schedule and methods",
          required: true,
          helpText: "Include due dates, payment methods, and late fees",
        },
        {
          id: "terminationClause",
          label: "Termination Conditions",
          type: "textarea" as const,
          placeholder: "Describe conditions for termination",
          required: true,
        },
        {
          id: "governingLaw",
          label: "Governing Law",
          type: "select" as const,
          placeholder: "Select jurisdiction",
          required: true,
          options: [
            "UAE Federal Law",
            "Dubai International Financial Centre (DIFC)",
            "Abu Dhabi Global Market (ADGM)",
            "Other",
          ],
        },
      ],
    };

    setTemplateName(generatedTemplate.name);
    setTemplateDescription(generatedTemplate.description);
    setFields(generatedTemplate.fields);

    // Auto-fill header fields
    const autoFillData: Record<string, string> = {};
    headerFields.forEach((field) => {
      if (field.id === "formName") {
        autoFillData[field.id] = generatedTemplate.name;
      }
      if (field.id === "documentTitle") {
        autoFillData[field.id] = `${generatedTemplate.name} Document`;
      }
    });

    // Auto-fill footer fields
    footerFields.forEach((field) => {
      if (field.id === "effectiveDate") {
        autoFillData[field.id] = new Date().toISOString().split("T")[0];
      }
      if (field.id === "confidentialityLevel") {
        autoFillData[field.id] = "Confidential";
      }
    });

    setFormData(autoFillData);
    setIsGenerating(false);
  };

  const initializeStandardTemplate = () => {
    // Initialize fields from current config
    setFields(currentConfig.fields);

    // Simulate AI auto-fill for certain fields
    const autoFillData: Record<string, string> = {};

    // Auto-fill header fields
    headerFields.forEach((field) => {
      if (field.id === "formName") {
        autoFillData[field.id] = currentConfig.title;
      }
      if (field.id === "documentTitle") {
        autoFillData[field.id] = `${currentConfig.title} Document`;
      }
    });

    // Auto-fill main fields
    currentConfig.fields.forEach((field) => {
      if (field.aiSuggestion) {
        if (
          field.id.includes("employer") ||
          field.id.includes("company") ||
          field.id.includes("disclosingParty") ||
          field.id.includes("serviceProvider")
        ) {
          autoFillData[field.id] = "Tech Solutions LLC";
        }
        if (field.id === "employerLicense") {
          autoFillData[field.id] = "123456";
        }
        if (field.id === "invoiceNumber") {
          autoFillData[field.id] = "INV-2024-0157";
        }
      }
    });

    // Auto-fill footer fields
    footerFields.forEach((field) => {
      if (field.id === "effectiveDate") {
        autoFillData[field.id] = new Date().toISOString().split("T")[0];
      }
      if (field.id === "confidentialityLevel") {
        autoFillData[field.id] = "Confidential";
      }
    });

    setFormData(autoFillData);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate header fields
    headerFields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is Required`;
      }
    });

    // Validate main fields
    fields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is Required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2000);
  };

  const handleAutoFillAll = async () => {
    setAiProcessing(true);
    // Simulate AI processing for all fields
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));

    const autoFillData: Record<string, string> = {};

    if (isCustomTemplate) {
      // Custom template auto-fill logic
      autoFillData.formName = templateName;
      autoFillData.documentTitle = `${templateName} - ${new Date().getFullYear()}`;

      // Main fields for custom template
      autoFillData.partyAName = "Tech Solutions LLC";
      autoFillData.partyAAddress =
        "Dubai Internet City, Building 5, Office 203, Dubai, UAE";
      autoFillData.partyBName = "Client Corporation FZE";
      autoFillData.partyBAddress = "Business Bay, Downtown Dubai, UAE";
      autoFillData.agreementDate = new Date().toISOString().split("T")[0];
      autoFillData.effectiveDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];
      autoFillData.agreementTerm = "1 Year";
      autoFillData.purpose =
        "This agreement establishes the terms and conditions for a business partnership between the parties for the purpose of collaborative software development and technology consulting services in the UAE market.";
      autoFillData.compensation =
        "Total project value of AED 150,000, payable in three installments: 40% upon signing, 30% upon milestone completion, and 30% upon final delivery.";
      autoFillData.paymentTerms =
        "Payment to be made within 15 days of invoice via bank transfer. Late payments will incur 2% monthly interest.";
      autoFillData.terminationClause =
        "Either party may terminate this agreement with 30 days written notice. In case of material breach, immediate termination is allowed.";
      autoFillData.governingLaw = "UAE Federal Law";
    } else {
      // Standard template auto-fill logic
      headerFields.forEach((field) => {
        if (field.id === "formName") {
          autoFillData[field.id] = currentConfig.title;
        } else if (field.id === "documentTitle") {
          autoFillData[field.id] = `${
            currentConfig.title
          } - ${new Date().getFullYear()}`;
        }
      });

      // Auto-fill main fields
      fields.forEach((field) => {
        if (field.type === "textarea") {
          if (field.id === "purpose") {
            autoFillData[field.id] =
              "Discussion of potential business partnership and exchange of proprietary technical information.";
          } else if (field.id === "benefits") {
            autoFillData[field.id] =
              "Medical insurance, annual air ticket, housing allowance, performance bonus";
          } else if (field.id === "description") {
            autoFillData[field.id] =
              "Software development and consulting services as per project scope defined in attached Statement of Work.";
          } else if (field.id === "paymentTerms") {
            autoFillData[field.id] =
              "Payment to be made within 30 days via bank transfer. Late payments will incur 2% monthly interest.";
          } else {
            autoFillData[
              field.id
            ] = `AI-generated content for ${field.label}. This text has been automatically filled based on standard industry practices.`;
          }
        } else if (field.type === "select") {
          autoFillData[field.id] = field.options?.[0] || "";
        } else if (field.type === "date") {
          autoFillData[field.id] = new Date().toISOString().split("T")[0];
        } else {
          if (
            field.id.includes("employer") ||
            field.id.includes("company") ||
            field.id.includes("disclosingParty") ||
            field.id.includes("serviceProvider")
          ) {
            autoFillData[field.id] = "Tech Solutions LLC";
          } else if (
            field.id.includes("employee") ||
            field.id.includes("receivingParty") ||
            field.id.includes("client")
          ) {
            autoFillData[field.id] = "John Smith";
          } else if (field.id.includes("address")) {
            autoFillData[field.id] =
              "Dubai Internet City, Building 5, Office 203, Dubai, UAE";
          } else if (
            field.id.includes("license") ||
            field.id.includes("number")
          ) {
            autoFillData[field.id] = "123456";
          } else if (field.id.includes("email")) {
            autoFillData[field.id] = "contact@techsolutions.ae";
          } else if (field.id.includes("phone")) {
            autoFillData[field.id] = "+971-50-123-4567";
          } else if (
            field.id.includes("salary") ||
            field.id.includes("amount") ||
            field.id.includes("value")
          ) {
            autoFillData[field.id] = "15000";
          } else {
            autoFillData[field.id] = `Auto-filled ${field.label}`;
          }
        }
      });
    }

    // Auto-fill footer fields (common for both)
    footerFields.forEach((field) => {
      if (field.type === "date") {
        if (field.id === "effectiveDate") {
          autoFillData[field.id] = new Date().toISOString().split("T")[0];
        } else if (field.id === "expiryDate") {
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          autoFillData[field.id] = nextYear.toISOString().split("T")[0];
        }
      } else if (field.type === "select") {
        autoFillData[field.id] = field.options?.[0] || "";
      } else if (field.type === "textarea") {
        autoFillData[
          field.id
        ] = `This document has been prepared in accordance with standard practices and should be reviewed by legal counsel before execution.`;
      } else {
        if (field.id.includes("By")) {
          autoFillData[field.id] = "Legal Department";
        }
      }
    });

    // Also fill any custom fields that might have been added
    fields.forEach((field) => {
      if (!autoFillData[field.id] && field.isCustomAdded) {
        if (field.type === "textarea") {
          autoFillData[
            field.id
          ] = `AI-generated content for ${field.label}. This information has been automatically filled based on standard business practices.`;
        } else if (field.type === "select") {
          autoFillData[field.id] = field.options?.[0] || "";
        } else if (field.type === "date") {
          autoFillData[field.id] = new Date().toISOString().split("T")[0];
        } else {
          autoFillData[field.id] = `Auto-filled ${field.label}`;
        }
      }
    });

    setFormData(autoFillData);
    setHasAutoFilled(true);
    setAiProcessing(false);
  };

  const handleRemoveField = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId));
    setFormData((prev) => {
      const newData = { ...prev };
      delete newData[fieldId];
      return newData;
    });
  };

  const handleOpenAddFieldModal = () => {
    setIsAddFieldModalOpen(true);
  };

  const handleCloseAddFieldModal = () => {
    setIsAddFieldModalOpen(false);
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldRequired(false);
    setNewFieldPlaceholder("");
    setNewFieldOptions("");
  };

  const handleAddNewField = () => {
    if (!newFieldLabel.trim()) return;

    const newField: FieldConfig = {
      id: `custom_${Date.now()}`,
      label: newFieldLabel,
      type: newFieldType as
        | "number"
        | "text"
        | "select"
        | "email"
        | "date"
        | "textarea"
        | "file",
      placeholder:
        newFieldPlaceholder || `Enter ${newFieldLabel.toLowerCase()}`,
      required: newFieldRequired,
      isCustomAdded: true,
      options:
        newFieldType === "select"
          ? newFieldOptions.split(",").map((opt) => opt.trim())
          : undefined,
    };

    setFields((prev) => [...prev, newField]);
    handleCloseAddFieldModal();
  };

  const handleOpenEditFieldModal = (field: FieldConfig) => {
    setEditingField(field);
    setEditFieldLabel(field.label);
    setEditFieldRequired(field.required);
    setIsEditFieldModalOpen(true);
  };

  const handleCloseEditFieldModal = () => {
    setIsEditFieldModalOpen(false);
    setEditingField(null);
    setEditFieldLabel("");
    setEditFieldRequired(false);
  };

  const handleUpdateField = () => {
    if (!editingField || !editFieldLabel.trim()) return;

    setFields((prev) =>
      prev.map((field) =>
        field.id === editingField.id
          ? { ...field, label: editFieldLabel, required: editFieldRequired }
          : field
      )
    );

    handleCloseEditFieldModal();
  };

  const handlePreview = () => {
    if (validateForm()) {
      // Prepare data including logo information
      const previewData = {
        ...formData,
        ...(isCustomTemplate && { templateName, templateDescription }),
        logoFile: logoFile
          ? {
              name: logoFile.name,
              preview: logoPreview,
              size: logoFile.size,
            }
          : null,
      };

      const previewPath = isCustomTemplate
        ? `/dashboard/documents/preview/custom-template?data=${encodeURIComponent(
            JSON.stringify(previewData)
          )}`
        : `/dashboard/documents/preview/${documentType}?data=${encodeURIComponent(
            JSON.stringify(previewData)
          )}`;

      router.push(previewPath);
    }
  };

  const getPageTitle = () => {
    return isCustomTemplate ? templateName : currentConfig.title;
  };

  const getPageDescription = () => {
    return isCustomTemplate ? templateDescription : currentConfig.description;
  };

  if (isGenerating) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen bg-[#F4F7FA] p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] rounded-full mb-6">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-[#1B2A49] mb-2">
                Generating Your Custom Template
              </h2>
              <p className="text-[#344767] mb-6">
                AI is analyzing your requirements and creating a tailored
                document template...
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-[#2E69A4] rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-[#2E69A4] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-[#2E69A4] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-[#F4F7FA] p-4 mb-8">
          {/* Header */}
          <PageHeader
            title={getPageTitle()}
            description={getPageDescription()}
            showAIBadge={true}
            icon={<FileText size={24} />}
            buttons={[
              {
                text: "Back to Templates",
                icon: <ArrowLeft size={20} />,
                onClick: () => router.back(),
              },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card>
                {/* AI Auto-fill Notice */}
                {(hasAutoFilled ||
                  Object.values(formData).some((val) => val)) && (
                  <div className="mb-6 p-4 bg-[#2E69A4]/5 border border-[#2E69A4]/20 rounded-lg flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#2E69A4] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#1B2A49] font-semibold text-sm">
                        {hasAutoFilled
                          ? "AI Auto-fill Complete"
                          : "AI Auto-fill Active"}
                      </p>
                      <p className="text-[#344767] text-sm">
                        {hasAutoFilled
                          ? "All fields have been automatically filled by AI based on your prompt and business profile. Review and edit as needed."
                          : "Some fields have been pre-filled from your business profile. Review and edit as needed."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Add Field and Auto-fill Buttons */}
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#1B2A49]">
                    {isCustomTemplate ? "Template Fields" : "Document Fields"}
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAutoFillAll}
                      disabled={aiProcessing}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F6A821] to-[#FFC107] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm disabled:opacity-50"
                    >
                      {aiProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Auto Fill All
                    </button>
                    <button
                      onClick={handleOpenAddFieldModal}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <form className="space-y-8">
                  {/* Header Section */}
                  <div className="border-b border-[#E1E8F5] pb-6">
                    <h4 className="text-lg font-bold text-[#1B2A49] mb-4 flex items-center gap-2">
                      <Image className="w-5 h-5 text-[#2E69A4]" />
                      Document Header
                    </h4>
                    <div className="space-y-6">
                      {/* Logo Upload Section */}
                      <div className="space-y-3">
                        <label className="block text-[#1B2A49] font-semibold text-sm">
                          Company Logo
                          <span className="text-[#344767] text-xs font-normal ml-2">
                            (Optional - will be displayed in document header)
                          </span>
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              id="logoUpload"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="logoUpload"
                              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-[#E1E8F5] rounded-lg hover:border-[#2E69A4] transition-colors cursor-pointer text-[#344767]"
                            >
                              <Upload className="w-5 h-5" />
                              <span className="font-medium">
                                {logoFile ? "Change Logo" : "Upload Logo"}
                              </span>
                            </label>
                          </div>
                          {logoPreview && (
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 border border-[#E1E8F5] rounded-lg overflow-hidden bg-white">
                                <img
                                  src={logoPreview}
                                  alt="Logo preview"
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={removeLogo}
                                className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                                title="Remove logo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-[#344767] text-xs">
                          Recommended: PNG or JPG, max 5MB. Square images work
                          best.
                        </p>
                      </div>

                      {/* Header Form Fields */}
                      {headerFields.map((field) => (
                        <div
                          key={field.id}
                          className="space-y-3 relative group"
                        >
                          {/* Field Actions */}
                          <div className="flex items-center justify-between">
                            <label className="block text-[#1B2A49] font-semibold text-sm">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleOpenEditFieldModal(field)}
                                className="p-1.5 bg-blue-100 text-[#2E69A4] rounded hover:bg-blue-200 transition-colors"
                                title="Edit field"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveField(field.id)}
                                className="p-1.5 bg-red-100 text-red-500 rounded hover:bg-red-200 transition-colors"
                                title="Remove field"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            {field.type === "textarea" ? (
                              <textarea
                                value={formData[field.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                placeholder={field.placeholder}
                                rows={3}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] resize-none ${
                                  errors[field.id]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              />
                            ) : (
                              <input
                                value={formData[field.id] || ""}
                                type={field.type}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] ${
                                  errors[field.id]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              />
                            )}
                          </div>
                          {field.helpText && (
                            <div className="flex items-start gap-2 text-[#344767] text-xs">
                              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span>{field.helpText}</span>
                            </div>
                          )}
                          {errors[field.id] && (
                            <div className="flex items-center gap-2 text-red-500 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors[field.id]}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Document Fields Section */}
                  <div>
                    <h4 className="text-lg font-bold text-[#1B2A49] mb-4">
                      Document Content
                    </h4>
                    <div className="space-y-6">
                      {fields.map((field) => (
                        <div
                          key={field.id}
                          className="space-y-3 relative group"
                        >
                          {/* Field Actions */}
                          <div className="flex items-center justify-between">
                            <label className="block text-[#1B2A49] font-semibold text-sm">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                              {field.aiSuggestion && (
                                <span className="ml-2 text-[#2E69A4] text-xs font-normal">
                                  ({field.aiSuggestion})
                                </span>
                              )}
                              {field.isCustomAdded && (
                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[#F6A821]/10 text-[#F6A821] text-xs font-medium rounded-full">
                                  <Plus className="w-3 h-3" />
                                  Custom
                                </span>
                              )}
                            </label>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleOpenEditFieldModal(field)}
                                className="p-1.5 bg-blue-100 text-[#2E69A4] rounded hover:bg-blue-200 transition-colors"
                                title="Edit field"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveField(field.id)}
                                className="p-1.5 bg-red-100 text-red-500 rounded hover:bg-red-200 transition-colors"
                                title="Remove field"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            {field.type === "textarea" ? (
                              <textarea
                                value={formData[field.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                placeholder={field.placeholder}
                                rows={4}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] resize-none ${
                                  errors[field.id]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              />
                            ) : field.type === "select" ? (
                              <select
                                value={formData[field.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white ${
                                  errors[field.id]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              >
                                <option value={""}>Select {field.label}</option>
                                {field.options?.map((op) => (
                                  <option key={op} value={op}>
                                    {op}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={formData[field.id] || ""}
                                type={field.type}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] ${
                                  errors[field.id]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              />
                            )}
                          </div>

                          {field.helpText && (
                            <div className="flex items-start gap-2 text-[#344767] text-xs">
                              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span>{field.helpText}</span>
                            </div>
                          )}

                          {errors[field.id] && (
                            <div className="flex items-center gap-2 text-red-500 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors[field.id]}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="border-t border-[#E1E8F5] pt-6">
                    <h4 className="text-lg font-bold text-[#1B2A49] mb-4">
                      Document Footer
                    </h4>
                    <div className="space-y-6">
                      {footerFields.map((field) => (
                        <div
                          key={field.id}
                          className="space-y-3 relative group"
                        >
                          {/* Field Actions */}
                          <div className="flex items-center justify-between">
                            <label className="block text-[#1B2A49] font-semibold text-sm">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleOpenEditFieldModal(field)}
                                className="p-1.5 bg-blue-100 text-[#2E69A4] rounded hover:bg-blue-200 transition-colors"
                                title="Edit field"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveField(field.id)}
                                className="p-1.5 bg-red-100 text-red-500 rounded hover:bg-red-200 transition-colors"
                                title="Remove field"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            {field.type === "textarea" ? (
                              <textarea
                                value={formData[field.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                placeholder={field.placeholder}
                                rows={3}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] resize-none ${
                                  errors[field.id]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              />
                            ) : field.type === "select" ? (
                              <select
                                value={formData[field.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white ${
                                  errors[field.id]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              >
                                <option value={""}>Select {field.label}</option>
                                {field.options?.map((op) => (
                                  <option key={op} value={op}>
                                    {op}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={formData[field.id] || ""}
                                type={field.type}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] ${
                                  errors[field.id]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              />
                            )}
                          </div>
                          {field.helpText && (
                            <div className="flex items-start gap-2 text-[#344767] text-xs">
                              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span>{field.helpText}</span>
                            </div>
                          )}
                          {errors[field.id] && (
                            <div className="flex items-center gap-2 text-red-500 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors[field.id]}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#E1E8F5]">
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-[#2E69A4] text-[#2E69A4] rounded-lg hover:bg-[#2E69A4]/5 transition-colors font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    Save Draft
                  </button>

                  <button
                    onClick={handlePreview}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1B2A49] text-white rounded-lg hover:bg-[#1B2A49]/90 transition-colors font-semibold"
                  >
                    <Eye className="w-5 h-5" />
                    Preview & Generate
                  </button>
                </div>

                {savedDraft && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Draft saved successfully!
                    </span>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sticky top-2 h-[80vh]">
              {/* Document Progress */}
              <Card>
                <h3 className="text-[#1B2A49] font-bold text-lg mb-4">
                  {isCustomTemplate ? "Template Progress" : "Document Progress"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#344767] text-sm font-medium">
                        Completion
                      </span>
                      <span className="text-[#2E69A4] text-sm font-bold">
                        {Math.round(
                          (Object.keys(formData).filter((key) => formData[key])
                            .length /
                            (fields.length +
                              headerFields.length +
                              footerFields.length)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E1E8F5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2E69A4] to-[#1B2A49] transition-all duration-300"
                        style={{
                          width: `${
                            (Object.keys(formData).filter(
                              (key) => formData[key]
                            ).length /
                              (fields.length +
                                headerFields.length +
                                footerFields.length)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E1E8F5] space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#344767]">Total Fields</span>
                      <span className="font-semibold text-[#1B2A49]">
                        {fields.length +
                          headerFields.length +
                          footerFields.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#344767]">Completed</span>
                      <span className="font-semibold text-[#2E69A4]">
                        {
                          Object.keys(formData).filter((key) => formData[key])
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#344767]">Remaining</span>
                      <span className="font-semibold text-[#344767]">
                        {fields.length +
                          headerFields.length +
                          footerFields.length -
                          Object.keys(formData).filter((key) => formData[key])
                            .length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <h3 className="text-[#1B2A49] font-bold text-lg mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleOpenAddFieldModal}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#F4F7FA] text-[#1B2A49] rounded-lg hover:bg-[#E9EEF5] transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Field
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#F4F7FA] text-[#1B2A49] rounded-lg hover:bg-[#E9EEF5] transition-colors text-sm font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Add Field Modal */}
        <Modal
          isOpen={isAddFieldModalOpen}
          onClose={handleCloseAddFieldModal}
          title="Add Custom Field"
          showCloseButton={true}
          closeOnOverlayClick={true}
          size="md"
          titleIcon={<Plus className="w-5 h-5 text-white" />}
        >
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Field Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="e.g., Contract Value"
                  className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Field Type
                </label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767] bg-white"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Dropdown</option>
                </select>
              </div>

              {newFieldType === "select" && (
                <div>
                  <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                    Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="e.g., Option 1, Option 2, Option 3"
                    className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newFieldPlaceholder}
                  onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                  placeholder="e.g., Enter contract value"
                  className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767]"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="newFieldRequired"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="w-4 h-4 text-[#2E69A4] border-[#E1E8F5] rounded focus:ring-[#2E69A4]"
                />
                <label
                  htmlFor="newFieldRequired"
                  className="text-sm font-medium text-[#344767] cursor-pointer"
                >
                  Make this field required
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCloseAddFieldModal}
                className="flex-1 px-4 py-2.5 border border-[#E1E8F5] text-[#344767] font-semibold text-sm rounded-lg hover:bg-[#F4F7FA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewField}
                disabled={!newFieldLabel.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>
          </div>
        </Modal>

        {/* Edit Field Modal */}
        <Modal
          isOpen={isEditFieldModalOpen}
          onClose={handleCloseEditFieldModal}
          title="Edit Field"
          showCloseButton={true}
          closeOnOverlayClick={true}
          size="md"
          titleIcon={<Edit2 className="w-5 h-5 text-white" />}
        >
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Field Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFieldLabel}
                  onChange={(e) => setEditFieldLabel(e.target.value)}
                  placeholder="Enter field label"
                  className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767]"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="editFieldRequired"
                  checked={editFieldRequired}
                  onChange={(e) => setEditFieldRequired(e.target.checked)}
                  className="w-4 h-4 text-[#2E69A4] border-[#E1E8F5] rounded focus:ring-[#2E69A4]"
                />
                <label
                  htmlFor="editFieldRequired"
                  className="text-sm font-medium text-[#344767] cursor-pointer"
                >
                  Make this field required
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900">
                  Field type and other properties cannot be changed after
                  creation. You can remove this field and add a new one if
                  needed.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCloseEditFieldModal}
                className="flex-1 px-4 py-2.5 border border-[#E1E8F5] text-[#344767] font-semibold text-sm rounded-lg hover:bg-[#F4F7FA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateField}
                disabled={!editFieldLabel.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Update Field
              </button>
            </div>
          </div>
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
