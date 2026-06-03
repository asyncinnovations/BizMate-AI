"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

const BUSINESSES = [
  {id:"b001",name:"Al-Rashid Group",   plan:"Enterprise",used:480000, limit:0,        pct:0,  model:"GPT-4o",status:"active"},
  {id:"b002",name:"Bright Futures LLC",plan:"Pro",        used:68000,  limit:100000,   pct:68, model:"GPT-4o-mini",status:"active"},
  {id:"b003",name:"Al Noor Trading",   plan:"Pro",        used:92000,  limit:100000,   pct:92, model:"GPT-4o-mini",status:"warning"},
  {id:"b004",name:"Salman Group",      plan:"Enterprise",used:720000, limit:0,        pct:0,  model:"GPT-4o",status:"active"},
  {id:"b005",name:"Innovate Hub",      plan:"Starter",   used:23500,  limit:25000,    pct:94, model:"GPT-4o-mini",status:"critical"},
  {id:"b006",name:"Al-Mansouri LLC",   plan:"Pro",        used:12000,  limit:100000,   pct:12, model:"GPT-4o-mini",status:"active"},
];
const LOGS = [
  {id:1,biz:"Al Noor Trading",   module:"AI Assistant",  tokens:1240,model:"GPT-4o-mini",cost:"$0.002",ts:"10:42:11",status:"ok"},
  {id:2,biz:"Salman Group",      module:"Smart Invoicing",tokens:540,model:"GPT-4o",     cost:"$0.008",ts:"10:41:58",status:"ok"},
  {id:3,biz:"Bright Futures LLC",module:"Auto Reply Hub", tokens:890,model:"GPT-4o-mini",cost:"$0.001",ts:"10:41:22",status:"ok"},
  {id:4,biz:"Innovate Hub",      module:"Advisory AI",   tokens:3200,model:"GPT-4o-mini",cost:"$0.005",ts:"10:40:55",status:"flagged"},
  {id:5,biz:"Al-Rashid Group",   module:"AI Assistant",  tokens:2100,model:"GPT-4o",     cost:"$0.031",ts:"10:40:33",status:"ok"},
];
const MODULES = [
  {name:"AI Assistant",      totalTokens:1200000,calls:14820,avgLatency:1.2,errorRate:0.3,color:"#8B5CF6"},
  {name:"Smart Invoicing",   totalTokens:480000, calls:8940, avgLatency:0.8,errorRate:0.1,color:"var(--accent)"},
  {name:"Auto Reply Hub",    totalTokens:620000, calls:22100,avgLatency:0.6,errorRate:0.4,color:"#06B6D4"},
  {name:"Advisory AI",       totalTokens:140000, calls:3200, avgLatency:2.1,errorRate:0.8,color:"#10B981"},
  {name:"Document Generator",totalTokens:95000,  calls:1840, avgLatency:3.2,errorRate:1.2,color:"#F59E0B"},
];

export default function AIControlPage() {
  const [globalLimit,setGlobalLimit] = useState(5000000);
  const [tab,setTab] = useState<"usage"|"logs"|"modules">("usage");
  const totalUsed = BUSINESSES.reduce((s,b)=>s+(b.used),0);

  return (
    <div className="page-enter">
      <PageHeader title="AI Control Panel" subtitle="Monitor usage, set limits and track AI behavior across the platform"/>

      {/* Global stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:20 }}>
        {[
          {label:"Total Tokens Used",  value:(totalUsed/1000000).toFixed(1)+"M", color:"#8B5CF6"},
          {label:"Total API Calls",    value:"51,900",                            color:"var(--blue)"},
          {label:"Platform Limit",     value:(globalLimit/1000000).toFixed(0)+"M",color:"var(--amber)"},
          {label:"Avg Cost / 1k Token",value:"$0.0014",                          color:"var(--green)"},
          {label:"Flagged Prompts",    value:"14",                                color:"var(--red)"},
          {label:"Businesses at Risk", value:BUSINESSES.filter(b=>b.status!=="active").length.toString(), color:"var(--red)"},
        ].map(s=>(
          <div key={s.label} style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
            borderRadius:"var(--radius-lg)",padding:"14px 16px",boxShadow:"var(--shadow-sm)",
            position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,
              background:`linear-gradient(90deg,${s.color}55,${s.color}cc,${s.color}33)` }}/>
            <div style={{ fontSize:11,color:"var(--text-muted)",marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:22,fontWeight:800,color:s.color,
              fontFamily:"var(--font-display)",letterSpacing:"-0.02em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Global limit control */}
      <div style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",borderRadius:"var(--radius-lg)",
        padding:"16px 20px",marginBottom:20,boxShadow:"var(--shadow-sm)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
          <div>
            <div style={{ fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,color:"var(--text-primary)",marginBottom:2 }}>
              Global Token Limit
            </div>
            <div style={{ fontSize:12,color:"var(--text-muted)" }}>Monthly cap across all businesses combined</div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:12,color:"var(--text-secondary)",whiteSpace:"nowrap" }}>Current limit:</span>
              <input type="number" value={globalLimit} onChange={e=>setGlobalLimit(Number(e.target.value))}
                className="input-base" style={{ width:130,height:34,fontSize:13,fontWeight:600 }}/>
              <span style={{ fontSize:12,color:"var(--text-muted)" }}>tokens</span>
            </div>
            <button className="btn btn-primary btn-sm">Update Limit</button>
          </div>
        </div>
        <div style={{ marginTop:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <span style={{ fontSize:11.5,color:"var(--text-secondary)" }}>
              {(totalUsed/1000000).toFixed(1)}M of {(globalLimit/1000000).toFixed(0)}M tokens used
            </span>
            <span style={{ fontSize:11.5,fontWeight:600,color:"var(--text-primary)" }}>
              {Math.round((totalUsed/globalLimit)*100)}%
            </span>
          </div>
          <div style={{ height:8,borderRadius:100,background:"var(--bg-hover)",overflow:"hidden" }}>
            <div style={{ height:"100%",borderRadius:100,width:`${Math.min((totalUsed/globalLimit)*100,100)}%`,
              background:"linear-gradient(90deg,var(--green),var(--amber))",transition:"width 0.6s ease" }}/>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",gap:2,background:"var(--bg-raised)",borderRadius:10,padding:4,
        width:"fit-content",marginBottom:16,border:"1.5px solid var(--border)" }}>
        {[{k:"usage",l:"Business Usage"},{k:"logs",l:"Prompt Logs"},{k:"modules",l:"Module Stats"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as typeof tab)}
            style={{ padding:"7px 16px",borderRadius:7,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",
              background:tab===t.k?"var(--bg-surface)":"transparent",
              color:tab===t.k?"var(--text-primary)":"var(--text-muted)",
              boxShadow:tab===t.k?"var(--shadow-xs)":"none",transition:"all 0.15s" }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Business Usage */}
      {tab==="usage"&&(
        <div style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden" }}>
          <table className="data-table">
            <thead><tr><th>Business</th><th>Plan</th><th>Model</th><th>Usage</th><th>Tokens Used</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {BUSINESSES.map(b=>{
                const isUnlimited = b.limit === 0;
                const pct = isUnlimited ? Math.round((b.used/2000000)*100) : b.pct;
                const stColor = b.status==="critical"?"var(--red)":b.status==="warning"?"var(--amber)":"var(--green)";
                return (
                  <tr key={b.id}>
                    <td style={{ fontWeight:600,color:"var(--text-primary)" }}>{b.name}</td>
                    <td><span style={{ fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:100,
                      background:b.plan==="Enterprise"?"var(--accent-dim)":"var(--blue-dim)",
                      color:b.plan==="Enterprise"?"var(--accent)":"var(--blue)",
                      border:`1px solid ${b.plan==="Enterprise"?"var(--accent-border)":"rgba(59,130,246,0.2)"}`}}>{b.plan}</span></td>
                    <td><span style={{ fontSize:11.5,color:"var(--text-secondary)",fontFamily:"monospace" }}>{b.model}</span></td>
                    <td style={{ minWidth:140 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                        <span style={{ fontSize:11,color:"var(--text-muted)" }}>{pct}%</span>
                        {isUnlimited&&<span style={{ fontSize:10,color:"var(--green)",fontWeight:600 }}>Unlimited</span>}
                      </div>
                      <div style={{ height:6,borderRadius:100,background:"var(--bg-hover)",overflow:"hidden" }}>
                        <div style={{ height:"100%",borderRadius:100,width:`${Math.min(pct,100)}%`,
                          background:pct>=90?"var(--red)":pct>=70?"var(--amber)":"var(--green)" }}/>
                      </div>
                    </td>
                    <td style={{ fontFamily:"monospace",fontSize:12,color:"var(--text-primary)" }}>
                      {(b.used/1000).toFixed(0)}k{!isUnlimited&&` / ${(b.limit/1000).toFixed(0)}k`}
                    </td>
                    <td>
                      <span style={{ display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,
                        padding:"3px 8px",borderRadius:100,textTransform:"capitalize",
                        background:`${stColor}14`,color:stColor }}>
                        <span style={{ width:5,height:5,borderRadius:"50%",background:stColor }}/>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex",gap:8 }}>
                        <button className="btn btn-secondary btn-sm">Set Limit</button>
                        <button className="btn btn-sm" style={{ background:"var(--red-dim)",color:"var(--red)",border:"1.5px solid rgba(239,68,68,0.2)" }}>Reset</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Prompt Logs */}
      {tab==="logs"&&(
        <div style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden" }}>
          <div style={{ padding:"12px 16px",borderBottom:"1.5px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ width:7,height:7,borderRadius:"50%",background:"var(--green)",
                boxShadow:"0 0 0 3px rgba(16,185,129,0.2)" }}/>
              <span style={{ fontSize:12.5,fontWeight:600,color:"var(--text-primary)" }}>Live Prompt Log</span>
            </div>
            <span style={{ fontSize:11,color:"var(--text-muted)" }}>Last 24 hours · auto-refreshing</span>
          </div>
          <table className="data-table">
            <thead><tr><th>Time</th><th>Business</th><th>Module</th><th>Model</th><th>Tokens</th><th>Cost</th><th>Status</th></tr></thead>
            <tbody>
              {LOGS.map(l=>(
                <tr key={l.id}>
                  <td style={{ fontFamily:"monospace",fontSize:11.5,color:"var(--text-muted)",whiteSpace:"nowrap" }}>{l.ts}</td>
                  <td style={{ fontWeight:500,color:"var(--text-primary)" }}>{l.biz}</td>
                  <td style={{ fontSize:12,color:"var(--text-secondary)" }}>{l.module}</td>
                  <td><span style={{ fontFamily:"monospace",fontSize:11.5,color:"var(--text-secondary)" }}>{l.model}</span></td>
                  <td style={{ fontFamily:"monospace",fontSize:12,fontWeight:600,color:"var(--text-primary)" }}>{l.tokens.toLocaleString()}</td>
                  <td style={{ fontFamily:"monospace",fontSize:12,color:"var(--green)" }}>{l.cost}</td>
                  <td>
                    {l.status==="flagged"
                      ? <span style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:100,
                          background:"var(--red-dim)",color:"var(--red)" }}>⚑ Flagged</span>
                      : <span style={{ fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:100,
                          background:"var(--green-dim)",color:"var(--green)" }}>✓ OK</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Module Stats */}
      {tab==="modules"&&(
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14 }}>
          {MODULES.map(m=>(
            <div key={m.name} style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
              borderRadius:"var(--radius-lg)",padding:"16px",boxShadow:"var(--shadow-sm)",
              position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:m.color }}/>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:m.color }}/>
                <span style={{ fontWeight:700,fontSize:13,color:"var(--text-primary)" }}>{m.name}</span>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {[
                  {label:"Tokens",    value:(m.totalTokens/1000).toFixed(0)+"k"},
                  {label:"API Calls", value:m.calls.toLocaleString()},
                  {label:"Avg Latency",value:m.avgLatency+"s"},
                  {label:"Error Rate", value:m.errorRate+"%"},
                ].map(s=>(
                  <div key={s.label} style={{ background:"var(--bg-raised)",borderRadius:8,padding:"8px 10px",border:"1px solid var(--border)" }}>
                    <div style={{ fontSize:10,color:"var(--text-muted)",marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:16,fontWeight:700,color:"var(--text-primary)",fontFamily:"var(--font-display)" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
