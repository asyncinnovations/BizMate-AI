"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Sparkles,
  Save,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
  Wand2,
} from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import PageHeader from "@/app/components/page-header/PageHeader";
import { documentConfigs } from "@/app/config/documentConfigs";

export default function DocumentFormPage() {
  const router = useRouter();
  const params = useParams();
  const documentType = params?.type as string;

  const [aiProcessing, setAiProcessing] = useState<boolean>(false);
  const [savedDraft, setSavedDraft] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentConfig = documentConfigs[documentType] || documentConfigs["nda"];

  useEffect(() => {
    // Simulate AI auto-fill for certain fields
    const autoFillData: Record<string, string> = {};

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

    setFormData(autoFillData);
  }, [documentType, currentConfig.fields]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const validateForm = () => {
    const newErros: Record<string, string> = {};
    currentConfig.fields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErros[field.id] = `${field.label} is Required`;
      }
    });

    setErrors(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2000);
  };

  const handleAISuggest = async (fieldId: string) => {
    setAiProcessing(true);
    // Simulate AI processing
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    // Mock AI suggestions based on field
    const suggestions: Record<string, string> = {
      purpose:
        "Discussion of potential business partnership and exchange of proprietary technical information related to software development services.",
      benefits:
        "Medical insurance (family coverage), annual air ticket, housing allowance (AED 3,000/month), performance bonus",
      description:
        "Software development and consulting services as per project scope defined in attached Statement of Work",
      paymentTerms:
        "Payment to be made within 30 days via bank transfer to:\nBank: Emirates NBD\nAccount: 1234567890\nIBAN: AE070331234567890123456",
    };

    if (suggestions[fieldId]) {
      setFormData((prev) => ({ ...prev, [fieldId]: suggestions[fieldId] }));
    }

    setAiProcessing(false);
  };

  const handlePreview = () => {
    if (validateForm()) {
      router.push(
        `/dashboard/documents/preview/${documentType}?data=${encodeURIComponent(
          JSON.stringify(formData)
        )}`
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F4F7FA] p-6 mb-4">
        {/* Header */}
        <PageHeader
          title={currentConfig.title}
          description={currentConfig.description}
          showAIBadge={true}
          icon={<FileText size={24} />}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-[#E1E8F5] p-8">
              {/* AI Auto-fill Notice */}
              {Object.values(formData).some((val) => val) && (
                <div className="mb-6 p-4 bg-[#2E69A4]/5 border border-[#2E69A4]/20 rounded-lg flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#2E69A4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#1B2A49] font-semibold text-sm">
                      AI Auto-fill Active
                    </p>
                    <p className="text-[#344767] text-sm">
                      Some fields have been pre-filled from your business
                      profile. Review and edit as needed.
                    </p>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <form className="space-y-6">
                {currentConfig.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
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
                    </label>

                    <div className="relative">
                      {field.type === "textarea" ? (
                        <div>
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
                          {[
                            "purpose",
                            "benefits",
                            "description",
                            "paymentTerms",
                          ].includes(field.id) && (
                            <button
                              type="button"
                              onClick={() => handleAISuggest(field.id)}
                              disabled={aiProcessing}
                              className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#F6A821] text-white px-3 py-1.5 rounded-md hover:bg-[#F6A821]/90 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                              {aiProcessing ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Wand2 className="w-4 h-4" />
                                  AI Suggest
                                </>
                              )}
                            </button>
                          )}
                        </div>
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
                  <span className="font-medium">Draft saved successfully!</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sticky top-2 h-[80vh]">
            {/* Document Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
              <h3 className="text-[#1B2A49] font-bold text-lg mb-4">
                Document Progress
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
                          currentConfig.fields.length) *
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
                          (Object.keys(formData).filter((key) => formData[key])
                            .length /
                            currentConfig.fields.length) *
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
                      {currentConfig.fields.length}
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
                      {currentConfig.fields.length -
                        Object.keys(formData).filter((key) => formData[key])
                          .length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
              <h3 className="text-[#1B2A49] font-bold text-lg mb-4">
                Compliance Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#F4F7FA] rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#1B2A49] font-medium text-sm">
                      UAE Compliant
                    </p>
                    <p className="text-[#344767] text-xs mt-1">
                      This document follows UAE legal requirements
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#F4F7FA] rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#1B2A49] font-medium text-sm">
                      AI Verified
                    </p>
                    <p className="text-[#344767] text-xs mt-1">
                      Content checked for accuracy and completeness
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#F4F7FA] rounded-lg">
                  <Info className="w-5 h-5 text-[#2E69A4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#1B2A49] font-medium text-sm">
                      Legal Review
                    </p>
                    <p className="text-[#344767] text-xs mt-1">
                      Consider professional review for complex cases
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
