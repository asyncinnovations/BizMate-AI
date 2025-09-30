"use client";

import DashboardLayout from "@/app/components/layout/DashboardLayout";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

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
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  items: InvoiceItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  status: "paid" | "unpaid" | "draft" | "saved";
  createdAt: string;
}

const CreateInvoicePage: React.FC = () => {
  const router = useRouter();
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({
    id: "",
    invoiceNumber:
      "INV-" + String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    paymentTerms: "Net 15",
    items: [
      {
        id: "1",
        name: "",
        description: "",
        quantity: 1,
        price: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    vat: 0,
    total: 0,
    notes: "",
    status: "draft",
    createdAt: new Date().toISOString(),
  });

  const [aiSuggestions, setAiSuggestions] = useState({
    items: [] as string[],
    notes: "",
    pricing: [] as { item: string; suggestedPrice: number }[],
    paymentTerms: "",
  });

  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate invoice totals whenever items change
  useEffect(() => {
    const subtotal = currentInvoice.items.reduce(
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
  }, [currentInvoice.items]);

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
    const firstEmptyItem = currentInvoice.items.find((item) => !item.name);
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

  // Apply AI notes suggestion
  const applyNotesSuggestion = () => {
    handleInputChange("notes", aiSuggestions.notes);
  };

  // Handler functions
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      price: 0,
      amount: 0,
    };

    setCurrentInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (currentInvoice.items.length > 1) {
      setCurrentInvoice((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

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

  const handleInputChange = (field: keyof Invoice, value: string) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate suggestions when customer name is entered
    if (field === "customerName" && value.length > 2 && !showAiSuggestions) {
      generateAiSuggestions();
    }
  };

  const handleSaveInvoice = () => {
    // In a real app, you would save to a database or state management
    const newInvoice: Invoice = {
      ...currentInvoice,
      id: Date.now().toString(),
      status: "saved",
    };

    // For demo purposes, we'll just navigate to preview
    router.push(
      `/dashboard/invoicing/preview/${newInvoice.id}?data=${encodeURIComponent(
        JSON.stringify(newInvoice)
      )}`
    );
  };

  const handlePreview = () => {
    router.push(
      `/dashboard/invoicing/preview/temp?data=${encodeURIComponent(
        JSON.stringify(currentInvoice)
      )}`
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 mb-4">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-[#1B2A49] to-[#2D4A7C] rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-br from-[#1B2A49] to-[#2D4A7C] bg-clip-text text-transparent">
                  Create AI Invoice
                </h1>
                <span className="px-3 py-1 bg-gradient-to-r from-[#1B2A49] to-[#2D4A7C] text-white text-sm font-medium rounded-full flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  AI Powered
                </span>
              </div>
              <p className="text-[#344767] text-lg max-w-2xl">
                Intelligent invoice creation with AI-powered suggestions and
                automated optimization
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button
                onClick={() => router.push("/dashboard/invoicing")}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Invoices
              </Button>
            </div>
          </div>

          {/* AI Assistant Banner */}
          <div className="bg-gradient-to-r from-[#1B2A49] to-[#2D4A7C] rounded-2xl p-6 mb-8 text-white shadow-lg">
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
                icon={
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-white">
                  <h2 className="text-xl font-bold text-[#1B2A49] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1B2A49]" />
                    Invoice Details
                  </h2>
                  <p className="text-[#344767] mt-1">
                    Fill in the basic information for your AI-powered invoice
                  </p>
                </div>

                <div className="p-6">
                  {/* Customer & Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-[#344767] mb-2 flex items-center gap-2">
                        Customer Name
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-white"
                        value={currentInvoice.customerName}
                        onChange={(e) =>
                          handleInputChange("customerName", e.target.value)
                        }
                        placeholder="Enter customer name for AI suggestions..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#344767] mb-2">
                        Invoice Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-gray-50"
                        value={currentInvoice.invoiceNumber}
                        onChange={(e) =>
                          handleInputChange("invoiceNumber", e.target.value)
                        }
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#344767] mb-2">
                        Invoice Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-white"
                        value={currentInvoice.invoiceDate}
                        onChange={(e) =>
                          handleInputChange("invoiceDate", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#344767] mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-white"
                        value={currentInvoice.dueDate}
                        onChange={(e) =>
                          handleInputChange("dueDate", e.target.value)
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#344767] mb-2">
                        Payment Terms
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-white"
                        value={currentInvoice.paymentTerms}
                        onChange={(e) =>
                          handleInputChange("paymentTerms", e.target.value)
                        }
                      >
                        <option>Net 15</option>
                        <option>Net 30</option>
                        <option>Net 45</option>
                        <option>Due on receipt</option>
                      </select>
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

                    <div className="overflow-x-auto border border-gray-300 rounded-xl">
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
                          {currentInvoice.items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-gray-200 hover:bg-blue-50/30 transition-colors duration-200"
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-white"
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-white"
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
                                  min="1"
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-white"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      "quantity",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-white"
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
                                  disabled={currentInvoice.items.length === 1}
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
                    className="mb-8 bg-transparent shadow-none py-2 px-4 text-[#1B2A49] hover:bg-blue-50 border border-dashed border-gray-300 rounded-xl transition-all duration-200"
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add Another Item
                  </Button>

                  {/* Invoice Summary - Now placed inside the main form */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
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
                            AED {currentInvoice.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#344767]">
                            VAT (5%):
                          </span>
                          <span className="text-sm font-semibold text-[#1B2A49]">
                            AED {currentInvoice.vat.toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                          <span className="font-bold text-[#1B2A49]">
                            Total:
                          </span>
                          <span className="font-bold text-xl text-[#1B2A49]">
                            AED {currentInvoice.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-[#344767] mb-2 flex items-center gap-2">
                      Notes & AI Suggestions
                      <Sparkles className="w-3 h-3 text-blue-500" />
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A49] focus:border-[#1B2A49] transition-all duration-200 bg-white"
                      value={currentInvoice.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Add any additional notes or let AI generate professional invoice notes..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      onClick={() => router.push("/dashboard/invoicing")}
                      className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePreview}
                      className="bg-[#f6a821] hover:bg-[#d18d18]"
                      icon={<Eye className="w-4 h-4" />}
                    >
                      Preview
                    </Button>
                    <Button
                      onClick={handleSaveInvoice}
                      icon={<Send className="w-4 h-4" />}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestions Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#1B2A49] to-[#2D4A7C]">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Suggestions
                  </h3>
                </div>

                <div className="p-4">
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
                              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-[#1B2A49] hover:bg-blue-50 transition-all duration-200 group"
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
                        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-600 mb-3">
                            {aiSuggestions.notes}
                          </p>
                          <Button
                            onClick={applyNotesSuggestion}
                            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm py-2"
                            icon={<CheckCircle className="w-3 h-3" />}
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
                        {currentInvoice.customerName
                          ? "Enter customer details to get AI suggestions"
                          : "Start typing customer name for AI-powered suggestions"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateInvoicePage;
