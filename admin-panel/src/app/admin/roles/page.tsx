"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

const ROLES = [
  {id:"r1",name:"Super Admin",slug:"super_admin",color:"var(--accent)",users:2,
    description:"Full platform access. Can manage all modules, users, billing and system settings.",
    permissions:["dashboard","users","businesses","subscriptions","invoicing","documents","compliance","ai","analytics","support","roles","notifications","settings"]},
  {id:"r2",name:"Admin",slug:"admin",color:"var(--blue)",users:5,
    description:"Broad access excluding sensitive system settings and role management.",
    permissions:["dashboard","users","businesses","subscriptions","invoicing","documents","compliance","ai","analytics","support","notifications"]},
  {id:"r3",name:"Support Agent",slug:"support_agent",color:"var(--cyan)",users:8,
    description:"Can view user profiles and manage support tickets. No billing or AI access.",
    permissions:["dashboard","users","businesses","support","notifications"]},
  {id:"r4",name:"Finance",slug:"finance",color:"var(--green)",users:3,
    description:"Access to subscriptions, billing history and revenue analytics only.",
    permissions:["dashboard","subscriptions","invoicing","analytics"]},
];
const MODULES = [
  "dashboard","users","businesses","subscriptions","invoicing","documents",
  "compliance","ai","analytics","support","roles","notifications","settings"
];

export default function RolesPage() {
  const [selected,setSelected] = useState(ROLES[0]);

  return (
    <div className="page-enter">
      <PageHeader title="Roles & Permissions" subtitle="Configure admin roles and control module-level access"
        action={<button className="btn btn-primary">+ New Role</button>}/>

      <div style={{ display:"grid",gridTemplateColumns:"280px 1fr",gap:16,alignItems:"start" }}>
        {/* Role list */}
        <div style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)",overflow:"hidden",boxShadow:"var(--shadow-sm)" }}>
          <div style={{ padding:"12px 16px",borderBottom:"1.5px solid var(--border)" }}>
            <span style={{ fontFamily:"var(--font-display)",fontWeight:700,fontSize:13,color:"var(--text-primary)" }}>Roles</span>
          </div>
          {ROLES.map(r=>(
            <div key={r.id} onClick={()=>setSelected(r)}
              style={{ padding:"12px 16px",borderBottom:"1px solid var(--border)",cursor:"pointer",
                background:selected.id===r.id?"var(--accent-dim)":"transparent",
                borderLeft:`3px solid ${selected.id===r.id?"var(--accent)":"transparent"}`,
                transition:"all 0.12s" }}
              onMouseEnter={e=>{if(selected.id!==r.id)e.currentTarget.style.background="var(--bg-hover)";}}
              onMouseLeave={e=>{if(selected.id!==r.id)e.currentTarget.style.background="transparent";}}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:r.color }}/>
                  <span style={{ fontWeight:700,fontSize:13,color:"var(--text-primary)" }}>{r.name}</span>
                </div>
                <span style={{ fontSize:10.5,fontWeight:600,padding:"2px 7px",borderRadius:100,
                  background:`${r.color}14`,color:r.color }}>{r.users} users</span>
              </div>
              <p style={{ fontSize:11.5,color:"var(--text-secondary)",margin:0,lineHeight:1.4,
                display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
                {r.description}
              </p>
            </div>
          ))}
        </div>

        {/* Permission matrix */}
        <div style={{ background:"var(--bg-surface)",border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden" }}>
          <div style={{ padding:"16px 20px",borderBottom:"1.5px solid var(--border)",
            display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:10,height:10,borderRadius:"50%",background:selected.color }}/>
              <div>
                <div style={{ fontFamily:"var(--font-display)",fontWeight:700,fontSize:15,color:"var(--text-primary)" }}>
                  {selected.name}
                </div>
                <div style={{ fontSize:11.5,color:"var(--text-muted)",marginTop:1 }}>{selected.description}</div>
              </div>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button className="btn btn-secondary btn-sm">Edit Role</button>
              {selected.slug!=="super_admin"&&<button className="btn btn-sm" style={{ background:"var(--red-dim)",color:"var(--red)",border:"1.5px solid rgba(239,68,68,0.2)" }}>Delete</button>}
            </div>
          </div>
          <div style={{ padding:"20px" }}>
            <div style={{ fontSize:12,fontWeight:600,color:"var(--text-secondary)",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.06em" }}>
              Module Permissions
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8 }}>
              {MODULES.map(mod=>{
                const has = selected.permissions.includes(mod);
                return (
                  <div key={mod} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"10px 14px",borderRadius:"var(--radius-md)",
                    background:has?"var(--green-dim)":"var(--bg-raised)",
                    border:`1.5px solid ${has?"rgba(16,185,129,0.25)":"var(--border)"}` }}>
                    <div>
                      <div style={{ fontSize:12.5,fontWeight:600,color:"var(--text-primary)",
                        textTransform:"capitalize" }}>{mod.replace(/_/g," ")}</div>
                      <div style={{ fontSize:10.5,color:"var(--text-muted)",marginTop:1 }}>
                        {has?"Full access":"No access"}
                      </div>
                    </div>
                    <div style={{ width:18,height:18,borderRadius:"50%",flexShrink:0,
                      background:has?"var(--green)":"var(--border)",
                      display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {has
                        ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        : <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Users with this role */}
          <div style={{ padding:"0 20px 20px" }}>
            <div style={{ fontSize:12,fontWeight:600,color:"var(--text-secondary)",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em" }}>
              {selected.users} Users with this role
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              {Array.from({length:selected.users},(_,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:7,padding:"6px 10px",
                  borderRadius:8,background:"var(--bg-raised)",border:"1.5px solid var(--border)" }}>
                  <div style={{ width:24,height:24,borderRadius:"50%",background:"var(--accent)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff" }}>
                    {["HA","FN","OK","SM","AB","PR","KM","RA"][i]??"AU"}
                  </div>
                  <span style={{ fontSize:12,fontWeight:500,color:"var(--text-secondary)" }}>
                    {["Hassan A.","Fatima N.","Omar K.","Sarah M.","Ahmed B.","Priya S.","Khalid M.","Reem A."][i]??"Admin User"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
