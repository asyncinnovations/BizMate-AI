import React from "react";

const InvoicePdfViewer = ({ data }: any) => {
  // Helper for currency formatting
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "AED",
    }).format(num || 0);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 print:bg-white print:py-0 print:px-0">

      {/* Container: A4 Dimensions mimic */}
      <div className="mx-auto max-w-[850px] bg-white shadow-2xl ring-1 ring-slate-200 print:shadow-none print:ring-0">
        {/* Top Accent Bar */}
        <div className="h-2 bg-blue-900 w-full" />

        <div className="p-10 print:p-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 tracking-tight">
                BizMate Solutions FZ-LLC
              </h2>
              <div className="mt-2 text-slate-500 text-sm leading-relaxed">
                <p>Dubai Silicon Oasis, DDP, Building A2</p>
                <p>Dubai, United Arab Emirates</p>
                <p className="mt-1 font-medium text-slate-700">
                  VAT: 100225344900003
                </p>
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-4xl font-black text-slate-200 uppercase tracking-widest mb-4 print:text-slate-300">
                Tax Invoice
              </h1>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold text-blue-800">
                    Invoice No:
                  </span>{" "}
                  <span className="text-slate-700">{data.invoice_number}</span>
                </p>
                <p>
                  <span className="font-semibold text-blue-800">Date:</span>{" "}
                  <span className="text-slate-700">{data.invoice_date}</span>
                </p>
                <p>
                  <span className="font-semibold text-blue-800">Due Date:</span>{" "}
                  <span className="text-slate-700">{data.due_date}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Amount Due Banner */}
          <div className="bg-slate-900 rounded-xl p-6 mb-10 flex justify-between items-center text-white shadow-lg">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">
                Total Amount Due
              </p>
              <p className="text-3xl font-bold">
                {data.total}{" "}
                <span className="text-lg font-normal opacity-70">AED</span>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">
                Payment Status
              </p>
              <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20 uppercase">
                Pending
              </span>
            </div>
          </div>

          {/* Billing & Terms Grid */}
          <div className="grid grid-cols-2 gap-12 mb-10 pb-10 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                Bill To
              </h3>
              <p className="font-bold text-slate-800 text-lg">
                {data.customer_name}
              </p>
              <p className="text-slate-500 text-sm mt-1 whitespace-pre-line leading-relaxed">
                {data.customer_address}
              </p>
              <p className="text-blue-600 text-sm mt-2 font-medium">
                {data.customer_email}
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                Payment Terms
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Terms</span>
                  <span className="font-semibold text-slate-700">Net 45</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Final Due Date</span>
                  <span className="font-semibold text-slate-700">
                    {data.due_date}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-10">
            <table className="w-full text-left border-spacing-0">
              <thead>
                <tr className="border-b border-slate-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-2">#</th>
                  <th className="py-4 px-2">Item Description</th>
                  <th className="py-4 px-2 text-center">Qty</th>
                  <th className="py-4 px-2 text-right">Price</th>
                  <th className="py-4 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {(data.items || data.invoice_items || []).map(
                  (item: any, index: any) => (
                    <tr
                      key={index}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-5 px-2 text-slate-400 font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="py-5 px-2">
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </td>
                      <td className="py-5 px-2 text-center text-slate-700 font-medium">
                        {item.quantity}
                      </td>
                      <td className="py-5 px-2 text-right text-slate-700">
                        {item.price}
                      </td>
                      <td className="py-5 px-2 text-right font-bold text-slate-900">
                        {item.amount}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col items-end space-y-3">
            <div className="w-full sm:w-1/2 space-y-2">
              <div className="flex justify-between text-sm px-2">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-700 font-medium">
                  {data.subtotal}
                </span>
              </div>
              <div className="flex justify-between text-sm px-2">
                <span className="text-slate-500">VAT (5%)</span>
                <span className="text-slate-700 font-medium">{data.vat}</span>
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                <span className="text-blue-900 font-bold">TOTAL DUE</span>
                <span className="text-2xl font-black text-blue-900">
                  {data.total} AED
                </span>
              </div>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-blue-800 uppercase tracking-tighter">
                💳 Payment Method
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                Bank Transfer, Credit / Debit Card accepted.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-blue-800 uppercase tracking-tighter">
                🏛️ Bank Details
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold">Emirates NBD</span>
                <br />
                A/C: BizMate Solutions
                <br />
                SWIFT: EBILA EAD
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-blue-800 uppercase tracking-tighter">
                📝 Important Notes
              </h4>
              <ul className="text-[10px] text-slate-500 space-y-1">
                <li>• This is a computer generated document.</li>
                <li>• Please quote the invoice number in your transfer.</li>
                <li>• Payment is expected within the due date.</li>
              </ul>
            </div>
          </div>

          {/* Final Message */}
          <div className="mt-12 text-center">
            <p className="text-2xl font-serif italic text-blue-900/40">
              Thank You for your business!
            </p>
          </div>
        </div>
      </div>

      {/* Print Instructions Button (Invisible on print) */}
      <div className="mt-8 text-center print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePdfViewer;
