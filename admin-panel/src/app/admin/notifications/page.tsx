"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

type NLevel = "critical"|"warning"|"info"|"success";
interface Notif {
  id:number; level:NLevel; title:string; desc:string; module:string;
  time:string; read:boolean; action?:string;
}

const NOTIFS: Notif[] = [
  {id:1,level:"critical",title:"AI credit limit near exhaustion",      desc:"Business #2041 (Innovate Hub) is at 94% of monthly token limit.",   module:"AI Control",  time:"2m ago",   read:false,action:"Manage Limits"},
  {id:2,level:"warning", title:"Subscription payment failed",          desc:"Al Noor Trading — Pro plan renewal failed. Retry in 24h.",           module:"Billing",     time:"14m ago",  read:false,action:"View Subscription"},
  {id:3,level:"critical",title:"Document generation timeout ×3",       desc:"Template #094 failing consistently. Check template configuration.",   module:"Documents",   time:"38m ago",  read:false,action:"View Logs"},
  {id:4,level:"info",    title:"New business registered",               desc:"Al-Mansouri Construction LLC completed onboarding.",                 module:"Businesses",  time:"1h ago",   read:true},
  {id:5,level:"warning", title:"Support ticket unanswered 48h",        desc:"Ticket T-0037: Payroll export issue — no admin response.",           module:"Support",     time:"2h ago",   read:false,action:"View Ticket"},
  {id:6,level:"success", title:"Backup completed successfully",        desc:"Database backup completed. 2.4 GB stored securely.",                 module:"System",      time:"3h ago",   read:true},
  {id:7,level:"info",    title:"System update available",               desc:"BizMate Admin v1.1.0 ready to deploy. Changelog available.",        module:"System",      time:"5h ago",   read:true,action:"View Update"},
  {id:8,level:"warning", title:"Unusual AI usage pattern detected",    desc:"Business #1192 used 12k tokens in 5 mins — possible abuse.",        module:"AI Control",  time:"6h ago",   read:true,action:"Investigate"},
  {id:9,level:"success", title:"Plan upgraded: Enterprise",            desc:"Salman Group upgraded from Pro to Enterprise.",                      module:"Billing",     time:"8h ago",   read:true},
  {id:10,level:"info",   title:"New compliance framework added",       desc:"UAE Cabinet Decision No. 81/2023 framework now active.",            module:"Compliance",  time:"1d ago",   read:true},
];

const LEVEL_CFG: Record<NLevel,{bg:string;color:string;icon:string;border:string}> = {
  critical:{bg:"var(--red-dim)",   color:"var(--red)",   icon:"⚠", border:"rgba(239,68,68,0.25)"},
  warning: {bg:"var(--amber-dim)", color:"var(--amber)", icon:"!", border:"rgba(245,158,11,0.25)"},
  info:    {bg:"var(--blue-dim)",  color:"var(--blue)",  icon:"ℹ", border:"rgba(59,130,246,0.25)"},
  success: {bg:"var(--green-dim)", color:"var(--green)", icon:"✓", border:"rgba(16,185,129,0.25)"},
};

export default function NotificationsPage() {
  const [notifs,setNotifs] = useState(NOTIFS);
  const [filter,setFilter] = useState("all");

  const filtered = notifs.filter(n=>filter==="all"||n.level===filter||(filter==="unread"&&!n.read));
  const unreadCount = notifs.filter(n=>!n.read).length;

  const markRead = (id:number) => setNotifs(ns=>ns.map(n=>n.id===id?{...n,read:true}:n));
  const markAll  = () => setNotifs(ns=>ns.map(n=>({...n,read:true})));

  return (
    <div className="page-enter">
      <PageHeader title="Notifications & Alerts" subtitle="System alerts, failed processes and AI limit warnings"
        action={unreadCount>0&&(
          <button className="btn btn-secondary" onClick={markAll}>
            Mark all read ({unreadCount})
          </button>
        )}/>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:20}}>
        {[
          {label:"Unread",   value:unreadCount,                               color:"var(--red)"},
          {label:"Critical", value:notifs.filter(n=>n.level==="critical").length, color:"var(--red)"},
          {label:"Warnings", value:notifs.filter(n=>n.level==="warning").length,  color:"var(--amber)"},
          {label:"Info",     value:notifs.filter(n=>n.level==="info").length,      color:"var(--blue)"},
          {label:"Success",  value:notifs.filter(n=>n.level==="success").length,   color:"var(--green)"},
        ].map(s=>(
          <div key={s.label} style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
            borderRadius:"var(--radius-lg)",padding:"12px 14px",boxShadow:"var(--shadow-sm)",
            position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,
              background:`linear-gradient(90deg,${s.color}55,${s.color}cc,${s.color}33)`}}/>
            <div style={{fontSize:11,color:"var(--text-muted)",marginBottom:3}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:800,color:s.color,fontFamily:"var(--font-display)"}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{display:"flex",gap:2,background:"var(--bg-raised)",borderRadius:10,padding:4,
        width:"fit-content",marginBottom:16,border:"1.5px solid var(--border)"}}>
        {["all","unread","critical","warning","info","success"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{padding:"6px 14px",borderRadius:7,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",
              background:filter===f?"var(--bg-surface)":"transparent",
              color:filter===f?"var(--text-primary)":"var(--text-muted)",
              boxShadow:filter===f?"var(--shadow-xs)":"none",transition:"all 0.15s",
              textTransform:"capitalize",whiteSpace:"nowrap"}}>
            {f}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
        borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden"}}>
        {filtered.map((n,i)=>{
          const c = LEVEL_CFG[n.level];
          return (
            <div key={n.id} onClick={()=>markRead(n.id)}
              style={{display:"flex",gap:14,padding:"14px 18px",cursor:"pointer",
                background:n.read?"transparent":"rgba(59,130,246,0.025)",
                borderBottom:i<filtered.length-1?"1px solid var(--border)":"none",
                borderLeft:`3px solid ${n.read?"transparent":c.color}`,
                transition:"background 0.1s"}}
              onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-hover)")}
              onMouseLeave={e=>(e.currentTarget.style.background=n.read?"transparent":"rgba(59,130,246,0.025)")}>
              <div style={{width:34,height:34,borderRadius:9,background:c.bg,border:`1.5px solid ${c.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                fontSize:14,color:c.color,fontWeight:700}}>
                {c.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontWeight:n.read?600:700,fontSize:13,color:"var(--text-primary)"}}>
                    {n.title}
                  </span>
                  {!n.read&&<span style={{width:6,height:6,borderRadius:"50%",background:"var(--blue)",flexShrink:0}}/>}
                  <span style={{fontSize:10.5,padding:"1px 6px",borderRadius:100,
                    background:"var(--bg-raised)",color:"var(--text-muted)",border:"1px solid var(--border)",
                    marginLeft:"auto",whiteSpace:"nowrap"}}>{n.module}</span>
                </div>
                <p style={{fontSize:12.5,color:"var(--text-secondary)",margin:"0 0 6px",lineHeight:1.5}}>{n.desc}</p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:11,color:"var(--text-muted)"}}>{n.time}</span>
                  {n.action&&(
                    <button style={{fontSize:11.5,fontWeight:600,color:"var(--accent)",
                      background:"none",border:"none",cursor:"pointer",padding:0}}>
                      {n.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&(
          <div style={{padding:"48px 0",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:8}}>🔔</div>
            <div style={{fontSize:13,color:"var(--text-muted)"}}>No notifications in this category</div>
          </div>
        )}
      </div>
    </div>
  );
}
