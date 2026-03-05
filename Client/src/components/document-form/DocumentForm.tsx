"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Save,
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
  SendIcon,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import Button from "../ui/Button";
import InputField from "@/components/ui/InputField";

interface FieldConfig {
  id: string;
  field_name: string;
  field_type:
    | "text"
    | "email"
    | "date"
    | "number"
    | "textarea"
    | "select"
    | "file";
  field_value?: string;
  placeholder: string;
  required: boolean;
  aiSuggestion?: string;
  helpText?: string;
  options?: string[];
  unique_id?: string;
  uuid?: string; // Add uuid for existing fields from backend
}

interface ErrorFields {
  [key: string]: string;
}

interface ErrorTypes {
  header: ErrorFields;
  main: ErrorFields;
  footer: ErrorFields;
}

interface NewFieldTypes {
  field_name: string;
  field_type:
    | "text"
    | "email"
    | "date"
    | "number"
    | "textarea"
    | "select"
    | "file";
  placeholder: string;
  required: boolean;
}

interface FormDataTypes {
  header: Record<string, string>;
  main: Record<string, string>;
  footer: Record<string, string>;
}

// Header fields configuration
const headerFields: FieldConfig[] = [
  {
    id: "formName",
    field_name: "Form Name",
    field_type: "text",
    placeholder: "e.g., Contract Form, Employment Agreement, NDA",
    required: true,
    helpText: "This will be displayed as the main title of your document",
  },
  {
    id: "documentTitle",
    field_name: "Document Title",
    field_type: "text",
    placeholder: "e.g., Service Agreement, Employment Contract",
    required: false,
    helpText: "Specific title for this document instance",
  },
];

// Footer fields configuration
const footerFields: FieldConfig[] = [
  {
    id: "preparedBy",
    field_name: "Prepared By",
    field_type: "text",
    placeholder: "Name of person/organization who prepared this document",
    required: false,
  },
  {
    id: "reviewedBy",
    field_name: "Reviewed By",
    field_type: "text",
    placeholder: "Name of reviewer",
    required: false,
  },
  {
    id: "approvedBy",
    field_name: "Approved By",
    field_type: "text",
    placeholder: "Name of approver",
    required: false,
  },
  {
    id: "effectiveDate",
    field_name: "Effective Date",
    field_type: "date",
    placeholder: "When this document becomes effective",
    required: false,
  },
  {
    id: "expiryDate",
    field_name: "Expiry Date",
    field_type: "date",
    placeholder: "When this document expires (if applicable)",
    required: false,
  },
  {
    id: "footerNotes",
    field_name: "Footer Notes",
    field_type: "textarea",
    placeholder:
      "Any additional notes, disclaimers, or important information to display in footer",
    required: false,
    helpText: "This text will appear at the bottom of each page",
  },
  {
    id: "confidentialityLevel",
    field_name: "Confidentiality Level",
    field_type: "select",
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
  const [originalFields, setOriginalFields] = useState<FieldConfig[]>([]); // Store original fields for comparison
  const [templateName, setTemplateName] = useState<string>("");
  const [templateDescription, setTemplateDescription] = useState<string>("");
  const [hasAutoFilled, setHasAutoFilled] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Add Field Modal States
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] =
    useState<boolean>(false);

  const [formData, setFormData] = useState<FormDataTypes>({
    header: {}, // e.g. { title: "", logo: "" }
    main: {}, // user dynamically adds fields here
    footer: {}, // e.g. { note: "" }
  });

  const [errors, setErrors] = useState<ErrorTypes>({
    header: {},
    main: {},
    footer: {},
  });

  const [newField, setNewField] = useState<NewFieldTypes>({
    field_name: "",
    field_type: "text",
    placeholder: "",
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
        `/template_field/template/${template_id}`,
      );
      if (response.status === 200) {
        const fields = (response.data.response || []).map((f: FieldConfig) => ({
          ...f,
          unique_id: generateUniqueId(),
        }));
        setFields(fields);
        setOriginalFields(fields); // Store original fields for comparison
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
      setIsGenerating(true);
      //Step-1 Ask AI to generate schema
      const response: FieldConfig[] = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const aiResponseFields: FieldConfig[] = [
            {
              id: "temp-1",
              field_name: "Name",
              field_type: "text",
              placeholder: "Enter your name",
              required: false,
            },
            {
              id: "temp-2",
              field_name: "Email",
              field_type: "email",
              placeholder: "Enter your business email",
              required: true,
            },
          ];

          setTemplateName(promptFromUrl.slice(0, 30));
          setTemplateDescription(promptFromUrl);

          resolve(aiResponseFields);
        }, 2000);
      });

      const aiResponseFieldsWithUniqueIds = response.map((f) => ({
        ...f,
        unique_id: generateUniqueId(),
      }));

      setFields(aiResponseFieldsWithUniqueIds);
      setOriginalFields(aiResponseFieldsWithUniqueIds); // Store original fields for comparison
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate AI Template");
    } finally {
      setIsGenerating(false);
    }
  };

  //////////////////////////////////////////
  //  Add New Field
  //////////////////////////////////////////
  const handleAddField = async () => {
    if (!newField.field_name.trim()) return toast.error("Field name required!");
    const fieldToAdd = {
      ...newField,
      id: generateUniqueId(),
      unique_id: generateUniqueId(),
    };

    console.log(fieldToAdd);

    setFields((prev) => [...prev, fieldToAdd]);
    toast.success("Field added!");
    setNewField({
      field_name: "",
      field_type: "text",
      placeholder: "",
      required: false,
    });
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
  const handleRemoveField = async (uniqueId: string | undefined) => {
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
        f.unique_id === editingField.unique_id ? { ...f, ...updatedData } : f,
      ),
    );

    toast.success("Field Updated!");
    setEditingField(null);
    setNewField({
      field_name: "",
      field_type: "text",
      placeholder: "",
      required: false,
    });
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
        `/templates/single/${template_id}`,
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
  //  Field Management Logic for Template Update
  //////////////////////////////////////////
  const manageTemplateFields = async () => {
    if (!template_id) return;

    try {
      // Identify fields that need to be processed
      const currentFieldIds = fields.map((f) => f.unique_id);
      const originalFieldIds = originalFields.map((f) => f.unique_id);

      // Fields to delete (present in original but not in current)
      const fieldsToDelete = originalFields.filter(
        (field) => !currentFieldIds.includes(field.unique_id),
      );

      // Fields to add (present in current but not in original)
      const fieldsToAdd = fields.filter(
        (field) => !originalFieldIds.includes(field.unique_id),
      );

      // Fields to update (present in both but potentially modified)
      const fieldsToUpdate = fields.filter((field) => {
        if (!originalFieldIds.includes(field.unique_id)) return false;

        const originalField = originalFields.find(
          (f) => f.unique_id === field.unique_id,
        );
        return (
          originalField &&
          (originalField.field_name !== field.field_name ||
            originalField.field_type !== field.field_type ||
            originalField.placeholder !== field.placeholder ||
            originalField.required !== field.required)
        );
      });

      console.log("Fields to delete:", fieldsToDelete);
      console.log("Fields to add:", fieldsToAdd);
      console.log("Fields to update:", fieldsToUpdate);

      // Delete fields
      for (const field of fieldsToDelete) {
        if (field.uuid) {
          // Only delete fields that exist in backend (have uuid)
          await axiosInstance.delete(`/template_field/delete/${field.uuid}`);
          console.log(`Deleted field: ${field.field_name}`);
        }
      }

      // Add new fields
      if (fieldsToAdd.length > 0) {
        const fieldsForBulkCreate = fieldsToAdd.map((field) => ({
          field_name: field.field_name,
          field_type: field.field_type,
          placeholder: field.placeholder,
          required: field.required,
          template_id: template_id,
        }));

        await axiosInstance.post(
          `/template_field/bulk/${template_id}`,
          fieldsForBulkCreate,
        );
        console.log(`Added ${fieldsToAdd.length} new fields`);
      }

      // Update existing fields
      for (const field of fieldsToUpdate) {
        if (field.uuid) {
          // Only update fields that exist in backend (have uuid)
          const updatedData = {
            field_name: field.field_name,
            field_type: field.field_type,
            placeholder: field.placeholder,
            required: field.required,
            template_id: template_id,
          };

          await axiosInstance.patch(
            `/template_field/update/${field.uuid}`,
            updatedData,
          );
          console.log(`Updated field: ${field.field_name}`);
        }
      }

      return true;
    } catch (error) {
      console.error("Error managing template fields:", error);
      throw error;
    }
  };

  //////////////////////////////////////////
  //  Update Template
  //////////////////////////////////////////
  const handleFinalSave = async () => {
    try {
      // Prepare fields for bulk creation
      const fieldsForBulk = fields.map((field) => ({
        field_name: field.field_name,
        field_type: field.field_type,
        placeholder: field.placeholder,
        required: field.required,
      }));

      if (isCustomTemplate) {
        // Create a new template
        const createRes = await axiosInstance.post(`/templates/create`, {
          template_name: templateName,
          description: templateDescription,
          fields_schema: formData,
          user_id: !loading ? user?.user.user_id : null,
        });

        const newId = createRes.data.data.uuid;

        // Bulk insert AI fields to template_field table
        await axiosInstance.post(
          `/template_field/bulk/${newId}`,
          fieldsForBulk,
        );

        router.push(`/dashboard/documents/new/${newId}`);
        toast.success("Template Saved!");

        return { success: true };
      } else if (template_id) {
        // Update template fields schema
        await axiosInstance.put(`/templates/update/${template_id}`, {
          fields_schema: formData,
        });

        // Manage template fields (add, update, delete)
        await manageTemplateFields();

        // await axiosInstance.patch(
        //   `/template_field/bulk_update/${template_id}`,
        //   fieldsForBulk
        // );
        toast.success("Template Updated!");
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
    section: "header" | "main" | "footer",
    field: string,
    value: string,
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
    const newErrors: ErrorTypes = {
      header: {},
      main: {},
      footer: {},
    };

    // Validate header fields
    headerFields.forEach((field) => {
      const value = formData.header?.[field.field_name]?.trim();
      if (field.required && !value) {
        newErrors.header[field.field_name] = `${field.field_name} is Required`;
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
      const value = formData.footer?.[field.field_name]?.trim();
      if (field.required && !value) {
        newErrors.footer[field.field_name] = `${field.field_name} is Required`;
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
    if (!validateForm())
      return toast.error("Fill all the required fields to Preview Document");

    const result = await handleFinalSave();

    if (result?.success) {
      const previewPath = isCustomTemplate
        ? `/dashboard/documents/preview/custom-template?data=${encodeURIComponent(
            JSON.stringify(formData),
          )}`
        : `/dashboard/documents/preview/${templateName}?data=${encodeURIComponent(
            JSON.stringify(formData),
          )}`;
      setTimeout(
        () => {
          router.push(previewPath);
        },
        isCustomTemplate ? 2000 : 0,
      );
    } else {
      toast.error("Template save Failed. Preview not generated.");
    }
  };

  const handleOpenAddFieldModal = () => {
    setIsAddFieldModalOpen(true);
  };

  const handleCloseAddFieldModal = () => {
    setIsAddFieldModalOpen(false);
    setNewField({
      field_name: "",
      field_type: "text",
      placeholder: "",
      required: false,
    });
  };

  const handleOpenEditFieldModal = (field: FieldConfig) => {
    setEditingField(field);
    const { field_name, field_type, placeholder, required } = field;
    setNewField({ field_name, field_type, placeholder, required });
    setIsEditFieldModalOpen(true);
  };

  const handleCloseEditFieldModal = () => {
    setIsEditFieldModalOpen(false);
    setEditingField(null);
    setNewField({
      field_name: "",
      field_type: "text",
      placeholder: "",
      required: false,
    });
  };

  const getPageTitle = () => {
    return isCustomTemplate ? templateName : templateName;
  };

  const getPageDescription = () => {
    return isCustomTemplate ? templateDescription : templateDescription;
  };

  // ─── Shared field renderer ─────────────────────────────────────────────────
  // Uses InputField for text / email / date / number / textarea — label is
  // passed directly so InputField renders it with the platform label style.
  // Native <select> is kept for dropdowns (InputField doesn't support select).
  // showLabel = false is used in the "main" section where the label row also
  // contains the edit/delete action buttons and is rendered separately.
  const renderField = (
    field: FieldConfig,
    section: "header" | "main" | "footer",
    showLabel = true,
  ) => {
    const value = formData[section]?.[field.field_name] || "";
    const error = errors[section]?.[field.field_name];

    if (field.field_type === "select") {
      return (
        <div className="w-full">
          {showLabel && (
            <label className="block mb-2 text-text-secondary text-sm font-medium">
              {field.field_name}
              {field.required && (
                <span className="text-status-error ml-1">*</span>
              )}
            </label>
          )}
          <select
            value={value}
            onChange={(e) =>
              handleInputChange(section, field.field_name, e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary text-sm text-text-secondary bg-bg-base transition-all ${
              error ? "border-status-error" : "border-border"
            }`}
          >
            <option value="">Select {field.field_name}</option>
            {(field.options ?? field.placeholder?.split(","))?.map((op) => (
              <option key={op} value={op.trim()}>
                {op.trim()}
              </option>
            ))}
          </select>
          {error && (
            <div className="flex items-center mt-1 space-x-1">
              <AlertCircle className="w-4 h-4 text-status-error" />
              <span className="text-status-error text-xs">{error}</span>
            </div>
          )}
        </div>
      );
    }

    // text / email / date / number / textarea — reusable InputField
    return (
      <InputField
        name={field.field_name}
        type={field.field_type}
        label={showLabel ? field.field_name : undefined}
        value={value}
        onChange={(e) =>
          handleInputChange(section, field.field_name, e.target.value)
        }
        placeholder={field.placeholder}
        error={error}
        required={field.required}
      />
    );
  };

  if (isGenerating) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen bg-bg-base p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-brand rounded-full mb-6">
                <Sparkles className="w-10 h-10 text-on-brand animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-text-heading mb-2">
                Generating Your Custom Template
              </h2>
              <p className="text-text-secondary mb-6">
                AI is analyzing your requirements and creating a tailored
                document template...
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-secondary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-secondary rounded-full animate-bounce"
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
        <div className="min-h-screen bg-bg-base p-4 mb-8">
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
                  <div className="mb-6 p-4 bg-brand-light border border-secondary/20 rounded-lg flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-heading font-semibold text-sm">
                        {hasAutoFilled
                          ? "AI Auto-fill Complete"
                          : "AI Auto-fill Active"}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {hasAutoFilled
                          ? "All fields have been automatically filled by AI based on your prompt and business profile. Review and edit as needed."
                          : "Some fields have been pre-filled from your business profile. Review and edit as needed."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Add Field and Auto-fill Buttons */}
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-heading">
                    {isCustomTemplate ? "Template Fields" : "Document Fields"}
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={aiProcessing}
                      className="flex items-center gap-2 px-4 py-2 bg-status-warning-bg border border-status-warning-border text-status-warning rounded-lg hover:shadow-card transition-all duration-200 font-semibold text-sm disabled:opacity-50"
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
                      className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-lg hover:shadow-raised transition-all duration-200 font-semibold text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <form className="space-y-8">
                  {/* Header Section */}
                  <div className="border-b border-border pb-6">
                    <h4 className="text-lg font-bold text-text-heading mb-4 flex items-center gap-2">
                      <Image className="w-5 h-5 text-secondary" />
                      Document Header
                    </h4>
                    <div className="space-y-6">
                      {/* Logo Upload Section */}
                      <div className="space-y-3">
                        <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                          Company Logo
                          <span className="text-text-muted text-xs font-normal ml-2 normal-case tracking-normal">
                            (Optional — will be displayed in document header)
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
                              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-border hover:border-secondary rounded-lg transition-colors cursor-pointer text-text-secondary"
                            >
                              <Upload className="w-5 h-5" />
                              <span className="font-medium">
                                {logoFile ? "Change Logo" : "Upload Logo"}
                              </span>
                            </label>
                          </div>
                          {logoPreview && (
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 border border-border rounded-lg overflow-hidden bg-surface">
                                <img
                                  src={logoPreview}
                                  alt="Logo preview"
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={removeLogo}
                                className="p-2 bg-status-error-bg text-status-error rounded-lg hover:bg-status-error hover:text-on-brand transition-colors"
                                title="Remove logo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-text-muted text-xs">
                          Recommended: PNG or JPG, max 5MB. Square images work
                          best.
                        </p>
                      </div>

                      {/* Header Form Fields */}
                      {headerFields.map((field) => (
                        <div
                          key={field.id}
                          className="space-y-1.5 relative group"
                        >
                          {renderField(field, "header")}

                          {field.helpText && (
                            <div className="flex items-start gap-2 text-text-muted text-xs">
                              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span>{field.helpText}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Document Fields Section */}
                  <div>
                    <h4 className="text-lg font-bold text-text-heading mb-4">
                      Document Content
                    </h4>
                    <div className="space-y-6">
                      {fields.map((field) => (
                        <div
                          key={field.unique_id}
                          className="space-y-1.5 relative group"
                        >
                          {/* Field label row with edit/delete actions */}
                          <div className="flex items-center justify-between">
                            <label className="block text-text-secondary text-sm font-medium">
                              {field.field_name}
                              {field.required && (
                                <span className="text-status-error ml-1">
                                  *
                                </span>
                              )}
                              {field.aiSuggestion && (
                                <span className="ml-2 text-secondary text-xs font-normal">
                                  ({field.aiSuggestion})
                                </span>
                              )}
                            </label>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleOpenEditFieldModal(field)}
                                className="p-1.5 bg-status-info-bg text-status-info rounded hover:bg-status-info hover:text-on-brand transition-colors"
                                title="Edit field"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveField(field.unique_id)
                                }
                                className="p-1.5 bg-status-error-bg text-status-error rounded hover:bg-status-error hover:text-on-brand transition-colors"
                                title="Remove field"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {renderField(field, "main", false)}

                          {field.helpText && (
                            <div className="flex items-start gap-2 text-text-muted text-xs">
                              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span>{field.helpText}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="border-t border-border pt-6">
                    <h4 className="text-lg font-bold text-text-heading mb-4">
                      Document Footer
                    </h4>
                    <div className="space-y-6">
                      {footerFields.map((field) => (
                        <div
                          key={field.id}
                          className="space-y-1.5 relative group"
                        >
                          {renderField(field, "footer")}

                          {field.helpText && (
                            <div className="flex items-start gap-2 text-text-muted text-xs">
                              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span>{field.helpText}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 pt-6 border-t border-border">
                  <Button
                    onClick={() => router.push("/dashboard/documents")}
                    className="border border-border text-text-secondary bg-surface hover:bg-bg-base shadow-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveAndPreview}
                    startIcon={<SendIcon className="w-5 h-5" />}
                    className="flex-1"
                  >
                    Save & Preview
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sticky top-2 h-[80vh]">
              {/* Document Progress */}
              <Card>
                <h3 className="text-text-heading font-bold text-lg mb-4">
                  {isCustomTemplate ? "Template Progress" : "Document Progress"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-secondary text-sm font-medium">
                        Completion
                      </span>
                      <span className="text-secondary text-sm font-bold">
                        {Math.round(
                          ((
                            Object.keys(formData) as Array<keyof FormDataTypes>
                          ).filter((key) => formData[key]).length /
                            (fields.length +
                              headerFields.length +
                              footerFields.length)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand transition-all duration-300"
                        style={{
                          width: `${
                            ((
                              Object.keys(formData) as Array<
                                keyof FormDataTypes
                              >
                            ).filter((key) => formData[key]).length /
                              (fields.length +
                                headerFields.length +
                                footerFields.length)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Total Fields</span>
                      <span className="font-semibold text-text-heading">
                        {fields.length +
                          headerFields.length +
                          footerFields.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Completed</span>
                      <span className="font-semibold text-secondary">
                        {
                          (
                            Object.keys(formData) as Array<keyof FormDataTypes>
                          ).filter((key) => formData[key]).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Remaining</span>
                      <span className="font-semibold text-text-secondary">
                        {fields.length +
                          headerFields.length +
                          footerFields.length -
                          (
                            Object.keys(formData) as Array<keyof FormDataTypes>
                          ).filter((key) => formData[key]).length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <h3 className="text-text-heading font-bold text-lg mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleOpenAddFieldModal}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-bg-base border border-border text-text-heading rounded-lg hover:border-border-strong hover:shadow-card transition-all text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Field
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-bg-base border border-border text-text-heading rounded-lg hover:border-border-strong hover:shadow-card transition-all text-sm font-medium">
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
              <InputField
                label="Field Label"
                name="add_field_name"
                type="text"
                value={newField.field_name}
                onChange={(e) =>
                  setNewField({ ...newField, field_name: e.target.value })
                }
                placeholder="e.g., Contract Value"
                required
              />

              <div>
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                  Field Type
                </label>
                <select
                  value={newField.field_type}
                  onChange={(e) =>
                    setNewField({
                      ...newField,
                      field_type: e.target.value as
                        | "number"
                        | "select"
                        | "textarea"
                        | "text"
                        | "email"
                        | "date"
                        | "file",
                    })
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary text-sm text-text-secondary bg-bg-base"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Dropdown</option>
                </select>
              </div>

              {newField.field_type === "select" ? (
                <InputField
                  label="Options (comma-separated)"
                  name="add_field_options"
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  placeholder="e.g., Option 1, Option 2, Option 3"
                />
              ) : (
                <InputField
                  label="Placeholder Text"
                  name="add_field_placeholder"
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  placeholder="e.g., Enter contract value"
                />
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="newFieldRequired"
                  checked={newField.required}
                  onChange={(e) =>
                    setNewField({ ...newField, required: e.target.checked })
                  }
                  className="w-4 h-4 accent-secondary border-border rounded"
                />
                <label
                  htmlFor="newFieldRequired"
                  className="text-sm font-medium text-text-secondary cursor-pointer"
                >
                  Make this field required
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCloseAddFieldModal}
                className="flex-1 px-4 py-2.5 border border-border text-text-secondary font-semibold text-sm rounded-lg hover:bg-bg-base transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddField}
                disabled={!newField.field_name.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-hover text-on-brand rounded-lg hover:shadow-raised transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              <InputField
                label="Field Label"
                name="edit_field_name"
                type="text"
                value={newField.field_name}
                onChange={(e) =>
                  setNewField({ ...newField, field_name: e.target.value })
                }
                placeholder="Enter field label"
                required
              />

              <div>
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                  Field Type
                </label>
                <select
                  value={newField.field_type}
                  onChange={(e) =>
                    setNewField({
                      ...newField,
                      field_type: e.target.value as
                        | "number"
                        | "select"
                        | "textarea"
                        | "text"
                        | "email"
                        | "date"
                        | "file",
                    })
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary text-sm text-text-secondary bg-bg-base"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Dropdown</option>
                </select>
              </div>

              {newField.field_type === "select" ? (
                <InputField
                  label="Options (comma-separated)"
                  name="edit_field_options"
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  placeholder="e.g., Option 1, Option 2, Option 3"
                />
              ) : (
                <InputField
                  label="Placeholder Text"
                  name="edit_field_placeholder"
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  placeholder="e.g., Enter contract value"
                />
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="editFieldRequired"
                  checked={newField.required}
                  onChange={(e) =>
                    setNewField({ ...newField, required: e.target.checked })
                  }
                  className="w-4 h-4 accent-secondary border-border rounded"
                />
                <label
                  htmlFor="editFieldRequired"
                  className="text-sm font-medium text-text-secondary cursor-pointer"
                >
                  Make this field required
                </label>
              </div>

              <div className="bg-status-info-bg border border-status-info-border rounded-lg p-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-status-info flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary">
                  You can update this field&apos;s name, type, or other
                  properties anytime. Make sure to review changes before saving
                  to ensure data consistency.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCloseEditFieldModal}
                className="flex-1 px-4 py-2.5 border border-border text-text-secondary font-semibold text-sm rounded-lg hover:bg-bg-base transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateField}
                disabled={!newField.field_name.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-hover text-on-brand rounded-lg hover:shadow-raised transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
