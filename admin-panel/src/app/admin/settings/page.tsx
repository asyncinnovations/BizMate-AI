"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

const TOGGLES = [
  {key:"smart_invoicing",    label:"Smart Invoicing",       desc:"AI-powered invoice generation for all businesses",         on:true},
  {key:"document_generator", label:"Document Generator",    desc:"Template-based document creation module",                  on:true},
  {key:"auto_reply_hub",     label:"Auto Reply Hub",        desc:"WhatsApp & email automated response system",               on:true},
  {key:"advisory_ai",        label:"Advisory AI",           desc:"Business advisory chatbot powered by GPT-4o",              on:true},
  {key:"compliance_module",  label:"Compliance Module",     desc:"UAE compliance rules and licensing tracker",               on:true},
  {key:"payroll_module",     label:"Payroll Module",        desc:"Payroll management and WPS compliance tools",              on:false},
  {key:"ai_tuning",          label:"AI Fine-tuning",        desc:"Custom prompt tuning per business (Phase 3)",              on:false},
  {key:"maintenance_mode",   label:"Maintenance Mode",      desc:"Puts the platform in read-only maintenance mode",          on:false},
  {key:"new_registrations",  label:"New Registrations",     desc:"Allow new businesses to register on the platform",         on:true},
  {key:"trial_mode",         label:"Free Trial",            desc:"Enable trial period for new subscriptions",                on:true},
];

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return (
    <div onClick={()=>onChange(!on)}
      style={{width:38,height:21,borderRadius:100,cursor:"pointer",flexShrink:0,
        background:on?"var(--green)":"var(--border)",position:"relative",
        transition:"background 0.2s",border:`1.5px solid ${on?"var(--green)":"var(--border-mid)"}`}}>
      <div style={{position:"absolute",top:1.5,width:14,height:14,borderRadius:"50%",background:"#fff",
        left:on?"calc(100% - 16.5px)":"2px",transition:"left 0.2s",
        boxShadow:"0 1px 4px rgba(0,0,0,0.18)"}}/>
    </div>
  );
}

export default function SettingsPage() {
  const [toggles,setToggles] = useState(
    TOGGLES.reduce((acc,t)=>({...acc,[t.key]:t.on}),{} as Record<string,boolean>)
  );
  const [tab,setTab] = useState<"general"|"features"|"integrations"|"security">("general");

  const [general,setGeneral] = useState({
    platformName:"BizMate AI",
    supportEmail:"support@bizmate.io",
    timezone:"Asia/Dubai (UTC+4)",
    defaultCurrency:"AED",
    defaultLanguage:"English",
    sessionTimeout:"8",
    maxFileSize:"25",
  });

  return (
    <div className="page-enter">
      <PageHeader title="System Settings" subtitle="Global platform configuration, feature toggles and integrations"
        action={<button className="btn btn-primary">Save Changes</button>}/>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,background:"var(--bg-raised)",borderRadius:10,padding:4,
        width:"fit-content",marginBottom:20,border:"1.5px solid var(--border)"}}>
        {[{k:"general",l:"General"},{k:"features",l:"Feature Toggles"},{k:"integrations",l:"Integrations"},{k:"security",l:"Security"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as typeof tab)}
            style={{padding:"7px 16px",borderRadius:7,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",
              background:tab===t.k?"var(--bg-surface)":"transparent",
              color:tab===t.k?"var(--text-primary)":"var(--text-muted)",
              boxShadow:tab===t.k?"var(--shadow-xs)":"none",transition:"all 0.15s"}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* GENERAL */}
      {tab==="general"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:800}}>
          {[
            {label:"Platform Name",      key:"platformName",      type:"text"},
            {label:"Support Email",      key:"supportEmail",      type:"email"},
            {label:"Default Timezone",   key:"timezone",          type:"text"},
            {label:"Default Currency",   key:"defaultCurrency",   type:"text"},
            {label:"Default Language",   key:"defaultLanguage",   type:"text"},
            {label:"Session Timeout (h)",key:"sessionTimeout",    type:"number"},
            {label:"Max File Size (MB)", key:"maxFileSize",       type:"number"},
          ].map(f=>(
            <div key={f.key}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"var(--text-secondary)",
                marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.label}</label>
              <input type={f.type} value={(general as Record<string,string>)[f.key]}
                onChange={e=>setGeneral(g=>({...g,[f.key]:e.target.value}))}
                className="input-base"/>
            </div>
          ))}

          <div style={{gridColumn:"1/-1",paddingTop:16,borderTop:"1.5px solid var(--border)"}}>
            <div style={{padding:"14px 16px",borderRadius:"var(--radius-md)",
              background:"var(--amber-dim)",border:"1.5px solid rgba(245,158,11,0.25)"}}>
              <div style={{fontWeight:700,fontSize:13,color:"var(--amber)",marginBottom:3}}>⚠ Danger Zone</div>
              <div style={{fontSize:12.5,color:"var(--text-secondary)",marginBottom:10}}>
                These actions are irreversible. Proceed with extreme caution.
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button className="btn btn-sm" style={{background:"var(--red-dim)",color:"var(--red)",border:"1.5px solid rgba(239,68,68,0.2)"}}>
                  Clear All Sessions
                </button>
                <button className="btn btn-sm" style={{background:"var(--red-dim)",color:"var(--red)",border:"1.5px solid rgba(239,68,68,0.2)"}}>
                  Reset Platform Cache
                </button>
                <button className="btn btn-sm" style={{background:"var(--red-dim)",color:"var(--red)",border:"1.5px solid rgba(239,68,68,0.2)"}}>
                  Export All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURES */}
      {tab==="features"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:10}}>
          {TOGGLES.map(t=>(
            <div key={t.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              gap:12,padding:"14px 16px",background:"var(--bg-surface)",
              border:"1.5px solid var(--border)",borderRadius:"var(--radius-md)",
              boxShadow:"var(--shadow-xs)",transition:"border-color 0.15s"}}
              style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                gap:12,padding:"14px 16px",background:"var(--bg-surface)",
                border:`1.5px solid ${toggles[t.key]?"rgba(16,185,129,0.25)":"var(--border)"}`,
                borderRadius:"var(--radius-md)",boxShadow:"var(--shadow-xs)"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:13,color:"var(--text-primary)",marginBottom:2}}>{t.label}</div>
                <div style={{fontSize:11.5,color:"var(--text-secondary)"}}>{t.desc}</div>
              </div>
              <Toggle on={toggles[t.key]} onChange={v=>setToggles(ts=>({...ts,[t.key]:v}))}/>
            </div>
          ))}
        </div>
      )}

      {/* INTEGRATIONS */}
      {tab==="integrations"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
          {[
            {name:"OpenAI",        key:"openai",    status:"connected",  desc:"GPT-4o and GPT-4o-mini for AI features", color:"#10A37F"},
            {name:"Stripe",        key:"stripe",    status:"connected",  desc:"Payment processing and subscription billing", color:"#635BFF"},
            {name:"Twilio",        key:"twilio",    status:"connected",  desc:"WhatsApp & SMS for Auto Reply Hub", color:"#F22F46"},
            {name:"SendGrid",      key:"sendgrid",  status:"connected",  desc:"Transactional email delivery", color:"#1A82E2"},
            {name:"AWS S3",        key:"s3",        status:"connected",  desc:"File storage for documents and exports", color:"#FF9900"},
            {name:"Google OAuth",  key:"google",    status:"connected",  desc:"Social login for users", color:"#4285F4"},
            {name:"Xero",          key:"xero",      status:"pending",    desc:"Accounting software integration (Phase 2)", color:"#13B5EA"},
            {name:"Zapier",        key:"zapier",    status:"disconnected",desc:"Workflow automation connector", color:"#FF4A00"},
          ].map(i=>(
            <div key={i.key} style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
              borderRadius:"var(--radius-lg)",padding:"16px",boxShadow:"var(--shadow-sm)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:9,background:`${i.color}14`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:11,fontWeight:800,color:i.color,border:`1.5px solid ${i.color}25`}}>
                    {i.name.slice(0,2)}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:"var(--text-primary)"}}>{i.name}</div>
                    <span style={{fontSize:10.5,fontWeight:600,padding:"1px 6px",borderRadius:100,
                      background:i.status==="connected"?"var(--green-dim)":i.status==="pending"?"var(--amber-dim)":"var(--red-dim)",
                      color:i.status==="connected"?"var(--green)":i.status==="pending"?"var(--amber)":"var(--red)"}}>
                      {i.status.charAt(0).toUpperCase()+i.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{fontSize:12,color:"var(--text-secondary)",margin:"0 0 12px",lineHeight:1.5}}>{i.desc}</p>
              <button className={`btn btn-sm ${i.status==="connected"?"btn-secondary":"btn-primary"}`} style={{width:"100%"}}>
                {i.status==="connected"?"Configure":"Connect"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SECURITY */}
      {tab==="security"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,maxWidth:800}}>
          {[
            {title:"Two-Factor Authentication", desc:"Require 2FA for all admin logins", enabled:true, color:"var(--green)"},
            {title:"IP Whitelist", desc:"Restrict admin access to specific IP ranges", enabled:false, color:"var(--blue)"},
            {title:"Audit Logging", desc:"Log all admin actions with timestamps", enabled:true, color:"var(--green)"},
            {title:"Session Recording", desc:"Record admin session activity for review", enabled:false, color:"var(--blue)"},
            {title:"Auto-logout Idle", desc:"Terminate sessions after 8h of inactivity", enabled:true, color:"var(--amber)"},
            {title:"Rate Limiting", desc:"API rate limiting to prevent abuse", enabled:true, color:"var(--green)"},
          ].map(s=>(
            <div key={s.title} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              gap:12,padding:"14px 16px",background:"var(--bg-surface)",
              border:`1.5px solid ${s.enabled?"rgba(16,185,129,0.25)":"var(--border)"}`,
              borderRadius:"var(--radius-md)",boxShadow:"var(--shadow-xs)"}}>
              <div>
                <div style={{fontWeight:600,fontSize:13,color:"var(--text-primary)",marginBottom:2}}>{s.title}</div>
                <div style={{fontSize:11.5,color:"var(--text-secondary)"}}>{s.desc}</div>
              </div>
              <Toggle on={s.enabled} onChange={()=>{}}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
