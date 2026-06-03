"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar, { SearchInput, SelectFilter } from "@/components/ui/FilterBar";

type BizStatus = "active"|"suspended"|"pending";
interface Business {
  id:string; name:string; owner:string; email:string; plan:string;
  status:BizStatus; country:string; industry:string; users:number;
  joinedAt:string; aiUsed:number; aiLimit:number|"unlimited"; invoicesThisMonth:number;
}

const DATA: Business[] = [
  {id:"b001",name:"Al-Rashid Group",    owner:"Hassan Al-Rashid",   email:"billing@alrashid.ae",     plan:"Enterprise",status:"active",   country:"UAE",  industry:"Trading",      users:18,joinedAt:"Dec 1, 2024", aiUsed:480000, aiLimit:"unlimited",invoicesThisMonth:34},
  {id:"b002",name:"Bright Futures LLC", owner:"Fatima Noor",        email:"finance@brightfutures.ae",plan:"Pro",        status:"active",   country:"UAE",  industry:"Consulting",   users:5, joinedAt:"Feb 3, 2025", aiUsed:68000,  aiLimit:100000,     invoicesThisMonth:12},
  {id:"b003",name:"Al Noor Trading",    owner:"Omar Khalid",        email:"accounts@alnoor.ae",      plan:"Pro",        status:"active",   country:"UAE",  industry:"Trading",      users:3, joinedAt:"Mar 7, 2025", aiUsed:32000,  aiLimit:100000,     invoicesThisMonth:8},
  {id:"b004",name:"TechFlow Solutions", owner:"Sarah Mitchell",     email:"hello@techflow.io",       plan:"Starter",    status:"suspended",country:"UAE",  industry:"Technology",   users:2, joinedAt:"Nov 20, 2024",aiUsed:4200,   aiLimit:25000,      invoicesThisMonth:0},
  {id:"b005",name:"Salman Group",       owner:"Ahmed Bin Salman",   email:"ops@salmangroup.ae",      plan:"Enterprise",status:"active",   country:"UAE",  industry:"Real Estate",  users:34,joinedAt:"Dec 1, 2024", aiUsed:720000, aiLimit:"unlimited",invoicesThisMonth:67},
  {id:"b006",name:"Innovate Hub",       owner:"Priya Sharma",       email:"priya@innovate.in",       plan:"Starter",    status:"active",   country:"India",industry:"Technology",   users:4, joinedAt:"Apr 1, 2025", aiUsed:12000,  aiLimit:25000,      invoicesThisMonth:5},
  {id:"b007",name:"Al-Mansouri LLC",    owner:"Khalid Al-Mansouri", email:"khalid@mansouri.ae",      plan:"Pro",        status:"pending",  country:"UAE",  industry:"Construction", users:1, joinedAt:"May 15, 2025",aiUsed:0,      aiLimit:100000,     invoicesThisMonth:0},
];

const ST: Record<BizStatus,{bg:string;color:string}> = {
  active:   {bg:"var(--green-dim)",color:"var(--green)"},
  suspended:{bg:"var(--red-dim)",  color:"var(--red)"},
  pending:  {bg:"var(--amber-dim)",color:"var(--amber)"},
};
const PC: Record<string,string> = {
  Starter:"#64748B", Pro:"#3B82F6", Enterprise:"var(--accent)",
};

export default function BusinessesPage() {
  const [biz, setBiz]       = useState(DATA);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [planF, setPlanF]   = useState("all");

  const filtered = biz.filter(b => {
    const q = search.toLowerCase();
    return (!q || b.name.toLowerCase().includes(q) || b.owner.toLowerCase().includes(q) || b.email.toLowerCase().includes(q))
      && (statusF === "all" || b.status === statusF)
      && (planF   === "all" || b.plan   === planF);
  });

  const toggle = (id: string) => setBiz(bs => bs.map(b =>
    b.id !== id ? b : { ...b, status: b.status === "suspended" ? "active" : "suspended" }
  ));

  const BizIcon = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M3 18V8l7-5 7 5v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 18v-5h6v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
  const ActiveIcon = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  const BanIcon = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M4.5 4.5l11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  const ClockIcon = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;

  return (
    <div className="page-enter">
      <PageHeader title="Business Management" subtitle="Manage all registered businesses, subscriptions and usage"/>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:20 }}>
        {[
          {label:"Total Businesses",value:biz.length,                                  color:"var(--blue)",  icon:<BizIcon/>},
          {label:"Active",          value:biz.filter(b=>b.status==="active").length,    color:"var(--green)", icon:<ActiveIcon/>},
          {label:"Suspended",       value:biz.filter(b=>b.status==="suspended").length, color:"var(--red)",   icon:<BanIcon/>},
          {label:"Pending",         value:biz.filter(b=>b.status==="pending").length,   color:"var(--amber)", icon:<ClockIcon/>},
        ].map(s => (
          <div key={s.label} style={{ background:"var(--bg-surface)", border:"1.5px solid var(--border)",
            borderRadius:"var(--radius-lg)", padding:"14px 16px", boxShadow:"var(--shadow-sm)",
            position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,
              background:`linear-gradient(90deg,${s.color}55,${s.color}cc,${s.color}33)` }}/>
            <div style={{ width:32,height:32,borderRadius:8,background:`${s.color}14`,color:s.color,
              display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,
              border:`1.5px solid ${s.color}22` }}>{s.icon}</div>
            <div style={{ fontSize:11,color:"var(--text-muted)",marginBottom:3 }}>{s.label}</div>
            <div style={{ fontSize:24,fontWeight:800,color:"var(--text-primary)",
              fontFamily:"var(--font-display)",letterSpacing:"-0.025em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <FilterBar right={<span style={{fontSize:12,color:"var(--text-muted)"}}>{filtered.length} of {biz.length} businesses</span>}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search businesses…"/>
        <SelectFilter value={statusF} onChange={setStatusF} options={[
          {label:"All Status",value:"all"},{label:"Active",value:"active"},
          {label:"Suspended",value:"suspended"},{label:"Pending",value:"pending"},
        ]}/>
        <SelectFilter value={planF} onChange={setPlanF} options={[
          {label:"All Plans",value:"all"},{label:"Starter",value:"Starter"},
          {label:"Pro",value:"Pro"},{label:"Enterprise",value:"Enterprise"},
        ]}/>
      </FilterBar>

      <div style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
        borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Business</th><th>Owner</th><th>Plan</th><th>Status</th>
                <th>Users</th><th>AI Usage</th><th>Invoices/mo</th><th>Joined</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const s = ST[b.status];
                const pc = PC[b.plan] ?? "#94A3B8";
                const aiPct = b.aiLimit === "unlimited" ? 0 : Math.round((b.aiUsed/(b.aiLimit as number))*100);
                const warn = b.aiLimit !== "unlimited" && aiPct >= 80;
                return (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        <div style={{ width:34,height:34,borderRadius:9,background:`${pc}14`,color:pc,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:11,fontWeight:700,flexShrink:0,border:`1.5px solid ${pc}22` }}>
                          {b.name.slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight:600,fontSize:13,color:"var(--text-primary)",lineHeight:1.3 }}>{b.name}</div>
                          <div style={{ fontSize:11,color:"var(--text-muted)",lineHeight:1.3 }}>{b.industry} · {b.country}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight:500,fontSize:13,color:"var(--text-primary)",lineHeight:1.3 }}>{b.owner}</div>
                      <div style={{ fontSize:11,color:"var(--text-muted)" }}>{b.email}</div>
                    </td>
                    <td>
                      <span style={{ fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:100,
                        background:`${pc}14`,color:pc,border:`1px solid ${pc}22` }}>{b.plan}</span>
                    </td>
                    <td>
                      <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",
                        borderRadius:100,fontSize:11,fontWeight:600,background:s.bg,color:s.color }}>
                        <span style={{ width:5,height:5,borderRadius:"50%",background:s.color }}/>
                        {b.status.charAt(0).toUpperCase()+b.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ fontWeight:500 }}>{b.users}</td>
                    <td>
                      {b.aiLimit === "unlimited"
                        ? <span style={{ fontSize:12,color:"var(--green)",fontWeight:600 }}>∞ Unlimited</span>
                        : <div style={{ minWidth:80 }}>
                            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                              <span style={{ fontSize:11,color:warn?"var(--red)":"var(--text-muted)",fontWeight:warn?600:400 }}>{aiPct}%</span>
                            </div>
                            <div style={{ height:5,borderRadius:100,background:"var(--bg-hover)",overflow:"hidden" }}>
                              <div style={{ height:"100%",borderRadius:100,
                                background:warn?"var(--red)":"var(--accent)",width:`${aiPct}%` }}/>
                            </div>
                          </div>
                      }
                    </td>
                    <td style={{ fontWeight:500 }}>{b.invoicesThisMonth}</td>
                    <td style={{ fontSize:12,color:"var(--text-muted)",whiteSpace:"nowrap" }}>{b.joinedAt}</td>
                    <td>
                      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                        <button style={{ fontSize:12,fontWeight:600,color:"var(--blue)",background:"none",border:"none",cursor:"pointer",padding:0 }}>
                          View
                        </button>
                        <span style={{ color:"var(--border)" }}>·</span>
                        <button onClick={()=>toggle(b.id)}
                          style={{ fontSize:12,fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0,
                            color:b.status==="suspended"?"var(--green)":"var(--red)" }}>
                          {b.status==="suspended"?"Activate":"Suspend"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"10px 16px",borderTop:"1.5px solid var(--border)",
          display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ fontSize:12,color:"var(--text-muted)" }}>Showing {filtered.length} of {biz.length} businesses</span>
          <div style={{ display:"flex",gap:4 }}>
            {[1,2,3].map(p=>(
              <button key={p} style={{ width:28,height:28,borderRadius:6,fontSize:12,fontWeight:p===1?700:400,
                border:`1.5px solid ${p===1?"var(--accent-border)":"var(--border)"}`,
                background:p===1?"var(--accent-dim)":"transparent",
                color:p===1?"var(--accent)":"var(--text-secondary)",cursor:"pointer" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
