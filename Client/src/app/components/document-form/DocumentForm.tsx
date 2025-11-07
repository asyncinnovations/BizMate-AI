"use client";

import React, { useState, useEffect, useRef } from "react";
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
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

interface FieldConfig {
  id: string;
  label: string;
  field_name?: string;
  type: "text" | "email" | "date" | "number" | "textarea" | "select" | "file";
  field_type?:
    | "text"
    | "email"
    | "date"
    | "number"
    | "textarea"
    | "select"
    | "file";
  placeholder: string;
  required: boolean;
  aiSuggestion?: string;
  helpText?: string;
  options?: string[];
  isCustomAdded?: boolean;
  unique_id?: string;
}

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

export default function DocumentForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const template_id = params?.template_id;
  const promptFromUrl = searchParams?.get("prompt") || "";

  const isCustomTemplate = !!promptFromUrl;

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiProcessing, setAiProcessing] = useState<boolean>(false);
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [templateName, setTemplateName] = useState<string>("");
  const [templateDescription, setTemplateDescription] = useState<string>("");
  const [hasAutoFilled, setHasAutoFilled] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Add Field Modal States
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] =
    useState<boolean>(false);

  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState<string>("");
  const [newFieldOptions, setNewFieldOptions] = useState<string>("");

  const [formData, setFormData] = useState({
    header: {}, // e.g. { title: "", logo: "" }
    main: {}, // user dynamically adds fields here
    footer: {}, // e.g. { note: "" }
  });

  const [errors, setErrors] = useState({
    header: {},
    main: {},
    footer: {},
  });

  const [newField, setNewField] = useState({
    field_name: "",
    field_type: "",
    required: false,
  });

  // Edit Field Modal States
  const [isEditFieldModalOpen, setIsEditFieldModalOpen] =
    useState<boolean>(false);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);

  //////////////////////////////////////////
  // Generate unique ID function
  //////////////////////////////////////////
  const generateUniqueId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  useEffect(() => {
    if (template_id) {
      fetchTemplate();
      fetchPrebuiltFields();
    } else if (promptFromUrl) {
      fetchAIGeneratedFields();
    }
  }, [template_id, promptFromUrl]);

  //////////////////////////////////////////
  //  PREBUILT FLOW – Fetch Fields
  //////////////////////////////////////////
  const fetchPrebuiltFields = async () => {
    try {
      const response = await axiosInstance.get(
        `/template_field/template/${template_id}`
      );
      if (response.status === 200) {
        const fields = (response.data.response || []).map((f) => ({
          ...f,
          unique_id: generateUniqueId(),
        }));
        setFields(fields);
        console.log("Successfully get all fields of a template", fields);
      }
    } catch (error) {
      console.log("Error occur while getting all fields of a template", error);
    }
  };

  //////////////////////////////////////////
  //  AI FLOW – Generate and Save Fields
  //////////////////////////////////////////
  const fetchAIGeneratedFields = async () => {
    try {
      //Step-1 Ask AI to generate schema
      const aiResponseFields = [
        {
          field_name: "Name",
          field_type: "text",
          required: true,
        },
        {
          field_name: "Email",
          field_type: "email",
          required: true,
        },
        {
          field_name: "Phone",
          field_type: "number",
          required: true,
        },
      ];

      const aiResponseFieldsWithUniqueIds = aiResponseFields.map((f) => ({
        ...f,
        unique_id: generateUniqueId(),
      }));

      setFields(aiResponseFieldsWithUniqueIds);
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate AI Template");
    }
  };

  //////////////////////////////////////////
  //  Add New Field
  //////////////////////////////////////////
  const handleAddField = async () => {
    if (!newField.field_name.trim()) return toast.error("Field name required!");
    const fieldToAdd = {
      ...newField,
      unique_id: generateUniqueId(),
    };

    setFields((prev) => [...prev, fieldToAdd]);
    toast.success("Field added!");
    setNewField({ field_name: "", field_type: "", required: false });
    setIsAddFieldModalOpen(false);

    // try {
    //   const payload = { ...newField, template_id };
    //   const response = await axiosInstance.post(
    //     `/template_field/create`,
    //     payload
    //   );
    //   setFields((prev) => [...prev, response.data.response]);
    //   toast.success("Field added!");
    //   setNewField({ field_name: "", field_type: "", required: false });
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Failed to add field");
    // } finally {
    //   setIsAddFieldModalOpen(false);
    // }
  };

  //////////////////////////////////////////
  //  Delete Field
  //////////////////////////////////////////
  const handleRemoveField = async (uniqueId: string) => {
    setFields((prev) => prev.filter((f) => f.unique_id !== uniqueId));
    toast.success("Field Deleted!");
    // try {
    //   await axiosInstance.delete(`/template_field/delete/${fieldId}`);
    //   setFields((prev) => prev.filter((f) => f.uuid !== fieldId));
    //   toast.success("Field Deleted!");
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Delete Failed");
    // }
  };

  //////////////////////////////////////////
  //   Update Field
  //////////////////////////////////////////
  const handleUpdateField = async () => {
    if (!editingField || !newField.field_name.trim()) return;

    const updatedData = {
      ...newField,
    };

    setFields((prev) =>
      prev.map((f) =>
        editingField === f.unique_id ? { ...f, ...updatedData } : f
      )
    );
    toast.success("Field Updated!");
    setEditingField(null);
    setNewField({ field_name: "", field_type: "", required: false });
    handleCloseEditFieldModal();

    // try {
    //   const updatedData = {
    //     field_name: newField.field_name,
    //     field_type: newField.field_type,
    //     required: newField.required,
    //     template_id,
    //   };
    //   const response = await axiosInstance.patch(
    //     `/template_field/update/${editingField}`,
    //     updatedData
    //   );

    //   if (response.status === 200) {
    //     setFields((prev) =>
    //       prev.map((f) =>
    //         f.uuid === editingField ? { ...f, ...updatedData } : f
    //       )
    //     );
    //     toast.success("Field Updated!");
    //     setEditingField(null);
    //     setNewField({ field_name: "", field_type: "", required: false });
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Failed to Update");
    // } finally {
    //   handleCloseEditFieldModal();
    // }
  };

  //////////////////////////////////////////
  //  Fetch Single Template
  //////////////////////////////////////////
  const fetchTemplate = async () => {
    try {
      const response = await axiosInstance.get(
        `/templates/single/${template_id}`
      );
      if (response.status === 200) {
        console.log(response.data);
        setTemplateName(response.data.data.template_name);
        setTemplateDescription(response.data.data.description);
        setFormData(response.data.data.fields_schema);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //////////////////////////////////////////
  //  Update Template
  //////////////////////////////////////////
  const handleFinalSave = async () => {
    try {
      if (isCustomTemplate) {
        // Create a new template
        const createRes = await axiosInstance.post(`/templates/create`, {
          template_name: promptFromUrl.slice(0, 30),
          description: "AI generated custom template",
          fields_schema: formData,
          user_id: !loading ? user?.user.user_id : null,
        });

        const newId = createRes.data.data.uuid;

        // Prepare fields for bulk creation
        const fieldsForBulk = fields.map((field) => ({
          field_name: field.field_name,
          field_type: field.field_type,
          required: field.required,
        }));

        //  Bulk insert AI fields to template_field table
        await axiosInstance.post(
          `/template_field/bulk/${newId}`,
          fieldsForBulk
        );
        toast.success("Template Saved!");

        return { success: true };
      } else if (template_id) {
        await axiosInstance.put(`/templates/update/${template_id}`, {
          fields_schema: formData,
        });

        toast.success("Template Saved!");
        return { success: true };
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save template");
      return { success: false };
    }
  };

  //////////////////////////////////////////
  //  Handle Input Change Function
  //////////////////////////////////////////
  const handleInputChange = (
    section: header | main | footer,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    if (errors?.[section]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: "",
        },
      }));
    }
  };

  //////////////////////////////////////////
  //  Handle Logo Upload Function
  //////////////////////////////////////////
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

  //////////////////////////////////////////
  //  Validate Form Errors
  //////////////////////////////////////////
  const validateForm = () => {
    const newErrors = {
      header: {},
      main: {},
      footer: {},
    };

    // Validate header fields
    headerFields.forEach((field) => {
      const value = formData.header?.[field.label]?.trim();
      if (field.required && !value) {
        newErrors.header[field.label] = `${field.label} is Required`;
      }
    });

    // Validate main fields
    fields.forEach((field) => {
      const value = formData.main?.[field.field_name]?.trim();
      if (field.required && !value) {
        newErrors.main[field.field_name] = `${field.field_name} is Required`;
      }
    });

    // Validate footer fields
    footerFields.forEach((field) => {
      const value = formData.footer?.[field.label]?.trim();
      if (field.required && !value) {
        newErrors.footer[field.label] = `${field.label} is Required`;
      }
    });

    setErrors(newErrors);

    const hasErrors =
      [
        ...Object.values(newErrors.header),
        ...Object.values(newErrors.main),
        ...Object.values(newErrors.footer),
      ].length > 0;

    return !hasErrors;
  };

  //////////////////////////////////////////
  //  Handle Save And Preview
  //////////////////////////////////////////
  const handleSaveAndPreview = async () => {
    if (!validateForm()) return;

    const result = await handleFinalSave();

    if (result?.success) {
      const previewPath = isCustomTemplate
        ? `/dashboard/documents/preview/custom-template?data=${encodeURIComponent(
            JSON.stringify(formData)
          )}`
        : `/dashboard/documents/preview/${templateName}?data=${encodeURIComponent(
            JSON.stringify(formData)
          )}`;
      router.push(previewPath);
    } else {
      toast.error("Template save Failed. Preview not generated.");
    }
  };

  const handleOpenAddFieldModal = () => {
    setIsAddFieldModalOpen(true);
  };

  const handleCloseAddFieldModal = () => {
    setIsAddFieldModalOpen(false);
    setNewField({ field_name: "", field_type: "", required: false });
  };

  const handleOpenEditFieldModal = (field) => {
    setEditingField(field.unique_id);
    const { field_name, field_type, required } = field;
    setNewField({ field_name, field_type, required });
    setIsEditFieldModalOpen(true);
  };

  const handleCloseEditFieldModal = () => {
    setIsEditFieldModalOpen(false);
    setEditingField(null);
    setNewField({ field_name: "", field_type: "", required: false });
  };

  const getPageTitle = () => {
    return isCustomTemplate ? templateName : templateName;
  };

  const getPageDescription = () => {
    return isCustomTemplate ? templateDescription : templateDescription;
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
                          </div>

                          <div>
                            {field.type === "textarea" ? (
                              <textarea
                                value={formData.header?.[field.label] || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "header",
                                    field.label,
                                    e.target.value
                                  )
                                }
                                placeholder={field.placeholder}
                                rows={3}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] resize-none ${
                                  errors.header?.[field.label]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              />
                            ) : (
                              <input
                                value={formData.header?.[field.label] || ""}
                                type={field.type}
                                onChange={(e) =>
                                  handleInputChange(
                                    "header",
                                    field.label,
                                    e.target.value
                                  )
                                }
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] ${
                                  errors.header?.[field.label]
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
                          {errors.header?.[field.label] && (
                            <div className="flex items-center gap-2 text-red-500 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors.header?.[field.label]}</span>
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
                          key={field.uuid}
                          className="space-y-3 relative group"
                        >
                          {/* Field Actions */}
                          <div className="flex items-center justify-between">
                            <label className="block text-[#1B2A49] font-semibold text-sm">
                              {field.field_name}
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
                                onClick={() =>
                                  handleRemoveField(field.unique_id)
                                }
                                className="p-1.5 bg-red-100 text-red-500 rounded hover:bg-red-200 transition-colors"
                                title="Remove field"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            {field.field_type === "textarea" ? (
                              <textarea
                                value={formData.main?.[field.field_name] || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "main",
                                    field.field_name,
                                    e.target.value
                                  )
                                }
                                placeholder={field.field_name}
                                rows={4}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] resize-none ${
                                  errors.main?.[field.field_name]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              />
                            ) : field.field_type === "select" ? (
                              <select
                                value={formData.main?.[field.field_name] || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "main",
                                    field.field_name,
                                    e.target.value
                                  )
                                }
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white ${
                                  errors.main?.[field.field_name]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              >
                                <option value={""}>
                                  Select {field.field_name}
                                </option>
                                {field.options?.map((op) => (
                                  <option key={op} value={op}>
                                    {op}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={formData.main?.[field.field_name] || ""}
                                type={field.field_type}
                                onChange={(e) =>
                                  handleInputChange(
                                    "main",
                                    field.field_name,
                                    e.target.value
                                  )
                                }
                                placeholder={field.field_name}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] ${
                                  errors.main?.[field.field_name]
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

                          {errors.main?.[field.field_name] && (
                            <div className="flex items-center gap-2 text-red-500 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors.main?.[field.field_name]}</span>
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
                          </div>

                          <div>
                            {field.type === "textarea" ? (
                              <textarea
                                value={formData.footer?.[field.label] || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "footer",
                                    field.label,
                                    e.target.value
                                  )
                                }
                                placeholder={field.placeholder}
                                rows={3}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] resize-none ${
                                  errors.footer?.[field.label]
                                    ? "border-red-500"
                                    : "border-[#E1E8F5]"
                                }`}
                              />
                            ) : field.type === "select" ? (
                              <select
                                value={formData.footer?.[field.label] || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "footer",
                                    field.label,
                                    e.target.value
                                  )
                                }
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white ${
                                  errors.footer?.[field.label]
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
                                value={formData.footer?.[field.label] || ""}
                                type={field.type}
                                onChange={(e) =>
                                  handleInputChange(
                                    "footer",
                                    field.label,
                                    e.target.value
                                  )
                                }
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] ${
                                  errors.footer?.[field.label]
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
                          {errors.footer?.[field.label] && (
                            <div className="flex items-center gap-2 text-red-500 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors.footer?.[field.label]}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Action Buttons */}
                <div className="flex items-center mt-8 pt-6 border-t border-[#E1E8F5]">
                  <button
                    onClick={handleSaveAndPreview}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1B2A49] text-white rounded-lg hover:bg-[#1B2A49]/90 transition-colors font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    Save & Preview
                  </button>
                </div>
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
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#F4F7FA] text-[#1B2A49] rounded-lg hover:bg-[#E9EEF5] transition-colors text-sm font-medium">
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
                  value={newField.field_name}
                  onChange={(e) =>
                    setNewField({ ...newField, field_name: e.target.value })
                  }
                  placeholder="e.g., Contract Value"
                  className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Field Type
                </label>
                <select
                  value={newField.field_type}
                  onChange={(e) =>
                    setNewField({ ...newField, field_type: e.target.value })
                  }
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

              {newField.field_type === "select" && (
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
                  checked={newField.required}
                  onChange={(e) =>
                    setNewField({ ...newField, required: e.target.checked })
                  }
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
                onClick={handleAddField}
                disabled={!newField.field_name.trim()}
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
                  value={newField.field_name}
                  onChange={(e) =>
                    setNewField({ ...newField, field_name: e.target.value })
                  }
                  placeholder="Enter field label"
                  className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Field Type
                </label>
                <select
                  value={newField.field_type}
                  onChange={(e) =>
                    setNewField({ ...newField, field_type: e.target.value })
                  }
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

              {newField.field_type === "select" && (
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

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="editFieldRequired"
                  checked={newField.required}
                  onChange={(e) =>
                    setNewField({ ...newField, required: e.target.checked })
                  }
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
                  You can update this field’s name, type, or other properties
                  anytime. Make sure to review changes before saving to ensure
                  data consistency.
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
                disabled={!newField.field_name.trim()}
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
