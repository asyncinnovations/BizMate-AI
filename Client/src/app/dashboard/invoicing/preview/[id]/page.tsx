"use client";

import DashboardLayout from "@/app/components/layout/DashboardLayout";
import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  Send,
  FileText,
  ArrowLeft,
  Printer,
  CheckCircle,
} from "lucide-react";
import Button from "@/app/components/ui/Button";
import { getStatusBadge } from "@/lib/statusBadge";

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
  status: "paid" | "unpaid" | "draft";
  createdAt: string;
}

const InvoicePreviewPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = params.id as string;

  // Get invoice data from URL params (in real app, fetch from API)
  const invoiceData = searchParams.get("data");
  const currentInvoice: Invoice = invoiceData
    ? JSON.parse(decodeURIComponent(invoiceData))
    : {
        id: invoiceId,
        invoiceNumber: "INV-001",
        customerName: "Sample Customer",
        customerEmail: "customer@example.com",
        customerAddress: "123 Business District, Dubai, UAE",
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        paymentTerms: "Net 15",
        items: [
          {
            id: "1",
            name: "Consulting Services",
            description:
              "Professional business consultation and strategic planning services for Q4 2024",
            quantity: 1,
            price: 1000,
            amount: 1000,
          },
          {
            id: "2",
            name: "Technical Implementation",
            description:
              "System setup, configuration, and deployment of enterprise software solutions",
            quantity: 2,
            price: 750,
            amount: 1500,
          },
        ],
        subtotal: 2500,
        vat: 125,
        total: 2625,
        notes:
          "Thank you for your business. Payment is due within the specified terms. Please contact us with any questions regarding this invoice.",
        status: "draft",
        createdAt: new Date().toISOString(),
      };

  const handleDownloadPDF = (invoice: Invoice) => {
    // In a real app, this would generate a PDF
    alert(`Downloading PDF for ${invoice.invoiceNumber}`);
  };

  const handleSendEmail = (invoice: Invoice) => {
    // In a real app, this would send an email
    alert(`Sending email for ${invoice.invoiceNumber}`);
  };

  const handlePrint = () => {
    console.log("Document Print Successfully!");
    alert("Document Print Successfully!");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 mb-4">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Invoice Preview
              </h1>
              <p className="text-gray-600">
                Review your invoice before sending to customer
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button
                onClick={() => router.push("/dashboard/invoicing")}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Invoices
              </Button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">
                      {currentInvoice.invoiceNumber}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      For {currentInvoice.customerName}
                    </p>
                  </div>
                </div>
                <span className={getStatusBadge(currentInvoice.status)}>
                  {(currentInvoice.status === "paid" || "saved") && (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  {currentInvoice.status.charAt(0).toUpperCase() +
                    currentInvoice.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handlePrint}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  icon={<Printer className="w-4 h-4" />}
                >
                  Print
                </Button>
                <Button
                  onClick={() => handleDownloadPDF(currentInvoice)}
                  className="bg-[#f6a821] hover:bg-[#d18d18]"
                  icon={<Download className="w-4 h-4" />}
                >
                  Download PDF
                </Button>
                <Button
                  onClick={() => handleSendEmail(currentInvoice)}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send to Customer
                </Button>
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 rounded-lg">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      Business Solutions Inc.
                    </div>
                    <div className="text-gray-600 text-sm">
                      Professional Services & Consulting
                    </div>
                    <div className="text-gray-600 text-sm mt-2">
                      Dubai Internet City, Dubai, UAE
                    </div>
                    <div className="text-gray-600 text-sm">
                      Tel: +971 4 123 4567
                    </div>
                    <div className="text-gray-600 text-sm">
                      VAT No: 123456789012345
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      INVOICE
                    </h1>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between gap-4">
                        <span className="font-semibold">Invoice #:</span>
                        <span>{currentInvoice.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="font-semibold">Date:</span>
                        <span>
                          {new Date(
                            currentInvoice.invoiceDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="font-semibold">Due Date:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(
                            currentInvoice.dueDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="font-semibold">Terms:</span>
                        <span>{currentInvoice.paymentTerms}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* From/To Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                      From
                    </h3>
                    <div className="text-gray-900 font-semibold">
                      Business Solutions Inc.
                    </div>
                    <div className="text-gray-600">Dubai Internet City</div>
                    <div className="text-gray-600">
                      Dubai, United Arab Emirates
                    </div>
                    <div className="text-gray-600 mt-2">
                      Email: accounting@businesssolutions.ae
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                      Bill To
                    </h3>
                    <div className="text-gray-900 font-semibold">
                      {currentInvoice.customerName}
                    </div>
                    {currentInvoice.customerAddress && (
                      <div className="text-gray-600">
                        {currentInvoice.customerAddress}
                      </div>
                    )}
                    {currentInvoice.customerEmail && (
                      <div className="text-gray-600">
                        {currentInvoice.customerEmail}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 w-2/5">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 w-1/6">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 w-1/6">
                          Unit Price (AED)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 w-1/6">
                          Amount (AED)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentInvoice.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            {item.description && (
                              <div className="text-sm text-gray-500 mt-1 max-w-xs break-words">
                                {item.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {item.price.toLocaleString()}.00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                            {item.amount.toLocaleString()}.00
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-80">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="py-2 text-sm text-gray-600">
                              Subtotal:
                            </td>
                            <td className="py-2 text-sm font-semibold text-gray-900 text-right">
                              AED {currentInvoice.subtotal.toLocaleString()}.00
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm text-gray-600">
                              VAT (5%):
                            </td>
                            <td className="py-2 text-sm font-semibold text-gray-900 text-right">
                              AED {currentInvoice.vat.toLocaleString()}.00
                            </td>
                          </tr>
                          <tr className="border-t border-gray-200">
                            <td className="py-3 font-bold text-gray-900">
                              Total Due:
                            </td>
                            <td className="py-3 font-bold text-lg text-gray-900 text-right">
                              AED {currentInvoice.total.toLocaleString()}.00
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Payment Instructions
                  </h3>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    <p className="mb-2">
                      <strong>Bank Transfer:</strong>
                      <br />
                      Bank: Emirates NBD
                      <br />
                      Account Name: Business Solutions Inc.
                      <br />
                      Account Number: 012345678901
                      <br />
                      IBAN: AE070331234567890123456
                    </p>
                    <p>
                      Please include invoice number{" "}
                      {currentInvoice.invoiceNumber} with your payment.
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {currentInvoice.notes && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {currentInvoice.notes}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    Thank you for your business. For questions regarding this
                    invoice,
                    <br />
                    please contact our accounting department at
                    accounting@businesssolutions.ae
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-6 bg-white border border-gray-300 rounded-lg px-6 py-4">
              <div className="text-sm text-gray-600">
                Ready to send this invoice to your customer?
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/dashboard/invoicing/new")}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Create New
                </Button>
                <Button
                  onClick={() => handleSendEmail(currentInvoice)}
                  className="text-sm"
                  icon={<Send className="w-4 h-4" />}
                >
                  Send to Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            background: white;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default InvoicePreviewPage;
