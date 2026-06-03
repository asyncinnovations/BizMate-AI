"use client";
import React, { useState } from "react";
import type { Plan } from "@/modules/subscriptions/types";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";
import PlanFormModal from "./PlanFormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

const TIER_COLORS: Record<string, string> = {
  starter:"#64748B", pro:"#3B82F6", enterprise:"var(--accent)", custom:"#8B5CF6",
};

interface PlansTableProps { plans: Plan[]; }

export default function PlansTable({ plans: initialPlans }: PlansTableProps) {
  const [plans, setPlans] = useState(initialPlans);
  const [editTarget, setEditTarget] = useState<Plan|null|undefined>(undefined);
  const [archiveTarget, setArchiveTarget] = useState<Plan|null>(null);

  function handleSave(data: Partial<Plan>) {
    if (editTarget) {
      setPlans(ps => ps.map(p => p.id === editTarget.id ? { ...p, ...data } : p));
    } else {
      const newPlan: Plan = {
        id: `plan_${Date.now()}`, name: data.name ?? "New Plan",
        tier: data.tier ?? "pro", status: "active",
        monthlyPrice: data.monthlyPrice ?? 0, annualPrice: data.annualPrice ?? 0,
        currency: "USD", description: data.description ?? "",
        features: [], limits: data.limits ?? { users:10, aiCredits:50000, documents:100, businesses:1, storage:"10 GB" },
        subscriberCount: 0, mrr: 0, trialDays: data.trialDays ?? 14,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      setPlans(ps => [...ps, newPlan]);
    }
    setEditTarget(undefined);
  }

  function handleArchive() {
    if (!archiveTarget) return;
    setPlans(ps => ps.map(p => p.id === archiveTarget.id ? { ...p, status: "archived" } : p));
    setArchiveTarget(null);
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="btn btn-primary" onClick={() => setEditTarget(null)}>+ New Plan</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {plans.map(plan => {
          const tc = TIER_COLORS[plan.tier] ?? "#94A3B8";
          return (
            <div key={plan.id} style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
              borderRadius:"var(--radius-lg)",overflow:"hidden",boxShadow:"var(--shadow-sm)",
              transition:"box-shadow 0.2s,border-color 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="var(--shadow-md)";e.currentTarget.style.borderColor="var(--border-mid)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="var(--shadow-sm)";e.currentTarget.style.borderColor="var(--border)";}}>
              <div style={{height:4,background:`linear-gradient(90deg,${tc}66,${tc})`}}/>
              <div style={{padding:"16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                      <span style={{fontFamily:"var(--font-display)",fontWeight:800,fontSize:16,color:"var(--text-primary)"}}>{plan.name}</span>
                      {plan.isPopular && <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:100,
                        background:"var(--accent-dim)",color:"var(--accent)",border:"1.5px solid var(--accent-border)"}}>Popular</span>}
                    </div>
                    <SubscriptionStatusBadge status={plan.status}/>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:22,fontWeight:800,color:tc,fontFamily:"var(--font-display)",letterSpacing:"-0.025em"}}>${plan.monthlyPrice}</div>
                    <div style={{fontSize:11,color:"var(--text-muted)"}}>/month</div>
                  </div>
                </div>

                <p style={{fontSize:12.5,color:"var(--text-secondary)",lineHeight:1.5,marginBottom:14}}>{plan.description}</p>

                <div style={{marginBottom:14}}>
                  {plan.features.slice(0,5).map(f => (
                    <div key={f.label} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                      <div style={{width:14,height:14,borderRadius:"50%",flexShrink:0,
                        background:f.included?"var(--green-dim)":"var(--bg-hover)",
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {f.included
                          ? <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="var(--green)" strokeWidth="1.4" strokeLinecap="round"/></svg>
                          : <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round"/></svg>
                        }
                      </div>
                      <span style={{fontSize:12,color:f.included?"var(--text-secondary)":"var(--text-muted)"}}>{f.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{paddingTop:12,borderTop:"1.5px solid var(--border)",marginBottom:12}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[
                      {label:"Subscribers", value:plan.subscriberCount.toLocaleString()},
                      {label:"MRR",         value:`$${(plan.mrr/1000).toFixed(0)}k`},
                      {label:"Annual Price",value:`$${plan.annualPrice}/mo`},
                      {label:"Trial",       value:`${plan.trialDays} days`},
                    ].map(s=>(
                      <div key={s.label} style={{background:"var(--bg-raised)",borderRadius:7,padding:"6px 9px",border:"1px solid var(--border)"}}>
                        <div style={{fontSize:9.5,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</div>
                        <div style={{fontSize:12.5,fontWeight:700,color:"var(--text-primary)",fontFamily:"var(--font-display)"}}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-secondary btn-sm" style={{flex:1}} onClick={() => setEditTarget(plan)}>Edit Plan</button>
                  {plan.status !== "archived" && (
                    <button className="btn btn-sm" style={{background:"var(--red-dim)",color:"var(--red)",border:"1.5px solid rgba(239,68,68,0.2)"}}
                      onClick={() => setArchiveTarget(plan)}>Archive</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editTarget !== undefined && (
        <PlanFormModal open plan={editTarget} onClose={() => setEditTarget(undefined)} onSave={handleSave}/>
      )}
      <ConfirmModal
        open={!!archiveTarget} title="Archive Plan" variant="danger"
        message={`Archive "${archiveTarget?.name}"? Existing subscribers won't be affected but new sign-ups will be blocked.`}
        confirmLabel="Archive Plan" onConfirm={handleArchive} onCancel={() => setArchiveTarget(null)}/>
    </div>
  );
}
