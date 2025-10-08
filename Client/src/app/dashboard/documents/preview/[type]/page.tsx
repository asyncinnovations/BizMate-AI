"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Download,
  CheckCircle,
  Sparkles,
  FileText,
  Loader2,
  X,
  Send,
  Copy,
  Check,
  Printer,
  ArrowLeft,
} from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import PageHeader from "@/app/components/page-header/PageHeader";
import Button from "@/app/components/ui/Button";

export default function DocumentPreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const documentType = params?.type as string;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dataParam = searchParams?.get("data");
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setFormData(parsed);
      } catch (e) {
        console.error("Failed to parse form data");
      }
    }
  }, [searchParams]);

  const documentTitles: Record<string, string> = {
    nda: "Non-Disclosure Agreement",
    "employment-contract": "Employment Contract",
    invoice: "VAT Invoice",
    "service-agreement": "Service Agreement",
    "offer-letter": "Job Offer Letter",
    "termination-letter": "Employment Termination Letter",
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDownloading(false);
    alert("PDF downloaded successfully!");
  };

  const handleSendEmail = async () => {
    if (!emailAddress) return;

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setEmailSent(true);
    setTimeout(() => {
      setShowEmailModal(false);
      setEmailSent(false);
      setEmailAddress("");
      setEmailMessage("");
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderDocumentContent = () => {
    switch (documentType) {
      case "nda":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                NON-DISCLOSURE AGREEMENT
              </h1>
              <p className="text-gray-600">
                Effective Date: {formData.effectiveDate || "[Date]"}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This Non-Disclosure Agreement (the "Agreement") is entered into
                on <strong>{formData.effectiveDate || "[Date]"}</strong> by and
                between:
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">
                  DISCLOSING PARTY:
                </p>
                <p className="text-gray-700">
                  {formData.disclosingParty || "[Company Name]"}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {formData.disclosingPartyAddress || "[Address]"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">
                  RECEIVING PARTY:
                </p>
                <p className="text-gray-700">
                  {formData.receivingParty || "[Client/Partner Name]"}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {formData.receivingPartyAddress || "[Address]"}
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  1. PURPOSE
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {formData.purpose ||
                    'The parties wish to explore a business opportunity of mutual interest and benefit (the "Purpose"). In connection with this Purpose, it may be necessary for the Disclosing Party to disclose certain confidential information to the Receiving Party.'}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  2. DEFINITION OF CONFIDENTIAL INFORMATION
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  "Confidential Information" means any and all information
                  disclosed by the Disclosing Party to the Receiving Party,
                  whether orally, in writing, or in any other form, including
                  but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
                  <li>Technical data, trade secrets, and know-how</li>
                  <li>
                    Business plans, financial information, and customer lists
                  </li>
                  <li>Product designs, specifications, and prototypes</li>
                  <li>Software, algorithms, and source code</li>
                  <li>Marketing strategies and business methods</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  3. OBLIGATIONS OF RECEIVING PARTY
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The Receiving Party agrees to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
                  <li>
                    Hold and maintain the Confidential Information in strict
                    confidence
                  </li>
                  <li>
                    Use the Confidential Information only for the Purpose stated
                    above
                  </li>
                  <li>
                    Not disclose the Confidential Information to any third party
                    without prior written consent
                  </li>
                  <li>
                    Protect the Confidential Information using the same degree
                    of care used to protect its own confidential information
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  4. TERM
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  This Agreement shall remain in effect for a period of{" "}
                  <strong>{formData.duration || "[Duration]"}</strong> from the
                  Effective Date, unless earlier terminated by either party with
                  thirty (30) days written notice.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  5. RETURN OF MATERIALS
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Upon termination of this Agreement or upon request by the
                  Disclosing Party, the Receiving Party shall promptly return or
                  destroy all Confidential Information, including all copies,
                  notes, and derivatives thereof.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  6. GOVERNING LAW
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  This Agreement shall be governed by and construed in
                  accordance with the laws of{" "}
                  <strong>{formData.jurisdiction || "[Jurisdiction]"}</strong>,
                  without regard to its conflict of law provisions.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="font-bold text-gray-900 mb-4">
                      DISCLOSING PARTY:
                    </p>
                    <p className="text-gray-700 mb-1">
                      {formData.disclosingParty || "[Company Name]"}
                    </p>
                    <div className="border-b-2 border-gray-900 w-48 mt-8 mb-1"></div>
                    <p className="text-sm text-gray-600">
                      Authorized Signature
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Date: _________________
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-4">
                      RECEIVING PARTY:
                    </p>
                    <p className="text-gray-700 mb-1">
                      {formData.receivingParty || "[Client/Partner Name]"}
                    </p>
                    <div className="border-b-2 border-gray-900 w-48 mt-8 mb-1"></div>
                    <p className="text-sm text-gray-600">
                      Authorized Signature
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Date: _________________
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "invoice":
        const amount = parseFloat(formData.amount || "0");
        const vatRate = formData.vatRate?.includes("5%") ? 0.05 : 0;
        const vatAmount = amount * vatRate;
        const totalAmount = amount + vatAmount;

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  INVOICE
                </h1>
                <p className="text-gray-600">
                  #{formData.invoiceNumber || "INV-XXXX"}
                </p>
              </div>
              <div className="text-right">
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">Date:</span>
                    <span>{formData.invoiceDate || "[Date]"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">Due Date:</span>
                    <span className="font-semibold text-gray-900">
                      {formData.dueDate || "[Date]"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  From
                </h3>
                <div className="text-gray-900 font-semibold">
                  {formData.disclosingParty ||
                    formData.serviceProvider ||
                    formData.companyName ||
                    formData.employerName ||
                    "Tech Solutions LLC"}
                </div>
                <div className="text-gray-600">Dubai, United Arab Emirates</div>
                <div className="text-gray-600 text-sm mt-2">
                  TRN: 123456789000003
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Bill To
                </h3>
                <div className="text-gray-900 font-semibold">
                  {formData.clientName || "[Client Name]"}
                </div>
                <div className="text-gray-600">
                  {formData.clientAddress || "[Client Address]"}
                </div>
                {formData.clientTRN && (
                  <div className="text-gray-600 text-sm mt-2">
                    TRN: {formData.clientTRN}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">
                      Amount (AED)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formData.description || "Services rendered"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        VAT ({formData.vatRate || "5% Standard"})
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {vatAmount.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900 text-lg">
                      TOTAL
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 text-xl">
                      AED {totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {formData.paymentTerms && (
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <p className="font-semibold text-gray-900 mb-2">
                  Payment Terms:
                </p>
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {formData.paymentTerms}
                </p>
              </div>
            )}

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
                  Account Name: Tech Solutions LLC
                  <br />
                  Account Number: 012345678901
                  <br />
                  IBAN: AE070331234567890123456
                </p>
                <p>
                  Please include invoice number{" "}
                  {formData.invoiceNumber || "INV-XXXX"} with your payment.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Thank you for your business. For questions regarding this
                invoice,
                <br />
                please contact our accounting department at
                accounting@techsolutions.ae
              </p>
            </div>
          </div>
        );

      case "employment-contract":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                EMPLOYMENT CONTRACT
              </h1>
              <p className="text-gray-600">United Arab Emirates</p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This Employment Contract is entered into on{" "}
                <strong>{formData.startDate || "[Start Date]"}</strong> between:
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">EMPLOYER:</p>
                <p className="text-gray-700">
                  {formData.employerName || "[Company Name]"}
                </p>
                <p className="text-gray-600 text-sm">
                  License No: {formData.employerLicense || "[License Number]"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">EMPLOYEE:</p>
                <p className="text-gray-700">
                  {formData.employeeName || "[Employee Name]"}
                </p>
                <p className="text-gray-600 text-sm">
                  Passport No:{" "}
                  {formData.employeePassport || "[Passport Number]"}
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  1. POSITION AND DUTIES
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The Employee is hired for the position of{" "}
                  <strong>{formData.position || "[Job Position]"}</strong> and
                  shall perform all duties and responsibilities associated with
                  this role as directed by the Employer.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  2. TERM OF EMPLOYMENT
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  This is a{" "}
                  <strong>{formData.contractType || "[Contract Type]"}</strong>{" "}
                  employment contract commencing on{" "}
                  <strong>{formData.startDate || "[Start Date]"}</strong>.
                </p>
                {formData.probationPeriod &&
                  formData.probationPeriod !== "No Probation" && (
                    <p className="text-gray-700 leading-relaxed mt-2">
                      The Employee shall be subject to a probation period of{" "}
                      <strong>{formData.probationPeriod}</strong>.
                    </p>
                  )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  3. COMPENSATION
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The Employee shall receive a monthly salary of{" "}
                  <strong>AED {formData.salary || "[Amount]"}</strong>, payable
                  in accordance with the Employer's standard payroll schedule.
                </p>
                {formData.benefits && (
                  <div className="mt-3 bg-white p-3 rounded border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-1">
                      Additional Benefits:
                    </p>
                    <p className="text-gray-600 text-sm">{formData.benefits}</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  4. WORKING HOURS
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The Employee shall work standard business hours as per UAE
                  Labor Law, with appropriate breaks and rest periods.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  5. LEAVE ENTITLEMENTS
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The Employee is entitled to annual leave as per UAE Labor Law
                  provisions, calculated based on the length of service.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  6. TERMINATION
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Either party may terminate this contract in accordance with
                  UAE Labor Law, providing appropriate notice or payment in lieu
                  thereof.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  7. GOVERNING LAW
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  This contract is governed by the UAE Federal Labor Law and
                  applicable regulations.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="font-bold text-gray-900 mb-4">EMPLOYER:</p>
                    <p className="text-gray-700 mb-1">
                      {formData.employerName || "[Company Name]"}
                    </p>
                    <div className="border-b-2 border-gray-900 w-48 mt-8 mb-1"></div>
                    <p className="text-sm text-gray-600">
                      Authorized Signature
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-4">EMPLOYEE:</p>
                    <p className="text-gray-700 mb-1">
                      {formData.employeeName || "[Employee Name]"}
                    </p>
                    <div className="border-b-2 border-gray-900 w-48 mt-8 mb-1"></div>
                    <p className="text-sm text-gray-600">Employee Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Document preview is being generated...
            </p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 mb-4">
        {/* Header */}
        <PageHeader
          title="Document Preview"
          description={documentTitles[documentType] || "Document"}
          showAIBadge={true}
          icon={<FileText size={20} />}
          buttons={[
            {
              text: "Back to Documents",
              icon: <ArrowLeft size={20} />,
              onClick: () => router.back(),
            },
          ]}
        />

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
                    {documentTitles[documentType]}
                  </h2>
                  <p className="text-gray-600 text-sm">AI-Generated Document</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3" />
                Verified
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
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-[#f6a821] hover:bg-[#d18d18]"
                icon={
                  isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )
                }
              >
                {isDownloading ? "Generating PDF..." : "Download PDF"}
              </Button>
              <Button
                onClick={() => setShowEmailModal(true)}
                icon={<Send className="w-4 h-4" />}
              >
                Send to Customer
              </Button>
            </div>
          </div>
        </div>

        {/* Document Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div
              ref={previewRef}
              className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 rounded-lg print-area"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {renderDocumentContent()}
            </div>
          </div>
        </div>

        {/* AI Verification Section */}
        <div className="mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-lg p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg mb-2">
                AI Verification Complete
              </p>
              <p className="text-gray-600">
                This document has been verified for UAE compliance, legal
                terminology accuracy, and completeness. All required fields have
                been validated.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 bg-white border border-gray-300 rounded-lg px-6 py-4">
            <div className="text-sm text-gray-600">
              Need to make changes to this document?
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.back()}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
              >
                Edit Document
              </Button>
              <Button
                onClick={() => setShowEmailModal(true)}
                className="text-sm"
                icon={<Send className="w-4 h-4" />}
              >
                Send to Customer
              </Button>
            </div>
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 font-bold text-xl">
                  Send via Email
                </h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {!emailSent ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-gray-900 font-semibold text-sm mb-2">
                        Recipient Email *
                      </label>
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="client@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold text-sm mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        placeholder="Add a message..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendEmail}
                      disabled={!emailAddress}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                      Send Email
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-gray-900 font-bold text-lg mb-2">
                    Email Sent!
                  </h4>
                  <p className="text-gray-600">
                    Document sent to {emailAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 font-bold text-xl">
                  Share Document
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-900 font-semibold text-sm mb-2">
                    Shareable Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Link copied to clipboard!
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm text-center">
                    Anyone with this link can view the document
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
}
