"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_FLAT } from "@/constants/nav";
import { useAuth } from "@/hooks/useAuth";
import NavIcon from "@/components/ui/NavIcon";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  const crumbs = [{ label: "Admin", href: "/admin" }];
  let path = "/admin";
  segments.forEach((seg) => {
    path += "/" + seg;
    const nav = NAV_FLAT.find((n) => n.href === path);
    crumbs.push({ label: nav?.label ?? capitalize(seg), href: path });
  });
  if (segments.length === 0) crumbs.push({ label: "Dashboard", href: "/admin" });
  return crumbs;
}

const NOTIFS = [
  { id:1, type:"alert", title:"AI credit limit warning",   desc:"Business #2041 at 92% usage",       time:"2m ago" },
  { id:2, type:"info",  title:"New support ticket",         desc:"User reported invoice sync error",   time:"14m ago" },
  { id:3, type:"alert", title:"Failed workflow process",    desc:"Document generation timeout ×3",     time:"1h ago" },
];

export default function Header() {
  const crumbs = useBreadcrumbs();
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser]     = useState(false);
  const [search, setSearch]         = useState("");
  const nRef = useRef<HTMLDivElement>(null);
  const uRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (nRef.current && !nRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (uRef.current && !uRef.current.contains(e.target as Node)) setShowUser(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const me = user ?? { name: "Admin User", role: "super_admin", email: "admin@bizmate.io" };
  const initials = me.name.split(" ").map((n:string) => n[0]).join("").slice(0,2).toUpperCase();

  const dropStyle: React.CSSProperties = {
    position: "absolute", right: 0, top: "calc(100% + 8px)",
    background: "var(--bg-panel)", border: "1.5px solid var(--border)",
    borderRadius: 12, boxShadow: "var(--shadow-lg)", zIndex: 100,
    animation: "slide-down 0.18s cubic-bezier(0.16,1,0.3,1)",
  };

  return (
    <header style={{
      height: "var(--header-h)", display: "flex", alignItems: "center",
      padding: "0 20px", background: "var(--bg-panel)",
      borderBottom: "1.5px solid var(--border)",
      position: "sticky", top: 0, zIndex: 30, gap: 12, flexShrink: 0,
    }}>

      {/* Breadcrumb */}
      <nav style={{ display:"flex", alignItems:"center", gap:4, flex:1, minWidth:0 }}>
        {crumbs.map((c, i) => (
          <React.Fragment key={c.href + i}>
            {i > 0 && <span style={{ color:"var(--text-faint)", fontSize:14, margin:"0 1px" }}>/</span>}
            {i === crumbs.length - 1
              ? <span style={{ fontFamily:"var(--font-body)", fontWeight:600, fontSize:13, color:"var(--text-primary)", whiteSpace:"nowrap" }}>{c.label}</span>
              : <Link href={c.href} style={{ fontFamily:"var(--font-body)", fontSize:13, color:"var(--text-muted)", textDecoration:"none", whiteSpace:"nowrap",
                  transition:"color 0.12s" }}
                  onMouseEnter={e=>(e.currentTarget.style.color="var(--text-secondary)")}
                  onMouseLeave={e=>(e.currentTarget.style.color="var(--text-muted)")}>{c.label}</Link>
            }
          </React.Fragment>
        ))}
      </nav>

      {/* Search */}
      <div style={{ position:"relative", maxWidth:260, flex:"0 1 260px" }} className="hidden-xs">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
          style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)", pointerEvents:"none" }}>
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search…" className="input-base"
          style={{ paddingLeft:30, paddingRight:12, fontSize:12.5, height:34 }} />
      </div>

      {/* Actions */}
      <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>

        {/* Notif bell */}
        <div ref={nRef} style={{ position:"relative" }}>
          <button onClick={()=>{setShowNotifs(v=>!v);setShowUser(false);}}
            style={{
              width:34, height:34, borderRadius:8, border:`1.5px solid ${showNotifs?"var(--accent-border)":"var(--border)"}`,
              background: showNotifs?"var(--accent-dim)":"var(--bg-surface)",
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
              color: showNotifs?"var(--accent)":"var(--text-muted)", position:"relative",
              transition:"all 0.12s",
            }}
            onMouseEnter={e=>{if(!showNotifs){e.currentTarget.style.background="var(--bg-hover)";e.currentTarget.style.borderColor="var(--border-mid)";}}}
            onMouseLeave={e=>{if(!showNotifs){e.currentTarget.style.background="var(--bg-surface)";e.currentTarget.style.borderColor="var(--border)";}}}
          >
            <NavIcon name="bell" size={15}/>
            <span style={{ position:"absolute", top:7, right:7, width:7, height:7, borderRadius:"50%",
              background:"var(--red)", border:"2px solid var(--bg-panel)" }}/>
          </button>

          {showNotifs && (
            <div style={{ ...dropStyle, width:300 }}>
              <div style={{ padding:"12px 16px 10px", borderBottom:"1.5px solid var(--border)",
                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontWeight:600, fontSize:13, color:"var(--text-primary)", fontFamily:"var(--font-body)" }}>Notifications</span>
                <button onClick={()=>setShowNotifs(false)}
                  style={{ fontSize:11, fontWeight:600, color:"var(--accent)", background:"none", border:"none", cursor:"pointer" }}>
                  Mark all read
                </button>
              </div>
              {NOTIFS.map(n=>(
                <div key={n.id} style={{ display:"flex", gap:10, padding:"10px 16px",
                  borderBottom:"1px solid var(--border)", cursor:"pointer", transition:"background 0.1s" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-hover)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <span style={{ width:7, height:7, borderRadius:"50%", marginTop:5, flexShrink:0,
                    background: n.type==="alert"?"var(--red)":"var(--info)" }}/>
                  <div>
                    <p style={{ fontSize:12, fontWeight:600, color:"var(--text-primary)", margin:0 }}>{n.title}</p>
                    <p style={{ fontSize:11.5, color:"var(--text-secondary)", margin:"2px 0 0" }}>{n.desc}</p>
                    <p style={{ fontSize:10.5, color:"var(--text-muted)", margin:"3px 0 0" }}>{n.time}</p>
                  </div>
                </div>
              ))}
              <Link href="/admin/notifications" onClick={()=>setShowNotifs(false)}
                style={{ display:"flex", justifyContent:"center", padding:"10px", fontSize:12,
                  fontWeight:500, color:"var(--text-secondary)", textDecoration:"none", transition:"color 0.1s" }}
                onMouseEnter={e=>(e.currentTarget.style.color="var(--accent)")}
                onMouseLeave={e=>(e.currentTarget.style.color="var(--text-secondary)")}>
                View all →
              </Link>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width:1, height:20, background:"var(--border)" }}/>

        {/* User menu */}
        <div ref={uRef} style={{ position:"relative" }}>
          <button onClick={()=>{setShowUser(v=>!v);setShowNotifs(false);}}
            style={{
              display:"flex", alignItems:"center", gap:8, padding:"5px 8px",
              borderRadius:8, border:`1.5px solid ${showUser?"var(--accent-border)":"transparent"}`,
              background: showUser?"var(--accent-dim)":"transparent",
              cursor:"pointer", transition:"all 0.12s",
            }}
            onMouseEnter={e=>{if(!showUser)e.currentTarget.style.background="var(--bg-hover)";}}
            onMouseLeave={e=>{if(!showUser)e.currentTarget.style.background="transparent";}}
          >
            <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--accent)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:700, color:"#fff", fontFamily:"var(--font-display)", flexShrink:0 }}>
              {initials}
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", lineHeight:1.2 }}
              className="hidden-sm">
              <span style={{ fontSize:12.5, fontWeight:600, color:"var(--text-primary)", fontFamily:"var(--font-body)", whiteSpace:"nowrap" }}>
                {me.name}
              </span>
              <span style={{ fontSize:10.5, color:"var(--text-muted)", textTransform:"capitalize", whiteSpace:"nowrap" }}>
                {(me.role as string).replace(/_/g," ")}
              </span>
            </div>
            <NavIcon name="chevronDown" size={11} style={{ color:"var(--text-muted)", flexShrink:0 }}/>
          </button>

          {showUser && (
            <div style={{ ...dropStyle, width:200 }}>
              <div style={{ padding:"12px 14px", borderBottom:"1.5px solid var(--border)" }}>
                <p style={{ margin:0, fontSize:13, fontWeight:600, color:"var(--text-primary)" }}>{me.name}</p>
                <p style={{ margin:"2px 0 0", fontSize:11.5, color:"var(--text-secondary)" }}>{me.email}</p>
                <span style={{ display:"inline-block", marginTop:6, fontSize:10, fontWeight:700,
                  padding:"2px 8px", borderRadius:100, background:"var(--accent-dim)",
                  color:"var(--accent)", border:"1.5px solid var(--accent-border)" }}>
                  {(me.role as string).replace(/_/g," ").toUpperCase()}
                </span>
              </div>
              {[{ label:"Settings", href:"/admin/settings" },{ label:"Roles", href:"/admin/roles" }].map(m=>(
                <Link key={m.href} href={m.href} onClick={()=>setShowUser(false)}
                  style={{ display:"block", padding:"9px 14px", fontSize:13, color:"var(--text-secondary)",
                    textDecoration:"none", transition:"background 0.1s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="var(--bg-hover)";e.currentTarget.style.color="var(--text-primary)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text-secondary)";}}>
                  {m.label}
                </Link>
              ))}
              <div style={{ borderTop:"1.5px solid var(--border)" }}>
                <button onClick={()=>setShowUser(false)}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:8,
                    padding:"9px 14px", fontSize:13, color:"var(--red)",
                    background:"none", border:"none", cursor:"pointer", textAlign:"left", transition:"background 0.1s" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="var(--red-dim)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <NavIcon name="logout" size={13}/> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
