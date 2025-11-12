"use client";

import DashboardLayout from "@/app/components/layout/DashboardLayout";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/app/components/ui/Button";
import {
  Plus,
  Sparkles,
  Bot,
  Zap,
  Brain,
  Lightbulb,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowLeft,
  Eye,
  Send,
  FileText,
  File,
  Edit2,
  Trash2,
  Info,
  Star,
} from "lucide-react";
import PageHeader from "@/app/components/page-header/PageHeader";
import Card from "@/app/components/ui/Card";
import SectionCard from "@/app/components/section-card/SectionCard";
import Modal from "@/app/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import LoadingSpinner from "@/app/components/loading-spinner/LoadingSpinner";

// TypeScript interfaces
interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

interface Invoice {
  user_id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  invoice_items: InvoiceItem[];
  custom_fields: Record<string, FormField>;
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  status: "paid" | "unpaid" | "draft" | "saved";
}

interface FormField {
  id: string;
  name: keyof Invoice | string;
  label: string;
  type: "text" | "email" | "date" | "number" | "textarea" | "select";
  placeholder: string;
  required: boolean;
  value: string;
  options?: string[];
}

const CreateInvoicePage: React.FC = () => {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const invoice_id = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);
  const isEditingMode = !!invoice_id;

  const router = useRouter();
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({
    user_id: !loading
      ? user?.user.user_id
      : "558c1976-7e9b-4fc7-bd97-ac4281a241e1",
    invoice_number:
      "INV-" + String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
    customer_name: "",
    customer_email: "",
    customer_address: "",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    payment_terms: "Net 15",
    invoice_items: [
      {
        id: "1",
        name: "",
        description: "",
        quantity: 0,
        price: 0,
        amount: 0,
      },
    ],
    custom_fields: {},
    subtotal: 0,
    vat: 0,
    total: 0,
    notes: "",
    status: "unpaid",
  });

  const [aiSuggestions, setAiSuggestions] = useState({
    items: [] as string[],
    notes: "",
    pricing: [] as { item: string; suggestedPrice: number }[],
    paymentTerms: "",
  });

  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  // Modal states
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [isEditFieldModalOpen, setIsEditFieldModalOpen] = useState(false);
  const [newField, setNewField] = useState<FormField>({
    id: `${new Date()}`,
    name: "",
    label: "",
    type: "text",
    placeholder: "",
    value: "",
    required: false,
  });

  //////////////////////////////////////
  //Fetch invoice details in editing mode
  ///////////////////////////////////////
  const fetchInvoiceDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/invoices/single/${invoice_id}`
      );
      if (response.status === 200) {
        const normalizedInvoice = {
          ...response.data,
          due_date: response.data.due_date
            ? new Date(response.data.due_date).toISOString().split("T")[0]
            : response.data.due_date,
          invoice_date: response.data.invoice_date
            ? new Date(response.data.invoice_date).toISOString().split("T")[0]
            : response.data.invoice_date,
          invoice_items: response.data.invoice_items.map(
            (item: InvoiceItem) => ({
              ...item,
              quantity: Number(item.quantity) || 0,
              price: Number(item.price) || 0,
              amount: Number(item.amount) || 0,
            })
          ),
          vat: Number(response.data.vat) || 0,
          total: Number(response.data.total) || 0,
          subtotal: Number(response.data.subtotal) || 0,
        };
        console.log(normalizedInvoice);
        setCurrentInvoice(normalizedInvoice);
      }
    } catch (error) {
      console.log("Error occure while getting invoice details", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (invoice_id) {
      fetchInvoiceDetails();
    }
  }, [invoice_id]);

  // Form fields array
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: "1",
      name: "customer_name",
      label: "Customer Name",
      type: "text",
      placeholder: "Enter customer name for AI suggestions...",
      required: true,
      value: "",
    },
    {
      id: "2",
      name: "invoice_number",
      label: "Invoice Number",
      type: "text",
      placeholder: "",
      required: false,
      value: currentInvoice.invoice_number,
    },
    {
      id: "3",
      name: "customer_email",
      label: "Customer Email",
      type: "email",
      placeholder: "Enter customer email",
      required: true,
      value: "",
    },
    {
      id: "4",
      name: "customer_address",
      label: "Customer Address",
      type: "text",
      placeholder: "Enter customer address",
      required: false,
      value: "",
    },
    {
      id: "5",
      name: "invoice_date",
      label: "Invoice Date",
      type: "date",
      placeholder: "",
      required: false,
      value: currentInvoice.invoice_date,
    },
    {
      id: "6",
      name: "due_date",
      label: "Due Date",
      type: "date",
      placeholder: "",
      required: false,
      value: currentInvoice.due_date,
    },
    {
      id: "7",
      name: "paymentTerms",
      label: "Payment Terms",
      type: "select",
      placeholder: "",
      required: false,
      value: currentInvoice.payment_terms,
      options: ["Net 15", "Net 30", "Net 45", "Due on receipt"],
    },
  ]);

  // Update form fields when currentInvoice changes
  useEffect(() => {
    setFormFields((prev) =>
      prev.map((field) => ({
        ...field,
        value: (currentInvoice[field.name as keyof Invoice] as string) || "",
      }))
    );
  }, [currentInvoice]);

  // Calculate invoice totals whenever items change
  useEffect(() => {
    const subtotal = currentInvoice.invoice_items?.reduce(
      (sum, item) => (sum = sum + item.amount),
      0
    );
    const vat = subtotal * 0.05; //5% VAT for uae
    const total = vat + subtotal;

    setCurrentInvoice((prev) => ({
      ...prev,
      subtotal,
      vat,
      total,
    }));
  }, [currentInvoice.invoice_items]);

  //Generate AI suggestions based on input
  const generateAiSuggestions = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const suggestions = {
        items: [
          "AI Consulting Services",
          "Machine Learning Implementation",
          "Data Analytics & Insights",
          "Automated Workflow Setup",
          "Predictive Maintenance",
        ],
        pricing: [
          { item: "AI Consulting Services", suggestedPrice: 1200 },
          { item: "Machine Learning Implementation", suggestedPrice: 2500 },
          { item: "Data Analytics & Insights", suggestedPrice: 800 },
          { item: "Automated Workflow Setup", suggestedPrice: 1500 },
          { item: "Predictive Maintenance", suggestedPrice: 3000 },
        ],
        notes:
          "Thank you for your business. Payment is due within the specified terms. For any questions regarding this invoice, please contact our AI support team.",
        paymentTerms: "Net 15",
      };

      setAiSuggestions(suggestions);
      setShowAiSuggestions(true);
      setIsGenerating(false);
    }, 2000);
  };

  // Apply AI Suggestion to item
  const applyItemSuggestion = (suggestion: string) => {
    const firstEmptyItem = currentInvoice.invoice_items.find(
      (item) => !item.name
    );
    if (firstEmptyItem) {
      handleItemChange(firstEmptyItem.id, "name", suggestion);

      // Also apply suggested pricing if available
      const pricingSuggestion = aiSuggestions.pricing.find(
        (p) => p.item === suggestion
      );

      if (pricingSuggestion) {
        handleItemChange(
          firstEmptyItem.id,
          "price",
          pricingSuggestion.suggestedPrice
        );
        handleItemChange(firstEmptyItem.id, "quantity", 1);
      }
    }
  };

  //Apply AI notes suggestions
  const applyNotesSuggestion = () => {
    handleInputChange("notes", aiSuggestions.notes);
  };

  //////////////////////////
  //Handle Invoice Add Item Function
  /////////////////////////
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 0,
      price: 0,
      amount: 0,
    };

    setCurrentInvoice((prev) => ({
      ...prev,
      invoice_items: [...prev.invoice_items, newItem],
    }));
  };

  ///////////////////////////////////
  // Handle Remove Invoice Item Function
  /////////////////////////////////
  const handleRemoveItem = (id: string) => {
    if (currentInvoice.invoice_items.length > 1) {
      setCurrentInvoice((prev) => ({
        ...prev,
        items: prev.invoice_items.filter((item) => item.id !== id),
      }));
    }
  };

  /////////////////////////////
  // Handle Invoice Item Change Function
  /////////////////////////////
  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: number | string
  ) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      invoice_items: prev.invoice_items.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            [field]: value,
          };

          // Recalculate amount if quantity or price changes
          if (field === "quantity" || field === "price") {
            updatedItem.amount =
              Number(updatedItem.quantity) * Number(updatedItem.price);
          }

          return updatedItem;
        }
        return item;
      }),
    }));
  };

  // ////////////////////////////
  // Handle Input Change Function
  ///////////////////////////////
  const handleInputChange = (field: keyof Invoice | string, value: string) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate suggestions when customer name is entered
    if (field === "customer_name" && value.length > 2 && !showAiSuggestions) {
      generateAiSuggestions();
    }
  };

  /////////////////////////////
  // Handle Add Field Function
  ///////////////////////////
  const handleAddField = () => {
    const fieldId = `custom_${Date.now()}`;

    setCurrentInvoice((prev) => ({
      ...prev,
      custom_fields: {
        ...prev.custom_fields,
        [fieldId]: {
          ...newField,
          id: fieldId,
          name: fieldId,
        },
      },
    }));
    toast.success("Field added!");
    setIsAddFieldModalOpen(false);
    setNewField({
      id: `${new Date()}`,
      name: "",
      label: "",
      type: "text",
      value: "",
      placeholder: "",
      required: false,
    });
  };

  /////////////////////////////
  // Handle Delete Field Function
  ///////////////////////////
  const handleDeleteField = (fieldId: string) => {
    setCurrentInvoice((prev) => {
      const updatedFields = { ...prev.custom_fields };
      delete updatedFields[fieldId];

      return {
        ...prev,
        custom_fields: updatedFields,
      };
    });
    toast.success("Field deleted!");
  };

  // const handleUpdateField = () => {
  //   // No functionality - just close modal
  //   setIsEditFieldModalOpen(false);
  //   setNewField({
  //     id: `${new Date()}`,
  //     name: "",
  //     label: "",
  //     type: "text",
  //     value: "",
  //     placeholder: "",
  //     required: false,
  //   });
  // };

  const handleCloseAddFieldModal = () => {
    setIsAddFieldModalOpen(false);
    setNewField({
      id: `${new Date()}`,
      name: "",
      label: "",
      type: "text",
      value: "",
      placeholder: "",
      required: false,
    });
  };

  const handleCloseEditFieldModal = () => {
    setIsEditFieldModalOpen(false);
    setNewField({
      id: `${new Date()}`,
      name: "",
      label: "",
      type: "text",
      value: "",
      placeholder: "",
      required: false,
    });
  };

  ///////////////////////////////////////////
  //Handle Save and Preview Invoice Function
  //////////////////////////////////////////
  const handleSaveandPreviewInvoice = async () => {
    try {
      if (isEditingMode) {
        const response = await axiosInstance.put(
          `/invoices/update/${invoice_id}`,
          {
            ...currentInvoice,
            items: currentInvoice.invoice_items,
          }
        );
        // Backend returns status 201
        if (response.status === 200) {
          toast.success("Invoice updated successfully!");
          // Navigate to preview
          router.push(`/dashboard/invoicing/preview/${invoice_id}`);
        }
      } else {
        const response = await axiosInstance.post(`/invoices/create`, {
          ...currentInvoice,
          items: currentInvoice.invoice_items,
        });

        // Backend returns status 201
        if (response.status === 201) {
          toast.success("Invoice saved successfully!");
          const invoice_id = response.data.invoice.uuid;
          // Navigate to preview
          router.push(`/dashboard/invoicing/preview/${invoice_id}`);
        }
      }
    } catch (error) {
      console.error("Error saving or updating invoice:", error);
      toast.error("Error saving or updating invoice");
    }
  };

  // Render input field based on type
  const renderInputField = (field: FormField & { onChange?: any }) => {
    const commonProps = {
      className: `w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white`,
      value: field.value,
      onChange:
        field.onChange ||
        ((
          e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >
        ) => handleInputChange(field.name as keyof Invoice, e.target.value)),
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={4}
            className={commonProps.className + " resize-none"}
          />
        );
      case "select":
        return (
          <select {...commonProps}>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "date":
      case "email":
      case "number":
      case "text":
      default:
        return (
          <input
            type={field.type}
            {...commonProps}
            readOnly={field.name === "invoiceNumber"}
            className={
              commonProps.className +
              (field.name === "invoiceNumber" ? " bg-gray-50" : "")
            }
          />
        );
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <div className="w-full">
          {/* Page Header */}
          <PageHeader
            showAIBadge={true}
            icon={<File size={24} />}
            title="Create AI Invoice"
            description=" Intelligent invoice creation with AI-powered suggestions and
                automated optimization"
            buttons={[
              {
                text: "Back To Invoices",
                onClick: () => router.push("/dashboard/invoicing"),
                icon: <ArrowLeft size={20} />,
              },
            ]}
          />

          {/* AI Assistant Banner */}
          <Card className="bg-gradient-to-r from-[#1B2A49] to-[#2D4A7C] text-white mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mt-1">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    AI Invoice Assistant
                  </h3>
                  <p className="text-blue-100 max-w-2xl">
                    Get intelligent suggestions for items, pricing, and
                    professional notes. Our AI analyzes industry standards to
                    optimize your invoice.
                  </p>
                </div>
              </div>
              <Button
                onClick={generateAiSuggestions}
                disabled={isGenerating}
                className="bg-white text-[#1B2A49] hover:bg-gray-100 shadow-lg"
                startIcon={
                  isGenerating ? (
                    <Clock className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )
                }
              >
                {isGenerating ? "AI Thinking..." : "Get AI Suggestions"}
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-[#E1E8F5] overflow-hidden">
                <div className="p-6 border-b border-[#E1E8F5] bg-white flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#1B2A49] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#1B2A49]" />
                      Invoice Details
                    </h2>
                    <p className="text-[#344767] mt-1">
                      Fill in the basic information for your AI-powered invoice
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsAddFieldModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Customer & Basic Info */}
                  <div className="grid grid-cols-1 gap-6 mb-8">
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <label className="text-[#1B2A49] font-semibold text-sm flex items-center gap-2">
                            {field.label}
                            {field.name === "customerName" && (
                              <Lightbulb className="w-3 h-3 text-amber-500" />
                            )}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>
                        </div>
                        {renderInputField(field)}
                      </div>
                    ))}

                    {Object.entries(currentInvoice.custom_fields).map(
                      ([key, field]) => (
                        <div key={key} className="space-y-3 relative group">
                          <div className="flex items-center justify-between">
                            <label className="text-[#1B2A49] font-semibold text-sm flex items-center gap-2">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                              {/* Custom Badge */}
                              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-[#665c00] bg-yellow-100 rounded-full">
                                <Star className="w-3 h-3 text-[#f5b700]" />
                                Custom Added
                              </span>
                            </label>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* <button
                                type="button"
                                className="p-1.5 bg-blue-100 text-[#2E69A4] rounded hover:bg-blue-200 transition-colors"
                                title="Edit field"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button> */}
                              <button
                                onClick={() => handleDeleteField(field.id)}
                                type="button"
                                className="p-1.5 bg-red-100 text-red-500 rounded hover:bg-red-200 transition-colors"
                                title="Remove field"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {renderInputField({
                            ...field,
                            onChange: (
                              e: React.ChangeEvent<
                                | HTMLInputElement
                                | HTMLTextAreaElement
                                | HTMLSelectElement
                              >
                            ) => {
                              setCurrentInvoice((prev) => ({
                                ...prev,
                                custom_fields: {
                                  ...prev.custom_fields,
                                  [key]: {
                                    ...prev.custom_fields[key],
                                    value: e.target.value,
                                  },
                                },
                              }));
                            },
                          })}
                        </div>
                      )
                    )}

                    {/* Payment Method Checkbox and Dropdown */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="addPaymentMethod"
                          checked={showPaymentMethod}
                          onChange={(e) =>
                            setShowPaymentMethod(e.target.checked)
                          }
                          className="w-4 h-4 text-[#2E69A4] border-[#E1E8F5] rounded focus:ring-[#2E69A4]"
                        />
                        <label
                          htmlFor="addPaymentMethod"
                          className="text-sm font-medium text-[#344767] cursor-pointer"
                        >
                          Add Payment Method
                        </label>
                      </div>

                      {showPaymentMethod && (
                        <div className="space-y-3 relative group">
                          <div className="flex items-center justify-between">
                            <label className="block text-[#1B2A49] font-semibold text-sm">
                              Payment Method
                            </label>
                          </div>
                          <select className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white">
                            <option value="">Select Payment Method</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="cash">Cash</option>
                            <option value="check">Check</option>
                            <option value="digital_wallet">
                              Digital Wallet
                            </option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items & Services */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-[#1B2A49] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#1B2A49]" />
                        Items & Services
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#344767] bg-blue-50 px-3 py-1 rounded-full">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        AI Pricing Suggestions
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-[#E1E8F5] rounded-lg">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#1B2A49] to-[#2D4A7C]">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Item/Service
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Qty
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Price (AED)
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Amount (AED)
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentInvoice.invoice_items?.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-[#E1E8F5] hover:bg-blue-50/30 transition-colors duration-200"
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white"
                                  value={item.name}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="AI Service Name"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Service description"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  className="w-20 px-3 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      "quantity",
                                      e.target.value || 0
                                    )
                                  }
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-32 px-3 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white"
                                  value={item.price}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      "price",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-[#1B2A49]">
                                AED {item.amount.toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed px-3 py-1 rounded-lg hover:bg-red-50"
                                  disabled={
                                    currentInvoice.invoice_items.length === 1
                                  }
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddItem}
                    className="mb-8 bg-transparent shadow-none py-2 px-4 text-[#1B2A49] hover:bg-blue-50 border border-dashed border-[#E1E8F5] rounded-lg transition-all duration-200"
                    startIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Another Item
                  </Button>

                  {/* Invoice Summary */}
                  <div className="bg-white rounded-lg shadow-sm border border-[#E1E8F5] overflow-hidden mb-8">
                    <div className="p-4 border-b border-[#E1E8F5] bg-gray-50">
                      <h3 className="text-lg font-bold text-[#1B2A49] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#1B2A49]" />
                        Invoice Summary
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#344767]">
                            Subtotal:
                          </span>
                          <span className="text-sm font-semibold text-[#1B2A49]">
                            AED {Number(currentInvoice.subtotal).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#344767]">
                            VAT (5%):
                          </span>
                          <span className="text-sm font-semibold text-[#1B2A49]">
                            AED {Number(currentInvoice.vat).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-[#E1E8F5] pt-4 flex justify-between items-center">
                          <span className="font-bold text-[#1B2A49]">
                            Total:
                          </span>
                          <span className="font-bold text-xl text-[#1B2A49]">
                            AED {Number(currentInvoice.total).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="mb-8">
                    <div className="space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <label className="text-[#1B2A49] font-semibold text-sm flex items-center gap-2">
                          Notes & AI Suggestions
                          <Sparkles className="w-3 h-3 text-blue-500" />
                        </label>
                      </div>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767] bg-white resize-none"
                        value={currentInvoice.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        placeholder="Add any additional notes or let AI generate professional invoice notes..."
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-6 border-t border-[#E1E8F5]">
                    <Button
                      onClick={() => router.push("/dashboard/invoicing")}
                      className="border border-[#E1E8F5] text-[#344767] bg-white hover:bg-[#F4F7FA] shadow-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSaveandPreviewInvoice}
                      startIcon={<Send className="w-4 h-4" />}
                    >
                      Save & Preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestions Sidebar */}
            <div className="space-y-6 lg:col-span-1">
              <SectionCard title="AI Suggestions" icon={Brain}>
                <div>
                  {showAiSuggestions ? (
                    <div className="space-y-6">
                      {/* Item Suggestions */}
                      <div>
                        <h4 className="font-semibold text-[#1B2A49] mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Popular AI Services
                        </h4>
                        <div className="space-y-2">
                          {aiSuggestions.items.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => applyItemSuggestion(item)}
                              className="w-full text-left p-3 border border-[#E1E8F5] rounded-lg hover:border-[#1B2A49] hover:bg-blue-50 transition-all duration-200 group"
                            >
                              <div className="text-sm font-medium text-[#344767] group-hover:text-[#1B2A49]">
                                {item}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Click to add
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes Suggestion */}
                      <div>
                        <h4 className="font-semibold text-[#1B2A49] mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          Professional Notes
                        </h4>
                        <div className="p-3 border border-[#E1E8F5] rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-600 mb-3">
                            {aiSuggestions.notes}
                          </p>
                          <Button
                            onClick={applyNotesSuggestion}
                            className="w-full bg-white border border-[#E1E8F5] text-[#344767] hover:bg-gray-50 text-sm py-2"
                            startIcon={<CheckCircle className="w-3 h-3" />}
                          >
                            Use This Text
                          </Button>
                        </div>
                      </div>

                      {/* AI Tips */}
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div>
                            <h5 className="font-semibold text-amber-800 text-sm">
                              AI Tip
                            </h5>
                            <p className="text-amber-700 text-xs mt-1">
                              Based on industry analysis, AI services typically
                              range from AED 800-3000 depending on complexity.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        {currentInvoice.customer_name
                          ? "Enter customer details to get AI suggestions"
                          : "Start typing customer name for AI-powered suggestions"}
                      </p>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
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
                value={newField.label}
                onChange={(e) =>
                  setNewField({ ...newField, label: e.target.value })
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
                value={newField.type}
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    type: e.target.value as any,
                  })
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

            {newField.type === "select" ? (
              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Options (comma-separated)
                </label>
                <input
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  placeholder="e.g., Option 1, Option 2, Option 3"
                  className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  placeholder="e.g., Enter contract value"
                  className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767]"
                />
              </div>
            )}

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
              disabled={!newField.label.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Field Modal */}
      {/* <Modal
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
                value={newField.label}
                onChange={(e) =>
                  setNewField({ ...newField, label: e.target.value })
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
                value={newField.type}
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    type: e.target.value as any,
                  })
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

            {newField.type === "select" ? (
              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Options (comma-separated)
                </label>
                <input
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  placeholder="e.g., Option 1, Option 2, Option 3"
                  className="w-full px-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-sm text-[#344767]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  placeholder="e.g., Enter contract value"
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
                You can update this field&apos;s name, type, or other properties
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
              disabled={!newField.label.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Update Field
            </button>
          </div>
        </div>
      </Modal> */}
    </DashboardLayout>
  );
};

export default CreateInvoicePage;
