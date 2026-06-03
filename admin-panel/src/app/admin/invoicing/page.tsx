"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import StatCards from "@/components/ui/StatCards";
import FilterBar, { SearchInput, SelectFilter } from "@/components/ui/FilterBar";

/* ─── Types ───────────────────────────────────────────────────── */
type InvStatus = "paid"|"pending"|"overdue"|"draft";

interface InvoiceTemplate {
  id:string; name:string; description:string; category:string;
  currency:"AED"|"USD"|"EUR"; vatRate:number; color:string;
  logoPosition:"left"|"center"|"right"; showBankDetails:boolean;
  showPaymentTerms:boolean; paymentTerms:string; notes:string;
  items:{ description:string; qty:number; unitPrice:number }[];
  status:"active"|"draft"; usageCount:number; createdAt:string;
  language:"EN"|"AR"|"EN/AR";
}

const MOCK_TEMPLATES: InvoiceTemplate[] = [
  {id:"it001",name:"Standard VAT Invoice",description:"UAE VAT-compliant invoice with 5% VAT, suitable for most B2B transactions.",
    category:"General",currency:"AED",vatRate:5,color:"#E8690A",logoPosition:"left",showBankDetails:true,
    showPaymentTerms:true,paymentTerms:"Net 30",notes:"Thank you for your business.",
    items:[{description:"Professional Services",qty:1,unitPrice:5000}],
    status:"active",usageCount:3842,createdAt:"Jan 1, 2025",language:"EN"},
  {id:"it002",name:"Bilingual Invoice (EN/AR)",description:"Dual-language invoice with English and Arabic columns for UAE government clients.",
    category:"Government",currency:"AED",vatRate:5,color:"#3B82F6",logoPosition:"center",showBankDetails:true,
    showPaymentTerms:true,paymentTerms:"Net 15",notes:"يُرجى السداد خلال المدة المحددة.",
    items:[{description:"Consulting Services",qty:1,unitPrice:10000}],
    status:"active",usageCount:1240,createdAt:"Feb 5, 2025",language:"EN/AR"},
  {id:"it003",name:"Freelance / Simple Invoice",description:"Clean, minimal invoice for freelancers and solo consultants.",
    category:"Freelance",currency:"USD",vatRate:0,color:"#10B981",logoPosition:"left",showBankDetails:false,
    showPaymentTerms:true,paymentTerms:"Due on receipt",notes:"",
    items:[{description:"Design Work",qty:1,unitPrice:2000}],
    status:"active",usageCount:876,createdAt:"Mar 10, 2025",language:"EN"},
  {id:"it004",name:"Proforma Invoice",description:"Non-binding proforma invoice for advance quotations and customs clearance.",
    category:"Trading",currency:"AED",vatRate:5,color:"#8B5CF6",logoPosition:"left",showBankDetails:false,
    showPaymentTerms:false,paymentTerms:"",notes:"This is a proforma invoice and not a demand for payment.",
    items:[{description:"Goods",qty:10,unitPrice:500}],
    status:"active",usageCount:542,createdAt:"Apr 2, 2025",language:"EN"},
  {id:"it005",name:"Credit Note Template",description:"Reverse invoice for refunds, corrections, and cancellations.",
    category:"Accounting",currency:"AED",vatRate:5,color:"#EF4444",logoPosition:"left",showBankDetails:true,
    showPaymentTerms:false,paymentTerms:"",notes:"This credit note offsets the referenced invoice.",
    items:[{description:"Refund: Service Fee",qty:1,unitPrice:-1500}],
    status:"draft",usageCount:0,createdAt:"May 8, 2025",language:"EN"},
];

/* ─── Template Builder Modal ──────────────────────────────────── */
const COLORS = ["#E8690A","#3B82F6","#10B981","#8B5CF6","#F59E0B","#EF4444","#06B6D4","#0F172A"];

function TemplateBuilderModal({open,template,onClose,onSave}:{
  open:boolean; template:InvoiceTemplate|null; onClose:()=>void; onSave:(t:Partial<InvoiceTemplate>)=>void;
}) {
  const isNew = !template;
  const [tab,setTab] = useState<"design"|"fields"|"items">("design");
  const [form,setForm] = useState<Partial<InvoiceTemplate>>({
    name: template?.name??"",
    description: template?.description??"",
    category: template?.category??"General",
    currency: template?.currency??"AED",
    vatRate: template?.vatRate??5,
    color: template?.color??COLORS[0],
    logoPosition: template?.logoPosition??"left",
    showBankDetails: template?.showBankDetails??true,
    showPaymentTerms: template?.showPaymentTerms??true,
    paymentTerms: template?.paymentTerms??"Net 30",
    notes: template?.notes??"",
    language: template?.language??"EN",
    status: template?.status??"draft",
    items: template?.items??[{description:"",qty:1,unitPrice:0}],
  });

  const set = (k:string, v:unknown) => setForm(f=>({...f,[k]:v}));
  const total = (form.items??[]).reduce((s,i)=>s+(i.qty*i.unitPrice),0);
  const vat   = total * ((form.vatRate??0)/100);

  if(!open) return null;

  const tabStyle = (t:string):React.CSSProperties => ({
    padding:"8px 16px", fontSize:12.5, fontWeight:600,
    border:"none", cursor:"pointer", fontFamily:"var(--font-body)",
    borderBottom:`2px solid ${tab===t?"var(--accent)":"transparent"}`,
    color: tab===t?"var(--accent)":"var(--text-muted)",
    background:"transparent", transition:"all 0.12s", whiteSpace:"nowrap",
  });

  const labelStyle:React.CSSProperties = {
    display:"block", fontSize:11, fontWeight:600, color:"var(--text-secondary)",
    marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{maxWidth:760}} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"16px 20px",borderBottom:"1.5px solid var(--border)"}}>
          <div>
            <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:16,color:"var(--text-primary)"}}>
              {isNew?"New Invoice Template":"Edit Template"}
            </div>
            <div style={{fontSize:12,color:"var(--text-muted)",marginTop:2}}>
              Configure how invoices look and behave for your users
            </div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:8,border:"1.5px solid var(--border)",
            background:"var(--bg-raised)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:14,color:"var(--text-muted)"}}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:"1.5px solid var(--border)",padding:"0 20px",gap:4}}>
          {["design","fields","items"].map(t=>(
            <button key={t} style={tabStyle(t)} onClick={()=>setTab(t as typeof tab)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{padding:"20px",overflowY:"auto",maxHeight:"60vh"}}>

          {/* ── DESIGN TAB ── */}
          {tab==="design"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div style={{gridColumn:"1/-1"}}>
                <label style={labelStyle}>Template Name</label>
                <input value={form.name??""} onChange={e=>set("name",e.target.value)}
                  className="input-base" placeholder="e.g. Standard VAT Invoice"/>
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description??""} onChange={e=>set("description",e.target.value)}
                  className="input-base" style={{resize:"vertical",minHeight:60}}
                  placeholder="Brief description of this template…"/>
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={form.category??""} onChange={e=>set("category",e.target.value)} className="input-base">
                  {["General","Government","Freelance","Trading","Accounting","Construction","Healthcare"].map(c=>(
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Language</label>
                <select value={form.language??""} onChange={e=>set("language",e.target.value)} className="input-base">
                  <option value="EN">English</option>
                  <option value="AR">Arabic</option>
                  <option value="EN/AR">Bilingual (EN/AR)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Currency</label>
                <select value={form.currency??""} onChange={e=>set("currency",e.target.value)} className="input-base">
                  {["AED","USD","EUR","GBP","SAR"].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>VAT Rate (%)</label>
                <input type="number" min={0} max={30} value={form.vatRate??0} onChange={e=>set("vatRate",Number(e.target.value))}
                  className="input-base"/>
              </div>
              <div>
                <label style={labelStyle}>Logo Position</label>
                <div style={{display:"flex",gap:8}}>
                  {(["left","center","right"] as const).map(pos=>(
                    <button key={pos} onClick={()=>set("logoPosition",pos)}
                      style={{flex:1,padding:"8px",borderRadius:7,fontSize:12,fontWeight:500,cursor:"pointer",
                        border:`1.5px solid ${form.logoPosition===pos?"var(--accent-border)":"var(--border)"}`,
                        background:form.logoPosition===pos?"var(--accent-dim)":"var(--bg-raised)",
                        color:form.logoPosition===pos?"var(--accent)":"var(--text-secondary)",
                        textTransform:"capitalize",transition:"all 0.12s"}}>
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Accent Color</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {COLORS.map(c=>(
                    <button key={c} onClick={()=>set("color",c)}
                      style={{width:28,height:28,borderRadius:7,background:c,cursor:"pointer",
                        border:`2.5px solid ${form.color===c?"var(--text-primary)":"transparent"}`,
                        transform:form.color===c?"scale(1.15)":"scale(1)",transition:"all 0.12s"}}>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{gridColumn:"1/-1",display:"flex",gap:24}}>
                {[{key:"showBankDetails",label:"Show Bank Details"},
                  {key:"showPaymentTerms",label:"Show Payment Terms"}].map(opt=>(
                  <label key={opt.key} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none"}}>
                    <div onClick={()=>set(opt.key,!(form as Record<string,unknown>)[opt.key])}
                      style={{width:36,height:20,borderRadius:100,cursor:"pointer",
                        background:(form as Record<string,unknown>)[opt.key]?"var(--accent)":"var(--border)",
                        position:"relative",transition:"background 0.2s"}}>
                      <div style={{position:"absolute",top:2,width:16,height:16,borderRadius:"50%",background:"#fff",
                        left:(form as Record<string,unknown>)[opt.key]?"calc(100% - 18px)":"2px",
                        transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}/>
                    </div>
                    <span style={{fontSize:12.5,color:"var(--text-secondary)",fontWeight:500}}>{opt.label}</span>
                  </label>
                ))}
              </div>
              {form.showPaymentTerms&&(
                <div style={{gridColumn:"1/-1"}}>
                  <label style={labelStyle}>Payment Terms</label>
                  <input value={form.paymentTerms??""} onChange={e=>set("paymentTerms",e.target.value)}
                    className="input-base" placeholder="e.g. Net 30, Due on receipt"/>
                </div>
              )}
              <div style={{gridColumn:"1/-1"}}>
                <label style={labelStyle}>Footer Notes</label>
                <textarea value={form.notes??""} onChange={e=>set("notes",e.target.value)}
                  className="input-base" style={{resize:"vertical",minHeight:60}}
                  placeholder="Notes shown at the bottom of each invoice…"/>
              </div>
            </div>
          )}

          {/* ── FIELDS TAB ── */}
          {tab==="fields"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[
                {label:"From (Business Name)",   ph:"{{business.name}}",      info:"Auto-filled from business profile"},
                {label:"From (Address)",         ph:"{{business.address}}",   info:""},
                {label:"From (TRN/VAT Number)",  ph:"{{business.trn}}",       info:"Tax Registration Number"},
                {label:"To (Client Name)",       ph:"{{client.name}}",        info:"Filled by user"},
                {label:"To (Client Address)",    ph:"{{client.address}}",     info:""},
                {label:"To (Client TRN)",        ph:"{{client.trn}}",         info:"Optional"},
                {label:"Invoice Number Prefix",  ph:"INV-{YYYY}-",            info:"Auto-incremented"},
                {label:"Bank Name",              ph:"{{business.bank}}",      info:"From business bank settings"},
                {label:"IBAN",                   ph:"{{business.iban}}",      info:""},
                {label:"Swift Code",             ph:"{{business.swift}}",     info:""},
              ].map(f=>(
                <div key={f.label}>
                  <label style={labelStyle}>{f.label}</label>
                  <input defaultValue={f.ph} className="input-base" style={{fontFamily:"monospace",fontSize:12}}/>
                  {f.info&&<div style={{fontSize:10.5,color:"var(--text-muted)",marginTop:4}}>{f.info}</div>}
                </div>
              ))}
            </div>
          )}

          {/* ── ITEMS TAB ── */}
          {tab==="items"&&(
            <div>
              <div style={{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--text-primary)"}}>Default Line Items</div>
                <button onClick={()=>set("items",[...(form.items??[]),{description:"",qty:1,unitPrice:0}])}
                  className="btn btn-secondary btn-sm">
                  + Add Item
                </button>
              </div>

              {/* Items table */}
              <div style={{border:"1.5px solid var(--border)",borderRadius:10,overflow:"hidden",marginBottom:16}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"var(--bg-raised)",borderBottom:"1.5px solid var(--border)"}}>
                      <th style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"var(--text-muted)"}}>Description</th>
                      <th style={{padding:"8px 12px",textAlign:"center",fontSize:11,fontWeight:600,color:"var(--text-muted)",width:80}}>Qty</th>
                      <th style={{padding:"8px 12px",textAlign:"right",fontSize:11,fontWeight:600,color:"var(--text-muted)",width:120}}>Unit Price</th>
                      <th style={{padding:"8px 12px",textAlign:"right",fontSize:11,fontWeight:600,color:"var(--text-muted)",width:120}}>Total</th>
                      <th style={{width:36}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(form.items??[]).map((item,i)=>(
                      <tr key={i} style={{borderBottom:"1px solid var(--border)"}}>
                        <td style={{padding:"8px 12px"}}>
                          <input value={item.description} onChange={e=>{
                            const it=[...(form.items??[])];
                            it[i]={...it[i],description:e.target.value};
                            set("items",it);
                          }} className="input-base" style={{height:30,fontSize:12.5}} placeholder="Item description"/>
                        </td>
                        <td style={{padding:"8px 12px"}}>
                          <input type="number" min={1} value={item.qty} onChange={e=>{
                            const it=[...(form.items??[])];
                            it[i]={...it[i],qty:Number(e.target.value)};
                            set("items",it);
                          }} className="input-base" style={{height:30,fontSize:12.5,textAlign:"center"}}/>
                        </td>
                        <td style={{padding:"8px 12px"}}>
                          <input type="number" min={0} value={item.unitPrice} onChange={e=>{
                            const it=[...(form.items??[])];
                            it[i]={...it[i],unitPrice:Number(e.target.value)};
                            set("items",it);
                          }} className="input-base" style={{height:30,fontSize:12.5,textAlign:"right"}}/>
                        </td>
                        <td style={{padding:"8px 12px",textAlign:"right",fontSize:12.5,fontWeight:600,color:"var(--text-primary)"}}>
                          {form.currency} {(item.qty*item.unitPrice).toLocaleString()}
                        </td>
                        <td style={{padding:"8px 6px",textAlign:"center"}}>
                          <button onClick={()=>set("items",(form.items??[]).filter((_,j)=>j!==i))}
                            style={{width:22,height:22,borderRadius:5,border:"none",background:"var(--red-dim)",
                              color:"var(--red)",cursor:"pointer",fontSize:11,fontWeight:700,
                              display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div style={{marginLeft:"auto",maxWidth:260,
                background:"var(--bg-raised)",border:"1.5px solid var(--border)",borderRadius:10,padding:14}}>
                {[
                  {label:"Subtotal", value:`${form.currency} ${total.toLocaleString()}`},
                  {label:`VAT (${form.vatRate}%)`, value:`${form.currency} ${vat.toFixed(2)}`},
                  {label:"Total", value:`${form.currency} ${(total+vat).toLocaleString()}`,bold:true},
                ].map(r=>(
                  <div key={r.label} style={{display:"flex",justifyContent:"space-between",
                    padding:"4px 0",borderBottom:r.bold?"none":"1px solid var(--border)"}}>
                    <span style={{fontSize:12.5,color:"var(--text-secondary)",fontWeight:r.bold?700:400}}>{r.label}</span>
                    <span style={{fontSize:12.5,fontWeight:r.bold?800:500,
                      color:r.bold?"var(--text-primary)":"var(--text-secondary)",
                      fontFamily:r.bold?"var(--font-display)":"inherit"}}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"14px 20px",borderTop:"1.5px solid var(--border)"}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:12,color:"var(--text-muted)"}}>Status:</span>
            <select value={form.status??""} onChange={e=>set("status",e.target.value)}
              className="input-base" style={{width:"auto",height:30,fontSize:12,minWidth:100}}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button onClick={()=>{onSave(form);onClose();}} className="btn btn-primary">
              {isNew?"Create Template":"Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Invoice Preview ─────────────────────────────────────────── */
function InvoicePreviewModal({open,template,onClose}:{open:boolean;template:InvoiceTemplate|null;onClose:()=>void}) {
  if(!open||!template) return null;
  const subtotal = template.items.reduce((s,i)=>s+(i.qty*i.unitPrice),0);
  const vat = subtotal*(template.vatRate/100);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{maxWidth:640}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1.5px solid var(--border)"}}>
          <span style={{fontWeight:600,fontSize:14,color:"var(--text-primary)"}}>Invoice Preview — {template.name}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"var(--text-muted)"}}>✕</button>
        </div>
        <div style={{padding:28,fontFamily:"var(--font-body)"}}>
          {/* Invoice doc */}
          <div style={{border:"1.5px solid var(--border)",borderRadius:10,overflow:"hidden"}}>
            <div style={{height:5,background:template.color}}/>
            <div style={{padding:"24px 28px"}}>
              {/* Header */}
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:24,alignItems:"flex-start"}}>
                <div>
                  <div style={{width:48,height:48,borderRadius:10,background:template.color,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:16,fontWeight:800,color:"#fff",fontFamily:"var(--font-display)",marginBottom:8}}>
                    B
                  </div>
                  <div style={{fontWeight:700,fontSize:14,color:"var(--text-primary)"}}>Business Name LLC</div>
                  <div style={{fontSize:11.5,color:"var(--text-muted)"}}>Dubai, UAE · TRN: 123456789</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:22,fontWeight:800,color:template.color,fontFamily:"var(--font-display)",letterSpacing:"-0.02em"}}>
                    INVOICE
                  </div>
                  <div style={{fontSize:12,color:"var(--text-muted)",marginTop:2}}>INV-2025-0001</div>
                  <div style={{fontSize:11.5,color:"var(--text-muted)"}}>Issue: May 25, 2025</div>
                </div>
              </div>
              {/* Bill to */}
              <div style={{background:"var(--bg-raised)",borderRadius:8,padding:"10px 14px",marginBottom:20}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Bill To</div>
                <div style={{fontWeight:600,fontSize:13,color:"var(--text-primary)"}}>Client Company Name</div>
                <div style={{fontSize:11.5,color:"var(--text-secondary)"}}>Abu Dhabi, UAE</div>
              </div>
              {/* Items */}
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16}}>
                <thead>
                  <tr style={{borderBottom:`2px solid ${template.color}33`}}>
                    <th style={{padding:"6px 0",textAlign:"left",fontSize:10,color:"var(--text-muted)",fontWeight:700,textTransform:"uppercase"}}>Description</th>
                    <th style={{padding:"6px 0",textAlign:"center",fontSize:10,color:"var(--text-muted)",fontWeight:700,textTransform:"uppercase",width:60}}>Qty</th>
                    <th style={{padding:"6px 0",textAlign:"right",fontSize:10,color:"var(--text-muted)",fontWeight:700,textTransform:"uppercase",width:100}}>Price</th>
                    <th style={{padding:"6px 0",textAlign:"right",fontSize:10,color:"var(--text-muted)",fontWeight:700,textTransform:"uppercase",width:100}}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {template.items.map((it,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid var(--border)"}}>
                      <td style={{padding:"8px 0",fontSize:12.5,color:"var(--text-primary)",fontWeight:500}}>{it.description||"Service"}</td>
                      <td style={{padding:"8px 0",textAlign:"center",fontSize:12,color:"var(--text-secondary)"}}>{it.qty}</td>
                      <td style={{padding:"8px 0",textAlign:"right",fontSize:12,color:"var(--text-secondary)"}}>{template.currency} {it.unitPrice.toLocaleString()}</td>
                      <td style={{padding:"8px 0",textAlign:"right",fontSize:12,fontWeight:600,color:"var(--text-primary)"}}>{template.currency} {(it.qty*it.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Totals */}
              <div style={{maxWidth:220,marginLeft:"auto"}}>
                {[{l:"Subtotal",v:`${template.currency} ${subtotal.toLocaleString()}`},
                  {l:`VAT ${template.vatRate}%`,v:`${template.currency} ${vat.toFixed(2)}`},
                  {l:"Total Due",v:`${template.currency} ${(subtotal+vat).toLocaleString()}`,bold:true}].map(r=>(
                  <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",
                    borderTop:r.bold?"2px solid var(--border)":"none",marginTop:r.bold?4:0}}>
                    <span style={{fontSize:12,color:"var(--text-secondary)",fontWeight:r.bold?700:400}}>{r.l}</span>
                    <span style={{fontSize:12,fontWeight:r.bold?800:500,
                      color:r.bold?template.color:"var(--text-secondary)"}}>{r.v}</span>
                  </div>
                ))}
              </div>
              {template.notes&&(
                <div style={{marginTop:20,padding:"10px 14px",borderRadius:7,
                  background:`${template.color}0c`,border:`1px solid ${template.color}22`}}>
                  <div style={{fontSize:11,color:"var(--text-secondary)"}}>{template.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
const MOCK_INVOICES = [
  {id:"i1",number:"INV-2025-0041",business:"Al-Rashid Group",   amount:12400,currency:"AED",status:"paid" as InvStatus,   dueDate:"Apr 30",issueDate:"Apr 1"},
  {id:"i2",number:"INV-2025-0042",business:"Bright Futures LLC",amount:3600, currency:"AED",status:"pending" as InvStatus,dueDate:"May 15",issueDate:"Apr 15"},
  {id:"i3",number:"INV-2025-0043",business:"Al Noor Trading",   amount:7200, currency:"AED",status:"overdue" as InvStatus,dueDate:"May 1", issueDate:"Apr 1"},
  {id:"i4",number:"INV-2025-0044",business:"TechFlow Solutions",amount:1800, currency:"AED",status:"draft" as InvStatus,  dueDate:"Jun 1", issueDate:"May 1"},
  {id:"i5",number:"INV-2025-0045",business:"Salman Group",      amount:22000,currency:"AED",status:"paid" as InvStatus,   dueDate:"May 5", issueDate:"Apr 5"},
];

const INVST:Record<InvStatus,{bg:string;color:string}> = {
  paid:   {bg:"var(--green-dim)",color:"var(--green)"},
  pending:{bg:"var(--amber-dim)",color:"var(--amber)"},
  overdue:{bg:"var(--red-dim)",  color:"var(--red)"},
  draft:  {bg:"rgba(148,163,184,0.12)",color:"#94A3B8"},
};

export default function InvoicingPage() {
  const [tab, setTab] = useState<"invoices"|"templates">("invoices");
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [search, setSearch] = useState("");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<InvoiceTemplate|null>(null);
  const [previewTarget, setPreviewTarget] = useState<InvoiceTemplate|null>(null);

  const filteredInv = MOCK_INVOICES.filter(i=>!search||i.number.toLowerCase().includes(search)||i.business.toLowerCase().includes(search));

  const InvIcon = ()=><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7h6M7 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  const PaidIcon= ()=><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  const WarnIcon= ()=><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M10 3L2 17h16L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="14.5" r="0.75" fill="currentColor"/></svg>;

  return (
    <div className="page-enter">
      <PageHeader title="Smart Invoicing" subtitle="Manage invoices and configure invoice templates for all businesses"
        action={
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-secondary">Export CSV</button>
            {tab==="templates"
              ? <button className="btn btn-primary" onClick={()=>{setEditTarget(null);setBuilderOpen(true);}}>+ New Template</button>
              : <button className="btn btn-primary">+ Create Invoice</button>}
          </div>
        }/>

      <StatCards items={[
        {label:"Total Invoiced",  value:"AED 47,000",color:"var(--blue)",  icon:<InvIcon/>, sub:"This month"},
        {label:"Collected",       value:"AED 34,400",color:"var(--green)", icon:<PaidIcon/>,sub:"+73% collected"},
        {label:"Outstanding",     value:"AED 10,800",color:"var(--amber)", icon:<WarnIcon/>,sub:"Across 2 invoices"},
        {label:"Overdue",         value:"AED 7,200", color:"var(--red)",   icon:<WarnIcon/>,sub:"1 invoice overdue"},
      ]}/>

      {/* Tabs */}
      <div style={{display:"flex",gap:1,background:"var(--bg-raised)",borderRadius:10,padding:4,
        width:"fit-content",marginBottom:16,border:"1.5px solid var(--border)"}}>
        {[{key:"invoices",label:"Invoices"},{key:"templates",label:"Invoice Templates"}].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key as typeof tab)}
            style={{padding:"7px 18px",borderRadius:7,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",
              background:tab===t.key?"var(--bg-surface)":"transparent",
              color:tab===t.key?"var(--text-primary)":"var(--text-muted)",
              boxShadow:tab===t.key?"var(--shadow-xs)":"none",transition:"all 0.15s"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* INVOICES TAB */}
      {tab==="invoices"&&(
        <>
          <FilterBar right={<span style={{fontSize:12,color:"var(--text-muted)"}}>{filteredInv.length} invoices</span>}>
            <SearchInput value={search} onChange={setSearch} placeholder="Search invoices…"/>
            <SelectFilter value="" onChange={()=>{}} options={[
              {label:"All Status",value:"all"},{label:"Paid",value:"paid"},
              {label:"Pending",value:"pending"},{label:"Overdue",value:"overdue"},
            ]}/>
          </FilterBar>
          <div style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden"}}>
            <table className="data-table">
              <thead><tr><th>Invoice #</th><th>Business</th><th>Amount</th><th>Status</th><th>Issue Date</th><th>Due Date</th><th></th></tr></thead>
              <tbody>
                {filteredInv.map(inv=>{
                  const s=INVST[inv.status];
                  return (
                    <tr key={inv.id}>
                      <td><span style={{fontWeight:600,color:"var(--accent)"}}>{inv.number}</span></td>
                      <td style={{fontWeight:500,color:"var(--text-primary)"}}>{inv.business}</td>
                      <td><span style={{fontWeight:700,color:"var(--text-primary)"}}>{inv.currency} {inv.amount.toLocaleString()}</span></td>
                      <td><span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:100,fontSize:11,fontWeight:600,background:s.bg,color:s.color}}>
                        <span style={{width:5,height:5,borderRadius:"50%",background:s.color}}/>{inv.status.charAt(0).toUpperCase()+inv.status.slice(1)}
                      </span></td>
                      <td style={{color:"var(--text-muted)",fontSize:12}}>{inv.issueDate}</td>
                      <td style={{color:inv.status==="overdue"?"var(--red)":"var(--text-muted)",fontSize:12,fontWeight:inv.status==="overdue"?600:400}}>{inv.dueDate}</td>
                      <td><button style={{fontSize:12,fontWeight:600,color:"var(--accent)",background:"none",border:"none",cursor:"pointer"}}>View</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TEMPLATES TAB */}
      {tab==="templates"&&(
        <>
          <div style={{marginBottom:12,padding:"10px 14px",background:"var(--info-dim)",border:"1.5px solid rgba(59,130,246,0.2)",
            borderRadius:"var(--radius-md)",display:"flex",alignItems:"center",gap:8}}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#3B82F6" strokeWidth="1.3"/><path d="M8 7v4" stroke="#3B82F6" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="5.5" r="0.7" fill="#3B82F6"/></svg>
            <span style={{fontSize:12.5,color:"var(--blue)"}}>Templates created here become available to all users in the client application when creating invoices.</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {templates.map(t=>(
              <div key={t.id} style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
                borderRadius:"var(--radius-lg)",overflow:"hidden",boxShadow:"var(--shadow-sm)",
                transition:"box-shadow 0.2s,border-color 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="var(--shadow-md)";e.currentTarget.style.borderColor="var(--border-mid)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="var(--shadow-sm)";e.currentTarget.style.borderColor="var(--border)";}}>
                {/* Color band */}
                <div style={{height:4,background:t.color}}/>
                <div style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:32,height:32,borderRadius:8,background:t.color,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:12,fontWeight:700,color:"#fff",fontFamily:"var(--font-display)"}}>
                        {t.name.slice(0,1)}
                      </div>
                      <div>
                        <div style={{fontWeight:600,fontSize:13,color:"var(--text-primary)",lineHeight:1.3}}>{t.name}</div>
                        <div style={{display:"flex",gap:5,marginTop:3}}>
                          <span style={{fontSize:10,fontWeight:600,padding:"1px 6px",borderRadius:100,
                            background:t.status==="active"?"var(--green-dim)":"var(--amber-dim)",
                            color:t.status==="active"?"var(--green)":"var(--amber)"}}>
                            {t.status}
                          </span>
                          <span style={{fontSize:10,fontWeight:500,padding:"1px 6px",borderRadius:100,
                            background:"var(--bg-raised)",color:"var(--text-muted)",border:"1px solid var(--border)"}}>
                            {t.language}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={()=>{setPreviewTarget(t);}}
                        style={{width:26,height:26,borderRadius:6,border:"1.5px solid var(--border)",
                          background:"var(--bg-raised)",cursor:"pointer",display:"flex",alignItems:"center",
                          justifyContent:"center",color:"var(--text-muted)",fontSize:11,transition:"all 0.12s"}}
                        title="Preview"
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--blue)";e.currentTarget.style.color="var(--blue)";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-muted)";}}>
                        👁
                      </button>
                      <button onClick={()=>{setEditTarget(t);setBuilderOpen(true);}}
                        style={{width:26,height:26,borderRadius:6,border:"1.5px solid var(--border)",
                          background:"var(--bg-raised)",cursor:"pointer",display:"flex",alignItems:"center",
                          justifyContent:"center",color:"var(--text-muted)",fontSize:11,transition:"all 0.12s"}}
                        title="Edit"
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-muted)";}}>
                        ✏
                      </button>
                    </div>
                  </div>
                  <p style={{fontSize:12,color:"var(--text-secondary)",lineHeight:1.5,marginBottom:12,
                    display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                    {t.description}
                  </p>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    paddingTop:10,borderTop:"1px solid var(--border)"}}>
                    <div style={{display:"flex",gap:10}}>
                      <span style={{fontSize:11.5,color:"var(--text-muted)"}}>{t.currency} · {t.vatRate}% VAT</span>
                      <span style={{fontSize:11.5,color:"var(--text-muted)"}}>{t.category}</span>
                    </div>
                    <span style={{fontSize:11.5,fontWeight:600,color:"var(--accent)"}}>
                      {t.usageCount.toLocaleString()} uses
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <TemplateBuilderModal open={builderOpen} template={editTarget}
        onClose={()=>{setBuilderOpen(false);setEditTarget(null);}}
        onSave={(data)=>{
          if(editTarget) setTemplates(ts=>ts.map(t=>t.id===editTarget.id?{...t,...data}:t));
          else setTemplates(ts=>[{...data,id:`it${Date.now()}`,usageCount:0,createdAt:"Today"} as InvoiceTemplate,...ts]);
        }}/>

      <InvoicePreviewModal open={!!previewTarget} template={previewTarget}
        onClose={()=>setPreviewTarget(null)}/>
    </div>
  );
}
