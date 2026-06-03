"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

type TicketStatus = "open"|"in_progress"|"resolved"|"closed";
type Priority = "low"|"medium"|"high"|"critical";
interface Ticket {
  id:string; subject:string; user:string; business:string; status:TicketStatus;
  priority:Priority; category:string; created:string; lastUpdate:string; messages:number;
}

const TICKETS: Ticket[] = [
  {id:"T-0041",subject:"Invoice sync error — items not saving",        user:"Omar Khalid",        business:"Al Noor Trading",   status:"open",        priority:"high",     category:"Invoicing",  created:"2h ago",   lastUpdate:"2h ago",  messages:1},
  {id:"T-0040",subject:"Unable to generate UAE Trade License doc",     user:"Fatima Noor",        business:"Bright Futures LLC",status:"in_progress", priority:"high",     category:"Documents",  created:"4h ago",   lastUpdate:"1h ago",  messages:4},
  {id:"T-0039",subject:"AI Assistant giving incorrect VAT advice",     user:"Hassan Al-Rashid",   business:"Al-Rashid Group",   status:"in_progress", priority:"critical", category:"AI",         created:"6h ago",   lastUpdate:"30m ago", messages:7},
  {id:"T-0038",subject:"Password reset email not received",            user:"Reem Al-Zaabi",      business:"Zaabi Enterprises", status:"resolved",    priority:"medium",   category:"Auth",       created:"1d ago",   lastUpdate:"3h ago",  messages:3},
  {id:"T-0037",subject:"Payroll export format compatibility issue",    user:"Ahmed Bin Salman",   business:"Salman Group",      status:"open",        priority:"medium",   category:"Payroll",    created:"1d ago",   lastUpdate:"1d ago",  messages:2},
  {id:"T-0036",subject:"Billing discrepancy on annual subscription",   user:"Priya Sharma",       business:"Innovate Hub",      status:"resolved",    priority:"high",     category:"Billing",    created:"2d ago",   lastUpdate:"5h ago",  messages:6},
  {id:"T-0035",subject:"Dashboard charts not loading on mobile",       user:"Khalid Al-Mansouri", business:"Al-Mansouri LLC",   status:"closed",      priority:"low",      category:"UI",         created:"3d ago",   lastUpdate:"1d ago",  messages:5},
];

const ST: Record<TicketStatus,{bg:string;color:string;label:string}> = {
  open:        {bg:"var(--blue-dim)",  color:"var(--blue)",  label:"Open"},
  in_progress: {bg:"var(--amber-dim)", color:"var(--amber)", label:"In Progress"},
  resolved:    {bg:"var(--green-dim)", color:"var(--green)", label:"Resolved"},
  closed:      {bg:"rgba(148,163,184,0.12)",color:"#94A3B8", label:"Closed"},
};
const PR: Record<Priority,{color:string;label:string}> = {
  low:      {color:"#94A3B8",         label:"Low"},
  medium:   {color:"var(--amber)",    label:"Medium"},
  high:     {color:"var(--accent)",   label:"High"},
  critical: {color:"var(--red)",      label:"Critical"},
};

export default function SupportPage() {
  const [selected,setSelected] = useState<Ticket|null>(null);
  const [reply,setReply] = useState("");
  const [statusF,setStatusF] = useState("all");

  const filtered = TICKETS.filter(t=>statusF==="all"||t.status===statusF);

  return (
    <div className="page-enter">
      <PageHeader title="Support & Communications" subtitle="Manage support tickets and user communications"/>

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20 }}>
        {[
          {label:"Total Tickets", value:TICKETS.length,                                    color:"var(--blue)"},
          {label:"Open",          value:TICKETS.filter(t=>t.status==="open").length,        color:"var(--blue)"},
          {label:"In Progress",   value:TICKETS.filter(t=>t.status==="in_progress").length, color:"var(--amber)"},
          {label:"Critical",      value:TICKETS.filter(t=>t.priority==="critical").length,  color:"var(--red)"},
          {label:"Resolved",      value:TICKETS.filter(t=>t.status==="resolved").length,    color:"var(--green)"},
        ].map(s=>(
          <div key={s.label} style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
            borderRadius:"var(--radius-lg)",padding:"12px 14px",boxShadow:"var(--shadow-sm)",
            position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,
              background:`linear-gradient(90deg,${s.color}55,${s.color}cc,${s.color}33)` }}/>
            <div style={{ fontSize:11,color:"var(--text-muted)",marginBottom:3 }}>{s.label}</div>
            <div style={{ fontSize:22,fontWeight:800,color:s.color,fontFamily:"var(--font-display)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid",gridTemplateColumns:selected?"1fr 400px":"1fr",gap:14,alignItems:"start" }}>
        {/* Ticket list */}
        <div style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden" }}>
          <div style={{ padding:"12px 16px",borderBottom:"1.5px solid var(--border)",
            display:"flex",alignItems:"center",justifyContent:"space-between",gap:10 }}>
            <span style={{ fontFamily:"var(--font-display)",fontWeight:700,fontSize:13,color:"var(--text-primary)" }}>
              Support Tickets
            </span>
            <div style={{ display:"flex",gap:2,background:"var(--bg-raised)",borderRadius:7,padding:3,border:"1.5px solid var(--border)" }}>
              {["all","open","in_progress","resolved"].map(s=>(
                <button key={s} onClick={()=>setStatusF(s)}
                  style={{ padding:"4px 10px",borderRadius:5,fontSize:11,fontWeight:600,border:"none",cursor:"pointer",
                    background:statusF===s?"var(--bg-surface)":"transparent",
                    color:statusF===s?"var(--text-primary)":"var(--text-muted)",
                    whiteSpace:"nowrap",transition:"all 0.12s" }}>
                  {s==="in_progress"?"In Progress":s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {filtered.map(t=>{
            const s = ST[t.status];
            const p = PR[t.priority];
            const isSelected = selected?.id === t.id;
            return (
              <div key={t.id} onClick={()=>setSelected(isSelected?null:t)}
                style={{ padding:"12px 16px",borderBottom:"1px solid var(--border)",cursor:"pointer",
                  background:isSelected?"var(--accent-dim)":"transparent",
                  borderLeft:`3px solid ${isSelected?"var(--accent)":"transparent"}`,
                  transition:"all 0.12s" }}
                onMouseEnter={e=>{if(!isSelected){e.currentTarget.style.background="var(--bg-hover)";}}}
                onMouseLeave={e=>{if(!isSelected){e.currentTarget.style.background="transparent";}}}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8 }}>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                      <span style={{ fontSize:11,fontFamily:"monospace",color:"var(--text-muted)",fontWeight:500 }}>{t.id}</span>
                      <span style={{ fontSize:10.5,fontWeight:700,padding:"1px 6px",borderRadius:100,
                        color:p.color,background:`${p.color}14` }}>{p.label}</span>
                      <span style={{ fontSize:10.5,fontWeight:600,padding:"1px 6px",borderRadius:100,
                        background:s.bg,color:s.color }}>{s.label}</span>
                    </div>
                    <div style={{ fontWeight:600,fontSize:13,color:"var(--text-primary)",marginBottom:3,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{t.subject}</div>
                    <div style={{ fontSize:11.5,color:"var(--text-secondary)" }}>
                      {t.user} · <span style={{ color:"var(--text-muted)" }}>{t.business}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right",flexShrink:0 }}>
                    <div style={{ fontSize:10.5,color:"var(--text-muted)" }}>{t.lastUpdate}</div>
                    <div style={{ fontSize:10.5,color:"var(--text-muted)",marginTop:2 }}>{t.messages} msg{t.messages!==1?"s":""}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ticket detail panel */}
        {selected&&(
          <div style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
            borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden",
            position:"sticky",top:0 }}>
            <div style={{ padding:"14px 16px",borderBottom:"1.5px solid var(--border)",
              display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div>
                <div style={{ fontFamily:"monospace",fontSize:11,color:"var(--text-muted)",marginBottom:2 }}>{selected.id}</div>
                <div style={{ fontWeight:700,fontSize:13,color:"var(--text-primary)" }}>{selected.subject}</div>
              </div>
              <button onClick={()=>setSelected(null)}
                style={{ width:26,height:26,borderRadius:6,border:"1.5px solid var(--border)",
                  background:"var(--bg-raised)",cursor:"pointer",color:"var(--text-muted)",fontSize:12 }}>✕</button>
            </div>
            <div style={{ padding:"14px 16px",borderBottom:"1.5px solid var(--border)" }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {[
                  {label:"User",     value:selected.user},
                  {label:"Business", value:selected.business},
                  {label:"Category", value:selected.category},
                  {label:"Created",  value:selected.created},
                ].map(f=>(
                  <div key={f.label}>
                    <div style={{ fontSize:10,color:"var(--text-muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2 }}>{f.label}</div>
                    <div style={{ fontSize:12.5,fontWeight:500,color:"var(--text-primary)" }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12,display:"flex",gap:8 }}>
                <select className="input-base" defaultValue={selected.status} style={{ flex:1,height:32,fontSize:12 }}>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <button className="btn btn-primary btn-sm">Update Status</button>
              </div>
            </div>
            {/* Reply area */}
            <div style={{ padding:"14px 16px" }}>
              <div style={{ fontSize:12,fontWeight:600,color:"var(--text-secondary)",marginBottom:8 }}>Reply to User</div>
              <textarea value={reply} onChange={e=>setReply(e.target.value)}
                className="input-base" style={{ resize:"vertical",minHeight:100,marginBottom:10 }}
                placeholder="Type your reply here…"/>
              <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}>
                <button className="btn btn-secondary btn-sm">Save Draft</button>
                <button className="btn btn-primary btn-sm" onClick={()=>setReply("")}>Send Reply</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
