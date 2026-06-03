"use client";
// src/app/quotation/[token]/page.tsx
// Public client-facing page — no authentication required.
// Opened via the shareable link the seller sends to the client.
// Route: /q/[token]

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle, MessageSquare, Download, Building2, Calendar, FileText } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

interface PublicQuotation {
  uuid: string;
  quotation_number: string;
  project_title?: string;
  description?: string;
  client_name: string;
  currency: string;
  line_items: any[];
  subtotal: number;
  total_discount: number;
  total_tax: number;
  grand_total: number;
  issue_date: string;
  expiry_date: string;
  terms_and_conditions?: string;
  notes?: string;
  status: string;
}

type ClientAction = "accept" | "reject" | "comment" | null;

export default function PublicQuotationPage() {
  const params = useParams();
  const token  = params.token as string;

  const [quotation,  setQuotation]  = useState<PublicQuotation | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [action,     setAction]     = useState<ClientAction>(null);
  const [comment,    setComment]    = useState("");
  const [isActing,   setIsActing]   = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    axiosInstance.get(`/quotations/public/${token}`)
      .then((res) => { setQuotation(res.data.data); })
      .catch(() => { setError("This quotation link is invalid or has expired."); })
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleClientAction = async (act: "accept" | "reject") => {
    setIsActing(true);
    try {
      await axiosInstance.post(`/quotations/client-action/${token}`, {
        action: act, comment: comment || undefined,
      });
      setActionDone(act === "accept"
        ? "Thank you! You have accepted this quotation. The supplier has been notified and will be in touch shortly."
        : "Your response has been recorded. The supplier will prepare a revised quotation if needed.");
      setAction(null);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not process your response. Please try again.");
    } finally { setIsActing(false); }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    setIsActing(true);
    try {
      await axiosInstance.post(`/quotations/client-action/${token}`, { action: "comment", comment });
      setActionDone("Your comment has been sent to the supplier.");
      setAction(null); setComment("");
    } catch { setError("Could not send comment. Please try again."); }
    finally { setIsActing(false); }
  };

  // Loading
  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Loading quotation…</p>
      </div>
    </div>
  );

  // Error
  if (error && !quotation) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Link Unavailable</h2>
        <p className="text-slate-500 text-sm">{error}</p>
      </div>
    </div>
  );

  if (!quotation) return null;

  const isExpired = new Date(quotation.expiry_date) < new Date();
  const isDone    = ["accepted","rejected","converted","archived"].includes(quotation.status);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-2xl mx-auto">

        {/* BizMate branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"><FileText className="w-3 h-3" /></div>
            BizMate AI
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

          {/* Header */}
          <div className="bg-indigo-600 px-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">Quotation</div>
                <h1 className="text-xl font-bold text-white mb-0.5">{quotation.project_title ?? quotation.quotation_number}</h1>
                <p className="text-indigo-200 text-sm">{quotation.quotation_number}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{quotation.currency} {Number(quotation.grand_total).toLocaleString()}</div>
                <div className="text-indigo-200 text-xs mt-1">
                  Valid until {new Date(quotation.expiry_date).toLocaleDateString("en-AE", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                {isExpired && <div className="text-red-300 text-xs font-semibold mt-1">⚠ This quotation has expired</div>}
              </div>
            </div>
          </div>

          {/* Status banner if already acted */}
          {actionDone && (
            <div className="bg-green-50 border-b border-green-200 px-6 py-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 leading-relaxed">{actionDone}</p>
            </div>
          )}
          {isDone && !actionDone && (
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 text-xs text-slate-500 text-center">
              This quotation has been {quotation.status}. No further actions are available.
            </div>
          )}

          {/* Client & dates */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-b border-slate-100">
            {[
              { icon: <Building2 className="w-4 h-4" />, label: "Prepared for", value: quotation.client_name },
              { icon: <Calendar className="w-4 h-4" />,  label: "Issue date",   value: new Date(quotation.issue_date).toLocaleDateString("en-AE") },
              { icon: <Calendar className="w-4 h-4" />,  label: "Valid until",  value: new Date(quotation.expiry_date).toLocaleDateString("en-AE") },
            ].map(({ icon, label, value }) => (
              <div key={label} className="px-6 py-4 border-r border-slate-100 last:border-r-0">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">{icon}{label}</div>
                <div className="text-sm font-semibold text-slate-800">{value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          {quotation.description && (
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed">{quotation.description}</p>
            </div>
          )}

          {/* Line items */}
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Line Items</h2>
            <div className="space-y-2">
              {quotation.line_items.map((item, i) => (
                <div key={i} className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800">{item.name}</div>
                    {item.description && <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>}
                    <div className="text-xs text-slate-400 mt-0.5">{item.quantity} {item.unit} × {quotation.currency} {Number(item.unit_price).toLocaleString()}</div>
                  </div>
                  <div className="text-sm font-bold text-slate-800 ml-4">{quotation.currency} {Number(item.line_total).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-end">
            <div className="w-56 space-y-1 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{quotation.currency} {Number(quotation.subtotal).toLocaleString()}</span></div>
              {Number(quotation.total_discount) > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>- {quotation.currency} {Number(quotation.total_discount).toLocaleString()}</span></div>}
              <div className="flex justify-between text-slate-500"><span>Tax (VAT)</span><span>{quotation.currency} {Number(quotation.total_tax).toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-base text-indigo-600 border-t border-slate-200 pt-2">
                <span>Total</span><span>{quotation.currency} {Number(quotation.grand_total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          {quotation.terms_and_conditions && (
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Terms & Conditions</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{quotation.terms_and_conditions}</p>
            </div>
          )}

          {/* Client actions — only show if not yet acted and not expired */}
          {!isDone && !actionDone && !isExpired && (
            <div className="px-6 py-5">
              {/* Comment box */}
              {action === "comment" && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Your message</label>
                  <textarea
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    placeholder="Ask a question or request a revision…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setAction(null)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleCommentSubmit} disabled={isActing || !comment.trim()} className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50">
                      {isActing ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </div>
              )}

              {/* Accept confirm */}
              {action === "accept" && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800 font-medium mb-3">Confirm acceptance of this quotation?</p>
                  <div className="mb-3">
                    <textarea rows={2} className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-400 bg-white" placeholder="Optional message to the supplier…" value={comment} onChange={(e) => setComment(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAction(null)} className="flex-1 py-2 border border-green-200 rounded-xl text-sm font-medium text-green-700 hover:bg-green-100">Cancel</button>
                    <button onClick={() => handleClientAction("accept")} disabled={isActing} className="flex-[2] py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                      {isActing ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Confirming…</span> : "Yes, Accept Quotation"}
                    </button>
                  </div>
                </div>
              )}

              {/* Reject confirm */}
              {action === "reject" && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-800 font-medium mb-3">Reason for rejection (optional):</p>
                  <textarea rows={2} className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-red-400 bg-white mb-3" placeholder="e.g. Price too high, please revise…" value={comment} onChange={(e) => setComment(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={() => setAction(null)} className="flex-1 py-2 border border-red-200 rounded-xl text-sm font-medium text-red-700 hover:bg-red-100">Cancel</button>
                    <button onClick={() => handleClientAction("reject")} disabled={isActing} className="flex-[2] py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
                      {isActing ? "Processing…" : "Reject Quotation"}
                    </button>
                  </div>
                </div>
              )}

              {/* Main action buttons */}
              {!action && (
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setAction("accept")} className="flex flex-col items-center gap-1.5 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-semibold text-sm">
                    <CheckCircle className="w-5 h-5" /> Accept
                  </button>
                  <button onClick={() => setAction("comment")} className="flex flex-col items-center gap-1.5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-semibold text-sm border border-slate-200">
                    <MessageSquare className="w-5 h-5" /> Comment
                  </button>
                  <button onClick={() => setAction("reject")} className="flex flex-col items-center gap-1.5 py-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors font-semibold text-sm border border-red-200">
                    <XCircle className="w-5 h-5" /> Reject
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Expired state */}
          {isExpired && !isDone && (
            <div className="px-6 py-5 text-center">
              <p className="text-sm text-slate-500">This quotation expired on {new Date(quotation.expiry_date).toLocaleDateString("en-AE")}. Please contact the supplier for an updated quotation.</p>
            </div>
          )}

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <p className="text-xs text-slate-400">Powered by <span className="font-semibold text-indigo-600">BizMate AI</span></p>
            <p className="text-xs text-slate-400">This is a computer-generated quotation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
