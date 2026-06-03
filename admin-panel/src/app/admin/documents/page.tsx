"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar, { SearchInput, SelectFilter } from "@/components/ui/FilterBar";

type TemplateStatus = "active"|"draft"|"archived";
type TemplateCategory = "contract"|"invoice"|"compliance"|"hr"|"legal"|"general";

interface DocTemplate {
  id:string; name:string; category:TemplateCategory; status:TemplateStatus;
  description:string; language:string; usageCount:number;
  createdAt:string; updatedAt:string; tags:string[];
  fields:string[]; pages:number; format:string;
}

const MOCK: DocTemplate[] = [
  {id:"d001",name:"UAE Trade License Application",  category:"compliance",status:"active",  description:"Standard UAE DED trade license application with all required fields and attachments.",language:"EN/AR",usageCount:1240,createdAt:"Jan 10, 2025",updatedAt:"Apr 22, 2025",tags:["UAE","DED","License"],fields:["Business Name","Activity Type","Legal Form","Owner Name","TRN"],pages:4,format:"PDF"},
  {id:"d002",name:"Service Agreement (B2B)",        category:"contract",  status:"active",  description:"Comprehensive B2B service contract template compliant with UAE Commercial Law.",language:"EN",   usageCount:876, createdAt:"Feb 1, 2025", updatedAt:"May 1, 2025", tags:["Contract","B2B","Legal"],fields:["Party A","Party B","Scope","Payment Terms","Duration"],pages:6,format:"DOCX"},
  {id:"d003",name:"Employee Offer Letter",          category:"hr",        status:"active",  description:"Standard employment offer letter compliant with UAE Labour Law (Federal Decree-Law No. 33).",language:"EN/AR",usageCount:2104,createdAt:"Jan 5, 2025",updatedAt:"Mar 14, 2025",tags:["HR","Labour","Offer"],fields:["Employee Name","Position","Salary","Start Date","Probation"],pages:2,format:"DOCX"},
  {id:"d004",name:"Commercial Invoice Template",   category:"invoice",   status:"active",  description:"VAT-compliant commercial invoice template for AED and USD transactions.",language:"EN",   usageCount:3842,createdAt:"Jan 1, 2025", updatedAt:"May 3, 2025", tags:["VAT","Invoice","AED"],fields:["Seller","Buyer","Items","VAT","Total"],pages:1,format:"PDF"},
  {id:"d005",name:"Mutual NDA Agreement",          category:"legal",     status:"active",  description:"Mutual Non-Disclosure Agreement governed by UAE jurisdiction.",language:"EN",   usageCount:542, createdAt:"Feb 20, 2025",updatedAt:"Apr 5, 2025", tags:["NDA","Legal","IP"],fields:["Disclosing Party","Receiving Party","Confidential Info","Duration"],pages:3,format:"DOCX"},
  {id:"d006",name:"Freelancer Agreement v2",       category:"contract",  status:"draft",   description:"Updated freelancer contract covering IP rights, payment terms and termination clauses.",language:"EN",   usageCount:0,   createdAt:"May 10, 2025",updatedAt:"May 15, 2025",tags:["Freelance","Contract"],fields:["Contractor","Client","Deliverables","Rate","IP Clause"],pages:4,format:"DOCX"},
  {id:"d007",name:"Visa Sponsorship Letter",       category:"hr",        status:"active",  description:"Company visa sponsorship letter template for UAE residency visa applications.",language:"EN/AR",usageCount:1580,createdAt:"Jan 15, 2025",updatedAt:"Apr 1, 2025", tags:["Visa","Sponsorship","HR"],fields:["Employee","Passport No","Nationality","Position","Salary"],pages:1,format:"PDF"},
  {id:"d008",name:"Q1 2024 VAT Return Summary",   category:"compliance",status:"archived",description:"Q1 2024 VAT return summary sheet — archived, superseded by Q2 version.",language:"EN",   usageCount:220, createdAt:"Mar 1, 2024", updatedAt:"Jun 30, 2024",tags:["VAT","Archived","Q1"],fields:["TRN","Period","Output Tax","Input Tax","Net VAT"],pages:2,format:"XLSX"},
];

const CAT: Record<TemplateCategory,{bg:string;color:string;label:string}> = {
  contract:  {bg:"var(--blue-dim)",   color:"var(--blue)",   label:"Contract"},
  invoice:   {bg:"var(--accent-dim)", color:"var(--accent)", label:"Invoice"},
  compliance:{bg:"var(--green-dim)",  color:"var(--green)",  label:"Compliance"},
  hr:        {bg:"var(--purple-dim)", color:"var(--purple)", label:"HR"},
  legal:     {bg:"var(--amber-dim)",  color:"var(--amber)",  label:"Legal"},
  general:   {bg:"rgba(148,163,184,0.12)",color:"#94A3B8",   label:"General"},
};

const ST: Record<TemplateStatus,{bg:string;color:string}> = {
  active:  {bg:"var(--green-dim)",            color:"var(--green)"},
  draft:   {bg:"var(--amber-dim)",            color:"var(--amber)"},
  archived:{bg:"rgba(148,163,184,0.12)",      color:"#94A3B8"},
};

/* ─── Template Form Modal ─────────────────────────────────── */
function TemplateModal({open,tpl,onClose,onSave}:{
  open:boolean; tpl:DocTemplate|null; onClose:()=>void; onSave:(d:Partial<DocTemplate>)=>void;
}) {
  const [form,setForm] = useState({
    name:        tpl?.name        ?? "",
    category:    tpl?.category    ?? "general" as TemplateCategory,
    status:      tpl?.status      ?? "draft"   as TemplateStatus,
    description: tpl?.description ?? "",
    language:    tpl?.language    ?? "EN",
    format:      tpl?.format      ?? "DOCX",
    pages:       tpl?.pages       ?? 1,
    tags:        tpl?.tags?.join(", ") ?? "",
    fields:      tpl?.fields?.join("\n") ?? "",
  });
  const set = (k:string,v:unknown) => setForm(f=>({...f,[k]:v}));

  if(!open) return null;

  const labelSt: React.CSSProperties = {
    display:"block",fontSize:11,fontWeight:700,color:"var(--text-secondary)",
    marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em",
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(15,23,42,0.40)",backdropFilter:"blur(3px)",padding:16 }} onClick={onClose}>
      <div style={{ width:"100%",maxWidth:680,background:"var(--bg-panel)",border:"1.5px solid var(--border)",
        borderRadius:"var(--radius-xl)",boxShadow:"var(--shadow-xl)",overflow:"hidden",
        maxHeight:"90vh",display:"flex",flexDirection:"column" }} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"18px 24px",borderBottom:"1.5px solid var(--border)",flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"var(--font-display)",fontWeight:700,fontSize:16,color:"var(--text-primary)" }}>
              {tpl ? "Edit Template" : "New Document Template"}
            </div>
            <div style={{ fontSize:12,color:"var(--text-muted)",marginTop:2 }}>
              Templates are available to all businesses in the client application
            </div>
          </div>
          <button onClick={onClose} style={{ width:30,height:30,borderRadius:8,border:"1.5px solid var(--border)",
            background:"var(--bg-raised)",cursor:"pointer",fontSize:14,color:"var(--text-muted)" }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding:"20px 24px",overflowY:"auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelSt}>Template Name *</label>
            <input value={form.name} onChange={e=>set("name",e.target.value)}
              className="input-base" placeholder="e.g. UAE Trade License Application"/>
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelSt}>Description</label>
            <textarea value={form.description} onChange={e=>set("description",e.target.value)}
              className="input-base" style={{resize:"vertical",minHeight:72}}
              placeholder="Describe what this template is used for…"/>
          </div>
          <div>
            <label style={labelSt}>Category</label>
            <select value={form.category} onChange={e=>set("category",e.target.value)} className="input-base">
              {Object.entries(CAT).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSt}>Language</label>
            <select value={form.language} onChange={e=>set("language",e.target.value)} className="input-base">
              <option value="EN">English</option>
              <option value="AR">Arabic</option>
              <option value="EN/AR">Bilingual (EN/AR)</option>
            </select>
          </div>
          <div>
            <label style={labelSt}>Output Format</label>
            <select value={form.format} onChange={e=>set("format",e.target.value)} className="input-base">
              <option value="DOCX">Word (DOCX)</option>
              <option value="PDF">PDF</option>
              <option value="XLSX">Excel (XLSX)</option>
            </select>
          </div>
          <div>
            <label style={labelSt}>Pages (approx.)</label>
            <input type="number" min={1} max={50} value={form.pages} onChange={e=>set("pages",Number(e.target.value))}
              className="input-base"/>
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelSt}>Required Fields (one per line)</label>
            <textarea value={form.fields} onChange={e=>set("fields",e.target.value)}
              className="input-base" style={{resize:"vertical",minHeight:90,fontFamily:"monospace",fontSize:12}}
              placeholder={"Business Name\nOwner Name\nTRN Number\nActivity Type"}/>
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelSt}>Tags (comma separated)</label>
            <input value={form.tags} onChange={e=>set("tags",e.target.value)}
              className="input-base" placeholder="e.g. UAE, DED, License, 2025"/>
          </div>
          <div>
            <label style={labelSt}>Status</label>
            <select value={form.status} onChange={e=>set("status",e.target.value)} className="input-base">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Info banner */}
        <div style={{ margin:"0 24px 16px",padding:"10px 14px",borderRadius:8,
          background:"var(--blue-dim)",border:"1.5px solid rgba(59,130,246,0.2)",
          display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="var(--blue)" strokeWidth="1.3"/>
            <path d="M8 7v4" stroke="var(--blue)" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="8" cy="5.5" r="0.7" fill="var(--blue)"/>
          </svg>
          <span style={{ fontSize:12,color:"var(--blue)" }}>
            Active templates are immediately available to users in the client application.
          </span>
        </div>

        {/* Footer */}
        <div style={{ display:"flex",justifyContent:"flex-end",gap:10,padding:"14px 24px",
          borderTop:"1.5px solid var(--border)",flexShrink:0 }}>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={()=>{
            onSave({...form,
              tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean),
              fields:form.fields.split("\n").map(t=>t.trim()).filter(Boolean),
            });
            onClose();
          }} className="btn btn-primary">
            {tpl ? "Save Changes" : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function DocumentsPage() {
  const [templates,setTemplates] = useState(MOCK);
  const [search,setSearch]       = useState("");
  const [catF,setCatF]           = useState("all");
  const [statusF,setStatusF]     = useState("all");
  const [modalOpen,setModalOpen] = useState(false);
  const [editTpl,setEditTpl]     = useState<DocTemplate|null>(null);

  const filtered = templates.filter(t=>{
    const q=search.toLowerCase();
    return (!q||t.name.toLowerCase().includes(q)||t.description.toLowerCase().includes(q)||t.tags.some(g=>g.toLowerCase().includes(q)))
      && (catF==="all"   || t.category===catF)
      && (statusF==="all"|| t.status===statusF);
  });

  const handleSave = (data:Partial<DocTemplate>) => {
    if(editTpl) {
      setTemplates(ts=>ts.map(t=>t.id===editTpl.id?{...t,...data,updatedAt:"Today"}:t));
    } else {
      setTemplates(ts=>[{...data,id:`d${Date.now()}`,usageCount:0,createdAt:"Today",updatedAt:"Today"} as DocTemplate,...ts]);
    }
  };

  const toggleStatus = (id:string) => setTemplates(ts=>ts.map(t=>{
    if(t.id!==id) return t;
    const next: TemplateStatus = t.status==="active"?"archived":"active";
    return {...t,status:next,updatedAt:"Today"};
  }));

  const totalUse = templates.filter(t=>t.status==="active").reduce((s,t)=>s+t.usageCount,0);

  return (
    <div className="page-enter">
      <PageHeader title="Document Generator" subtitle="Create and manage document templates available to all businesses"
        action={
          <button className="btn btn-primary" onClick={()=>{setEditTpl(null);setModalOpen(true);}}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            New Template
          </button>
        }/>

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20 }}>
        {[
          {label:"Total Templates", value:templates.length,                                  color:"var(--blue)"},
          {label:"Active",          value:templates.filter(t=>t.status==="active").length,    color:"var(--green)"},
          {label:"Draft",           value:templates.filter(t=>t.status==="draft").length,     color:"var(--amber)"},
          {label:"Total Generated", value:totalUse.toLocaleString(),                          color:"var(--accent)"},
        ].map(s=>(
          <div key={s.label} style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
            borderRadius:"var(--radius-lg)",padding:"14px 16px",boxShadow:"var(--shadow-sm)",
            position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,
              background:`linear-gradient(90deg,${s.color}55,${s.color}cc,${s.color}33)` }}/>
            <div style={{ fontSize:11,color:"var(--text-muted)",marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:24,fontWeight:800,color:s.color,
              fontFamily:"var(--font-display)",letterSpacing:"-0.025em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <FilterBar right={<span style={{fontSize:12,color:"var(--text-muted)"}}>{filtered.length} templates</span>}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search templates…"/>
        <SelectFilter value={catF} onChange={setCatF} options={[
          {label:"All Categories",value:"all"},
          ...Object.entries(CAT).map(([k,v])=>({label:v.label,value:k}))
        ]}/>
        <SelectFilter value={statusF} onChange={setStatusF} options={[
          {label:"All Status",value:"all"},{label:"Active",value:"active"},
          {label:"Draft",value:"draft"},{label:"Archived",value:"archived"},
        ]}/>
      </FilterBar>

      {/* Grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14 }}>
        {filtered.map(t=>{
          const cat = CAT[t.category];
          const st  = ST[t.status];
          return (
            <div key={t.id} style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
              borderRadius:"var(--radius-lg)",overflow:"hidden",boxShadow:"var(--shadow-sm)",
              display:"flex",flexDirection:"column",
              transition:"box-shadow 0.2s,border-color 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="var(--shadow-md)";e.currentTarget.style.borderColor="var(--border-mid)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="var(--shadow-sm)";e.currentTarget.style.borderColor="var(--border)";}}>
              {/* Top stripe */}
              <div style={{ height:4,background:`linear-gradient(90deg,${cat.color}88,${cat.color})` }}/>
              <div style={{ padding:"14px 16px",flex:1,display:"flex",flexDirection:"column",gap:10 }}>
                {/* Header row */}
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap",flex:1,minWidth:0 }}>
                    <span style={{ fontSize:10.5,fontWeight:700,padding:"2px 7px",borderRadius:100,
                      background:cat.bg,color:cat.color }}>{cat.label}</span>
                    <span style={{ fontSize:10.5,fontWeight:600,padding:"2px 7px",borderRadius:100,
                      background:st.bg,color:st.color,textTransform:"capitalize" }}>{t.status}</span>
                    <span style={{ fontSize:10.5,fontWeight:500,padding:"2px 7px",borderRadius:100,
                      background:"var(--bg-raised)",color:"var(--text-muted)",border:"1px solid var(--border)" }}>
                      {t.format}
                    </span>
                  </div>
                  <div style={{ display:"flex",gap:4,flexShrink:0,marginLeft:8 }}>
                    <button onClick={()=>{setEditTpl(t);setModalOpen(true);}}
                      style={{ width:26,height:26,borderRadius:6,border:"1.5px solid var(--border)",
                        background:"var(--bg-raised)",cursor:"pointer",color:"var(--text-muted)",
                        display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)";e.currentTarget.style.background="var(--accent-dim)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-muted)";e.currentTarget.style.background="var(--bg-raised)";}}>
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2l3 3-7 7H2v-3L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button onClick={()=>toggleStatus(t.id)}
                      style={{ width:26,height:26,borderRadius:6,border:"1.5px solid var(--border)",
                        background:"var(--bg-raised)",cursor:"pointer",color:"var(--text-muted)",
                        display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s" }}
                      title={t.status==="active"?"Archive":"Activate"}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=t.status==="active"?"var(--red)":"var(--green)";e.currentTarget.style.color=t.status==="active"?"var(--red)":"var(--green)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-muted)";}}>
                      {t.status==="active"
                        ? <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" transform="rotate(45 7 7)"/></svg>
                        : <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Title + desc */}
                <div>
                  <div style={{ fontWeight:700,fontSize:13.5,color:"var(--text-primary)",lineHeight:1.3,marginBottom:5 }}>
                    {t.name}
                  </div>
                  <p style={{ fontSize:12,color:"var(--text-secondary)",lineHeight:1.55,margin:0,
                    display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
                    {t.description}
                  </p>
                </div>

                {/* Fields preview */}
                {t.fields.length > 0 && (
                  <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                    {t.fields.slice(0,4).map(f=>(
                      <span key={f} style={{ fontSize:10,padding:"2px 7px",borderRadius:5,
                        background:"var(--bg-raised)",color:"var(--text-muted)",border:"1px solid var(--border)",
                        fontFamily:"monospace" }}>
                        {`{{${f.toLowerCase().replace(/ /g,"_")}}}`}
                      </span>
                    ))}
                    {t.fields.length > 4 && (
                      <span style={{ fontSize:10,padding:"2px 7px",borderRadius:5,
                        background:"var(--bg-raised)",color:"var(--text-muted)" }}>
                        +{t.fields.length-4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                  {t.tags.map(tag=>(
                    <span key={tag} style={{ fontSize:10.5,padding:"2px 8px",borderRadius:100,
                      background:"var(--bg-raised)",color:"var(--text-muted)",border:"1px solid var(--border)" }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                  paddingTop:10,borderTop:"1px solid var(--border)",marginTop:"auto" }}>
                  <div style={{ display:"flex",gap:12 }}>
                    <span style={{ fontSize:11,color:"var(--text-muted)" }}>{t.language}</span>
                    <span style={{ fontSize:11,color:"var(--text-muted)" }}>{t.pages}p</span>
                    <span style={{ fontSize:11,color:"var(--text-muted)" }}>Updated {t.updatedAt}</span>
                  </div>
                  <span style={{ fontSize:11.5,fontWeight:700,color:"var(--accent)" }}>
                    {t.usageCount.toLocaleString()} uses
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn:"1/-1",padding:"64px 0",textAlign:"center",
            background:"var(--bg-surface)",border:"1.5px solid var(--border)",borderRadius:"var(--radius-lg)" }}>
            <div style={{ fontSize:32,marginBottom:12 }}>📄</div>
            <div style={{ fontSize:14,fontWeight:600,color:"var(--text-primary)",marginBottom:4 }}>No templates found</div>
            <div style={{ fontSize:13,color:"var(--text-muted)" }}>Try adjusting your search or filters</div>
          </div>
        )}
      </div>

      <TemplateModal open={modalOpen} tpl={editTpl} onClose={()=>{setModalOpen(false);setEditTpl(null);}} onSave={handleSave}/>
    </div>
  );
}
