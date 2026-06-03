"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import StatCards from "@/components/ui/StatCards";

const GROWTH = [
  {month:"Oct",users:9800, new:820, churned:210},
  {month:"Nov",users:10400,new:940, churned:340},
  {month:"Dec",users:10980,new:780, churned:200},
  {month:"Jan",users:11720,new:1100,churned:360},
  {month:"Feb",users:12380,new:860, churned:200},
  {month:"Mar",users:13310,new:1140,churned:210},
  {month:"Apr",users:14280,new:1190,churned:220},
];
const FEATURES = [
  {name:"Smart Invoicing",   pct:88,color:"var(--accent)"},
  {name:"AI Assistant",      pct:74,color:"#8B5CF6"},
  {name:"Document Generator",pct:61,color:"#06B6D4"},
  {name:"Auto Reply Hub",    pct:45,color:"#10B981"},
  {name:"Compliance",        pct:38,color:"#F59E0B"},
  {name:"Advisory AI",       pct:29,color:"#3B82F6"},
  {name:"Payroll",           pct:21,color:"#EF4444"},
];
const PLANS = [
  {name:"Enterprise",count:320,pct:17,color:"var(--accent)"},
  {name:"Pro",       count:840,pct:46,color:"#3B82F6"},
  {name:"Starter",   count:680,pct:37,color:"#10B981"},
];

function BarChart() {
  const [hov,setHov]=useState<number|null>(null);
  const max = Math.max(...GROWTH.map(d=>d.users));
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:8,height:160,padding:"0 4px"}}>
      {GROWTH.map((d,i)=>{
        const totalH = (d.users/max)*140;
        const newH   = (d.new/max)*140;
        const active = hov===i;
        return (
          <div key={d.month} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            <div style={{width:"100%",position:"relative",height:totalH,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
              {/* Base bar */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:"100%",
                borderRadius:"5px 5px 0 0",background:"var(--bg-hover)",transition:"opacity 0.15s"}}/>
              {/* New bar */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:newH,
                borderRadius:"5px 5px 0 0",background:active?"var(--accent-mid)":"var(--accent)",
                transition:"background 0.15s",boxShadow:active?"0 -2px 8px rgba(232,105,10,0.3)":"none"}}/>
              {/* Tooltip */}
              {active&&(
                <div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%) translateY(-6px)",
                  background:"var(--bg-panel)",border:"1.5px solid var(--border)",borderRadius:8,
                  padding:"6px 10px",whiteSpace:"nowrap",boxShadow:"var(--shadow-md)",zIndex:10}}>
                  <div style={{fontSize:10,color:"var(--text-muted)",fontWeight:500}}>{d.month}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>{d.users.toLocaleString()}</div>
                  <div style={{fontSize:10.5,color:"var(--green)"}}>+{d.new} new</div>
                </div>
              )}
            </div>
            <span style={{fontSize:10,color:"var(--text-muted)",fontWeight:500}}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart() {
  const total = PLANS.reduce((s,p)=>s+p.count,0);
  let offset = 0;
  const R = 44, C = 2*Math.PI*R;
  return (
    <div style={{position:"relative",width:120,height:120,flexShrink:0}}>
      <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",transform:"rotate(-90deg)"}}>
        {PLANS.map((p)=>{
          const dash = (p.pct/100)*C;
          const gap  = C - dash;
          const el = (
            <circle key={p.name} cx="50" cy="50" r={R} fill="none"
              stroke={p.color} strokeWidth="20"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}/>
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center"}}>
        <div style={{fontSize:18,fontWeight:800,color:"var(--text-primary)",fontFamily:"var(--font-display)",lineHeight:1}}>1,840</div>
        <div style={{fontSize:9.5,color:"var(--text-muted)"}}>businesses</div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range,setRange]=useState("30d");

  const TrendIcon = ()=><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M2 14l4-6 3 4 4-8 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const UserIcon  = ()=><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 18c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  const ChurnIcon = ()=><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M4 16L16 4M4 4l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  const BizIcon   = ()=><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M3 18V8l7-5 7 5v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;

  return (
    <div className="page-enter">
      <PageHeader title="Platform Analytics" subtitle="Growth, usage patterns and feature adoption"
        action={
          <div style={{display:"flex",borderRadius:8,border:"1.5px solid var(--border)",overflow:"hidden"}}>
            {["7d","30d","90d"].map(r=>(
              <button key={r} onClick={()=>setRange(r)}
                style={{padding:"6px 12px",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",
                  background:range===r?"var(--accent)":"var(--bg-surface)",
                  color:range===r?"#fff":"var(--text-secondary)",transition:"all 0.12s"}}>
                {r}
              </button>
            ))}
          </div>
        }/>

      <StatCards items={[
        {label:"Total Users",      value:"14,280",color:"var(--blue)",  icon:<UserIcon/>,  trend:8.3, sparkData:[98,104,109,117,123,133,142]},
        {label:"New This Month",   value:"1,190", color:"var(--green)", icon:<TrendIcon/>, trend:4.4, sparkData:[82,94,78,110,86,114,119]},
        {label:"Churn This Month", value:"220",   color:"var(--red)",   icon:<ChurnIcon/>, trend:-4.3,sparkData:[21,34,20,36,20,21,22]},
        {label:"Active Businesses",value:"1,840", color:"var(--accent)",icon:<BizIcon/>,  trend:12.1,sparkData:[120,138,130,155,148,172,184]},
      ]}/>

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16,marginBottom:16}}>
        {/* Growth chart */}
        <div style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)",padding:"20px",boxShadow:"var(--shadow-sm)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
            <div>
              <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,color:"var(--text-primary)"}}>User Growth</div>
              <div style={{fontSize:12,color:"var(--text-muted)",marginTop:2}}>Monthly new vs total users</div>
            </div>
            <div style={{display:"flex",gap:16}}>
              {[{l:"Total",c:"var(--bg-hover)"},{l:"New",c:"var(--accent)"}].map(l=>(
                <span key={l.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11.5,color:"var(--text-secondary)"}}>
                  <span style={{width:10,height:10,borderRadius:3,background:l.c}}/>
                  {l.l}
                </span>
              ))}
            </div>
          </div>
          <BarChart/>
          {/* Monthly new counts */}
          <div style={{display:"grid",gridTemplateColumns:`repeat(${GROWTH.length},1fr)`,gap:4,marginTop:12}}>
            {GROWTH.map(d=>(
              <div key={d.month} style={{textAlign:"center",padding:"6px 4px",borderRadius:6,
                background:"var(--bg-raised)",border:"1px solid var(--border)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--green)"}}>+{d.new}</div>
                <div style={{fontSize:9.5,color:"var(--text-muted)"}}>new</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan distribution */}
        <div style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)",padding:"20px",boxShadow:"var(--shadow-sm)"}}>
          <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,
            color:"var(--text-primary)",marginBottom:20}}>Plan Distribution</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
            <DonutChart/>
          </div>
          {PLANS.map(p=>(
            <div key={p.name} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:p.color}}/>
                  <span style={{fontSize:12.5,fontWeight:500,color:"var(--text-secondary)"}}>{p.name}</span>
                </div>
                <div style={{fontSize:12,color:"var(--text-primary)",fontWeight:600}}>
                  {p.count} <span style={{color:"var(--text-muted)",fontWeight:400}}>({p.pct}%)</span>
                </div>
              </div>
              <div style={{height:6,borderRadius:100,background:"var(--bg-hover)",overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:100,background:p.color,width:`${p.pct}%`,transition:"width 0.8s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature adoption */}
      <div style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
        borderRadius:"var(--radius-lg)",padding:"20px",boxShadow:"var(--shadow-sm)"}}>
        <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,color:"var(--text-primary)",marginBottom:16}}>
          Feature Adoption
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"12px 24px"}}>
          {FEATURES.map(f=>(
            <div key={f.name}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:12.5,fontWeight:500,color:"var(--text-secondary)"}}>{f.name}</span>
                <span style={{fontSize:12.5,fontWeight:700,color:"var(--text-primary)"}}>{f.pct}%</span>
              </div>
              <div style={{height:7,borderRadius:100,background:"var(--bg-hover)",overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:100,background:f.color,width:`${f.pct}%`,transition:"width 0.8s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
