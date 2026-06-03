"use client";
import React, { useState, useEffect } from "react";
import type { Plan, PlanTier, BillingCycle } from "@/modules/subscriptions/types";

interface Props { open:boolean; plan?:Plan|null; onClose:()=>void; onSave:(d:Partial<Plan>)=>void; }

const EMPTY = { name:"", tier:"pro" as PlanTier, monthlyPrice:0, annualPrice:0,
  description:"", trialDays:14, limits:{ users:10, aiCredits:50000, documents:"unlimited" as number|"unlimited", businesses:1, storage:"10 GB" } };

export default function PlanFormModal({ open, plan, onClose, onSave }: Props) {
  const [form, setForm] = useState(EMPTY);
  const set = (k:string,v:unknown) => setForm(f=>({...f,[k]:v}));
  const setLimit = (k:string,v:unknown) => setForm(f=>({...f,limits:{...f.limits,[k]:v}}));

  useEffect(() => {
    if (plan) setForm({ name:plan.name, tier:plan.tier, monthlyPrice:plan.monthlyPrice,
      annualPrice:plan.annualPrice, description:plan.description, trialDays:plan.trialDays,
      limits:{...plan.limits} as typeof EMPTY["limits"] });
    else setForm(EMPTY);
  }, [plan, open]);

  if (!open) return null;

  const labelSt: React.CSSProperties = {
    display:"block",fontSize:11,fontWeight:700,color:"var(--text-secondary)",
    marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em",
  };
  const TIER_COLORS: Record<PlanTier,string> = { starter:"#64748B",pro:"#3B82F6",enterprise:"var(--accent)",custom:"#8B5CF6" };

  return (
    <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(15,23,42,0.40)",backdropFilter:"blur(3px)",padding:16}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:560,background:"var(--bg-panel)",border:"1.5px solid var(--border)",
        borderRadius:"var(--radius-xl)",boxShadow:"var(--shadow-xl)",maxHeight:"92vh",
        display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"18px 22px",borderBottom:"1.5px solid var(--border)",flexShrink:0}}>
          <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:16,color:"var(--text-primary)"}}>
            {plan ? "Edit Plan" : "Create New Plan"}
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:8,border:"1.5px solid var(--border)",
            background:"var(--bg-raised)",cursor:"pointer",fontSize:14,color:"var(--text-muted)"}}>✕</button>
        </div>

        <div style={{padding:"20px 22px",overflowY:"auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={{gridColumn:"1/-1"}}>
            <label style={labelSt}>Plan Name *</label>
            <input value={form.name} onChange={e=>set("name",e.target.value)} className="input-base" placeholder="e.g. Professional"/>
          </div>
          <div>
            <label style={labelSt}>Tier</label>
            <div style={{display:"flex",gap:6}}>
              {(["starter","pro","enterprise"] as PlanTier[]).map(t=>(
                <button key={t} onClick={()=>set("tier",t)}
                  style={{flex:1,padding:"8px",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer",
                    border:`1.5px solid ${form.tier===t?`${TIER_COLORS[t]}44`:"var(--border)"}`,
                    background:form.tier===t?`${TIER_COLORS[t]}12`:"var(--bg-raised)",
                    color:form.tier===t?TIER_COLORS[t]:"var(--text-secondary)",
                    textTransform:"capitalize",transition:"all 0.12s"}}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelSt}>Trial Days</label>
            <input type="number" min={0} value={form.trialDays} onChange={e=>set("trialDays",Number(e.target.value))} className="input-base"/>
          </div>
          <div>
            <label style={labelSt}>Monthly Price ($)</label>
            <input type="number" min={0} value={form.monthlyPrice} onChange={e=>set("monthlyPrice",Number(e.target.value))} className="input-base"/>
          </div>
          <div>
            <label style={labelSt}>Annual Price ($/mo)</label>
            <input type="number" min={0} value={form.annualPrice} onChange={e=>set("annualPrice",Number(e.target.value))} className="input-base"/>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <label style={labelSt}>Description</label>
            <textarea value={form.description} onChange={e=>set("description",e.target.value)}
              className="input-base" style={{resize:"vertical",minHeight:60}} placeholder="Plan description…"/>
          </div>
          <div style={{gridColumn:"1/-1",borderTop:"1.5px solid var(--border)",paddingTop:14}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Usage Limits</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{label:"Max Users",key:"users"},{label:"AI Credits",key:"aiCredits"},
                {label:"Documents",key:"documents"},{label:"Storage",key:"storage"}].map(f=>(
                <div key={f.key}>
                  <label style={labelSt}>{f.label}</label>
                  <input value={(form.limits as Record<string,unknown>)[f.key] as string}
                    onChange={e=>setLimit(f.key, f.key==="storage"?e.target.value:
                      e.target.value==="unlimited"?"unlimited":Number(e.target.value))}
                    className="input-base" placeholder="e.g. 10 or unlimited"/>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"flex-end",gap:10,padding:"14px 22px",
          borderTop:"1.5px solid var(--border)",flexShrink:0}}>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={()=>{onSave(form);onClose();}} className="btn btn-primary">
            {plan?"Save Changes":"Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
