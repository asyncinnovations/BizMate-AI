"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { window.location.href = "/admin"; }, 1200);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"var(--bg-canvas)", fontFamily:"var(--font-body)" }}>
      {/* Left brand panel */}
      <div style={{ width:"42%", background:"var(--accent)", display:"flex", flexDirection:"column",
        justifyContent:"space-between", padding:48, position:"relative", overflow:"hidden" }}
        className="hidden-sm">
        <div style={{ position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle at 20% 80%,rgba(255,255,255,0.08) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(255,255,255,0.06) 0%,transparent 40%)" }}/>
        <div style={{ position:"absolute", bottom:-80, right:-80, width:300, height:300, borderRadius:"50%",
          background:"rgba(255,255,255,0.06)" }}/>

        <div style={{ position:"relative", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,255,255,0.22)",
            display:"flex", alignItems:"center", justifyContent:"center",
            backdropFilter:"blur(10px)", border:"1.5px solid rgba(255,255,255,0.3)" }}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.8" fill="white" opacity="0.95"/>
              <rect x="10" y="2" width="6" height="6" rx="1.8" fill="white" opacity="0.55"/>
              <rect x="2" y="10" width="6" height="6" rx="1.8" fill="white" opacity="0.55"/>
              <rect x="10" y="10" width="6" height="6" rx="1.8" fill="white" opacity="0.95"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:18, color:"#fff", letterSpacing:"-0.02em" }}>BizMate AI</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>Admin Panel</div>
          </div>
        </div>

        <div style={{ position:"relative" }}>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:800, color:"#fff",
            lineHeight:1.25, letterSpacing:"-0.02em", marginBottom:16 }}>
            Your platform.<br/>Your control.
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", lineHeight:1.65, marginBottom:32 }}>
            Manage users, monitor AI usage, control subscriptions and configure the entire BizMate platform from one place.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {[{label:"Businesses",value:"1,840+"},{label:"Users",value:"14k+"},{label:"AI Tokens/mo",value:"2.7M"}].map(s=>(
              <div key={s.label} style={{ borderRadius:12, padding:14, background:"rgba(255,255,255,0.12)",
                backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.2)" }}>
                <div style={{ fontSize:20, fontWeight:800, color:"#fff", fontFamily:"var(--font-display)", letterSpacing:"-0.02em" }}>{s.value}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:"relative" }}>
          <p style={{ fontSize:11.5, color:"rgba(255,255,255,0.45)" }}>© {new Date().getFullYear()} Async Innovations · BizMate AI</p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:32 }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:800, color:"var(--text-primary)",
              letterSpacing:"-0.02em", marginBottom:6 }}>Sign in to Admin</h2>
            <p style={{ fontSize:13, color:"var(--text-secondary)" }}>Access the BizMate AI admin panel</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"var(--text-secondary)",
                marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                className="input-base" placeholder="admin@bizmate.io" required
                style={{ height:42 }}/>
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"var(--text-secondary)",
                marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                className="input-base" placeholder="••••••••" required
                style={{ height:42 }}/>
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ height:44, fontSize:14, fontWeight:700, marginTop:4, justifyContent:"center" }}
              disabled={loading}>
              {loading ? (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:14, height:14, borderRadius:"50%",
                    border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff",
                    animation:"spin 0.7s linear infinite" }}/>
                  Signing in…
                </div>
              ) : "Sign In"}
            </button>
          </form>

          <p style={{ marginTop:24, fontSize:12, color:"var(--text-muted)", textAlign:"center" }}>
            Admin access only · <a href="#" style={{ color:"var(--accent)", fontWeight:500 }}>Forgot password?</a>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
