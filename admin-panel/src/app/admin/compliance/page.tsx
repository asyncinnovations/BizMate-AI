"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

const FRAMEWORKS = [
  {id:"f1",name:"UAE Commercial Companies Law",  code:"CCL-2021",  status:"active",  type:"Legal",      jurisdiction:"UAE",  updated:"Jan 2021", desc:"Federal Law No. 32 of 2021 on Commercial Companies."},
  {id:"f2",name:"UAE VAT Regulations",           code:"VAT-5PCT",   status:"active",  type:"Tax",        jurisdiction:"UAE",  updated:"Jan 2018", desc:"5% VAT per Cabinet Decision No. 52 of 2017."},
  {id:"f3",name:"UAE Labour Law (Federal)",      code:"LL-2022",    status:"active",  type:"HR",         jurisdiction:"UAE",  updated:"Feb 2022", desc:"Federal Decree-Law No. 33 of 2021 on Labour Relations."},
  {id:"f4",name:"DIFC Employment Law",           code:"DIFC-EL-19", status:"active",  type:"HR",         jurisdiction:"DIFC", updated:"Jun 2019", desc:"DIFC Law No. 2 of 2019 governing employment in DIFC."},
  {id:"f5",name:"AML/CFT Regulations",           code:"AML-2018",   status:"active",  type:"Financial",  jurisdiction:"UAE",  updated:"Oct 2018", desc:"Federal Decree-Law No. 20 of 2018 on Anti-Money Laundering."},
  {id:"f6",name:"UAE Data Protection (PDPL)",    code:"PDPL-2022",  status:"draft",   type:"Privacy",    jurisdiction:"UAE",  updated:"Nov 2022", desc:"Federal Decree-Law No. 45 of 2021 on Personal Data Protection."},
];

const LICENSE_TYPES = [
  {id:"l1",name:"Commercial License",       authority:"DED",   validity:"1 year",  renewalDays:30, fee:"AED 1,200–15,000",  businesses:842},
  {id:"l2",name:"Professional License",     authority:"DED",   validity:"1 year",  renewalDays:30, fee:"AED 900–8,000",     businesses:421},
  {id:"l3",name:"Free Zone License",        authority:"JAFZA/DAFZA",validity:"1 year",renewalDays:60,fee:"AED 5,000–25,000",businesses:315},
  {id:"l4",name:"Industrial License",       authority:"DED",   validity:"2 years", renewalDays:45, fee:"AED 3,000–20,000",  businesses:87},
  {id:"l5",name:"Tourism License",          authority:"DTCM",  validity:"1 year",  renewalDays:30, fee:"AED 2,500–10,000",  businesses:63},
];

const ALERTS = [
  {id:1,biz:"Al Noor Trading",   license:"Commercial",  expiry:"May 30, 2025",  daysLeft:4,  status:"critical"},
  {id:2,biz:"Bright Futures LLC",license:"Professional", expiry:"Jun 15, 2025", daysLeft:20, status:"warning"},
  {id:3,biz:"Innovate Hub",      license:"Free Zone",    expiry:"Jun 28, 2025", daysLeft:33, status:"warning"},
];

export default function CompliancePage() {
  const [tab,setTab] = useState<"frameworks"|"licenses"|"alerts">("frameworks");

  return (
    <div className="page-enter">
      <PageHeader title="Compliance & Licensing" subtitle="Manage UAE compliance frameworks, license types and renewal alerts"/>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
        {[
          {label:"Active Frameworks",  value:FRAMEWORKS.filter(f=>f.status==="active").length,  color:"var(--green)"},
          {label:"License Types",      value:LICENSE_TYPES.length,                              color:"var(--blue)"},
          {label:"Expiring Soon",      value:ALERTS.length,                                     color:"var(--amber)"},
          {label:"Critical Renewals",  value:ALERTS.filter(a=>a.status==="critical").length,    color:"var(--red)"},
        ].map(s=>(
          <div key={s.label} style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
            borderRadius:"var(--radius-lg)",padding:"12px 14px",boxShadow:"var(--shadow-sm)",
            position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,
              background:`linear-gradient(90deg,${s.color}55,${s.color}cc,${s.color}33)`}}/>
            <div style={{fontSize:11,color:"var(--text-muted)",marginBottom:3}}>{s.label}</div>
            <div style={{fontSize:24,fontWeight:800,color:s.color,fontFamily:"var(--font-display)"}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,background:"var(--bg-raised)",borderRadius:10,padding:4,
        width:"fit-content",marginBottom:16,border:"1.5px solid var(--border)"}}>
        {[{k:"frameworks",l:"Frameworks"},{k:"licenses",l:"License Types"},{k:"alerts",l:"Renewal Alerts"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as typeof tab)}
            style={{padding:"7px 16px",borderRadius:7,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",
              background:tab===t.k?"var(--bg-surface)":"transparent",
              color:tab===t.k?"var(--text-primary)":"var(--text-muted)",
              boxShadow:tab===t.k?"var(--shadow-xs)":"none",transition:"all 0.15s"}}>
            {t.l}
          </button>
        ))}
      </div>

      {tab==="frameworks"&&(
        <div style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1.5px solid var(--border)",
            display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:13,color:"var(--text-primary)"}}>Compliance Frameworks</span>
            <button className="btn btn-primary btn-sm">+ Add Framework</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Framework</th><th>Code</th><th>Type</th><th>Jurisdiction</th><th>Updated</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {FRAMEWORKS.map(f=>(
                <tr key={f.id}>
                  <td>
                    <div style={{fontWeight:600,fontSize:13,color:"var(--text-primary)"}}>{f.name}</div>
                    <div style={{fontSize:11.5,color:"var(--text-muted)",marginTop:1}}>{f.desc}</div>
                  </td>
                  <td><span style={{fontFamily:"monospace",fontSize:12,color:"var(--text-secondary)"}}>{f.code}</span></td>
                  <td><span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:100,
                    background:"var(--blue-dim)",color:"var(--blue)"}}>{f.type}</span></td>
                  <td style={{fontSize:12,color:"var(--text-secondary)"}}>{f.jurisdiction}</td>
                  <td style={{fontSize:12,color:"var(--text-muted)"}}>{f.updated}</td>
                  <td><span style={{fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:100,
                    background:f.status==="active"?"var(--green-dim)":"var(--amber-dim)",
                    color:f.status==="active"?"var(--green)":"var(--amber)",
                    textTransform:"capitalize"}}>{f.status}</span></td>
                  <td><button style={{fontSize:12,fontWeight:600,color:"var(--accent)",background:"none",border:"none",cursor:"pointer"}}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==="licenses"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
          {LICENSE_TYPES.map(l=>(
            <div key={l.id} style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
              borderRadius:"var(--radius-lg)",padding:"16px",boxShadow:"var(--shadow-sm)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13,color:"var(--text-primary)"}}>{l.name}</div>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:100,
                  background:"var(--accent-dim)",color:"var(--accent)"}}>{l.businesses} biz</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {[{label:"Authority",key:l.authority},{label:"Validity",key:l.validity},
                  {label:"Renew Before",key:`${l.renewalDays}d`},{label:"Fee Range",key:l.fee}].map(f=>(
                  <div key={f.label} style={{background:"var(--bg-raised)",borderRadius:7,padding:"7px 9px",border:"1px solid var(--border)"}}>
                    <div style={{fontSize:9.5,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>{f.label}</div>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--text-primary)"}}>{f.key}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm" style={{width:"100%"}}>Configure Rules</button>
            </div>
          ))}
        </div>
      )}

      {tab==="alerts"&&(
        <div style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1.5px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:13,color:"var(--text-primary)"}}>Upcoming License Renewals</span>
          </div>
          <table className="data-table">
            <thead><tr><th>Business</th><th>License Type</th><th>Expiry Date</th><th>Days Left</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {ALERTS.map(a=>{
                const color = a.status==="critical"?"var(--red)":"var(--amber)";
                return (
                  <tr key={a.id}>
                    <td style={{fontWeight:600,color:"var(--text-primary)"}}>{a.biz}</td>
                    <td style={{color:"var(--text-secondary)"}}>{a.license}</td>
                    <td style={{color:"var(--text-secondary)",fontWeight:500}}>{a.expiry}</td>
                    <td><span style={{fontWeight:800,color:color,fontFamily:"var(--font-display)"}}>{a.daysLeft} days</span></td>
                    <td><span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:100,
                      background:`${color}14`,color:color,textTransform:"capitalize"}}>{a.status}</span></td>
                    <td><button style={{fontSize:12,fontWeight:600,color:"var(--blue)",background:"none",border:"none",cursor:"pointer"}}>Notify Business</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
