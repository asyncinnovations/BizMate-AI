"use client";
import React from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

/* ─── Sparkline ─────────────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const W = 80, H = 32, range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 6) - 3,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <path d={`${line} L${W},${H} L0,${H} Z`} fill={color} opacity="0.12" />
      <path d={line} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── KPI Card ──────────────────────────────────────────────── */
function KPICard({ title, value, change, color, icon, spark }: {
  title: string; value: string | number; change: number; color: string;
  icon: React.ReactNode; spark: number[];
}) {
  const positive = change >= 0;
  return (
    <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)",
      padding: "16px 18px", boxShadow: "var(--shadow-sm)", position: "relative", overflow: "hidden",
      transition: "box-shadow 0.2s, border-color 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--border-mid)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}55, ${color}cc, ${color}33)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}14`,
          display: "flex", alignItems: "center", justifyContent: "center", color }}>
          {icon}
        </div>
        <Sparkline data={spark} color={color} />
      </div>
      <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 4, fontFamily: "var(--font-body)" }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)",
        letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 8 }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700,
        padding: "2px 7px", borderRadius: 100,
        background: positive ? "var(--green-dim)" : "var(--red-dim)",
        color: positive ? "var(--green)" : "var(--red)" }}>
        {positive ? "↑" : "↓"} {Math.abs(change)}% vs last month
      </span>
    </div>
  );
}

/* ─── Revenue Chart ─────────────────────────────────────────── */
const REV = [
  { m: "Oct", v: 38200 }, { m: "Nov", v: 41500 }, { m: "Dec", v: 43800 },
  { m: "Jan", v: 46200 }, { m: "Feb", v: 48100 }, { m: "Mar", v: 50900 }, { m: "Apr", v: 52300 },
];
function RevenueChart() {
  const [hov, setHov] = React.useState<number | null>(null);
  const max = Math.max(...REV.map(d => d.v));
  const W = 520, H = 140, PL = 8, PR = 8, PT = 12, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;
  const pts = REV.map((d, i) => ({
    x: PL + (i / (REV.length - 1)) * cW,
    y: PT + cH - (d.v / max) * cH,
    d,i,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const fill = `${line} L${pts[pts.length-1].x},${H-PB} L${pts[0].x},${H-PB} Z`;
  return (
    <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)",
      padding: "20px", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Revenue Overview</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Monthly Recurring Revenue · last 7 months</div>
        </div>
        <div style={{ background: "var(--green-dim)", color: "var(--green)", fontSize: 11, fontWeight: 700,
          padding: "4px 10px", borderRadius: 100 }}>↑ 11.9% MoM</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={fill} fill="url(#revGrad)" />
        <path d={line} stroke="var(--accent)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(p => (
          <g key={p.i} onMouseEnter={() => setHov(p.i)} onMouseLeave={() => setHov(null)}>
            <circle cx={p.x} cy={p.y} r={hov === p.i ? 5 : 3.5} fill="var(--accent)"
              stroke="var(--bg-surface)" strokeWidth="2" style={{ transition: "r 0.15s", cursor: "pointer" }} />
            {hov === p.i && (
              <g>
                <rect x={Math.min(p.x - 42, W - 90)} y={p.y - 48} width={88} height={38}
                  rx="7" fill="var(--bg-panel)" stroke="var(--border)" strokeWidth="1.5"
                  style={{ filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.10))" }} />
                <text x={Math.min(p.x, W-46)+4} y={p.y - 34} textAnchor="middle" fontSize="9.5"
                  fill="var(--text-muted)" fontFamily="var(--font-body)">{p.d.m}</text>
                <text x={Math.min(p.x, W-46)+4} y={p.y - 20} textAnchor="middle" fontSize="12"
                  fontWeight="700" fill="var(--text-primary)" fontFamily="var(--font-display)">
                  ${(p.d.v / 1000).toFixed(1)}k
                </text>
              </g>
            )}
          </g>
        ))}
        {pts.map(p => (
          <text key={p.i} x={p.x} y={H - 4} textAnchor="middle" fontSize="9.5"
            fill="var(--text-muted)" fontFamily="var(--font-body)">{p.d.m}</text>
        ))}
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16,
        paddingTop: 16, borderTop: "1.5px solid var(--border)" }}>
        {[
          { label: "Current MRR", value: "$52.3k", change: "+2.8%", color: "var(--accent)" },
          { label: "New MRR",     value: "$4.6k",  change: "+4.5%", color: "var(--green)" },
          { label: "Churn MRR",   value: "$3.2k",  change: "+4.3%", color: "var(--red)" },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", margin: "2px 0" }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── System Alerts ─────────────────────────────────────────── */
const ALERTS = [
  { id: 1, level: "critical", title: "AI credit limit warning",   desc: "Business #2041 at 92%",         time: "2m ago" },
  { id: 2, level: "warning",  title: "Failed doc generation",     desc: "Timeout ×3 template #094",      time: "18m ago" },
  { id: 3, level: "info",     title: "New support ticket",        desc: "Invoice sync error reported",   time: "34m ago" },
  { id: 4, level: "warning",  title: "Subscription past due",     desc: "BizCo LLC – 3 days overdue",    time: "1h ago" },
  { id: 5, level: "info",     title: "New business onboarded",    desc: "Al Rahma Trading LLC",          time: "2h ago" },
];
const AL_COLOR: Record<string, string> = {
  critical: "var(--red)", warning: "var(--amber)", info: "var(--blue)",
};
function SystemAlerts() {
  return (
    <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderBottom: "1.5px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--red)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>
            System Alerts
          </span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 100,
          background: "var(--red-dim)", color: "var(--red)" }}>3 active</span>
      </div>
      <div style={{ flex: 1 }}>
        {ALERTS.map((a, i) => (
          <div key={a.id} style={{ display: "flex", gap: 10, padding: "11px 16px",
            borderBottom: i < ALERTS.length - 1 ? "1px solid var(--border)" : "none",
            cursor: "pointer", transition: "background 0.1s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: AL_COLOR[a.level],
              marginTop: 4, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{a.title}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 1 }}>{a.desc}</div>
            </div>
            <span style={{ fontSize: 10.5, color: "var(--text-muted)", flexShrink: 0 }}>{a.time}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1.5px solid var(--border)" }}>
        <Link href="/admin/notifications" style={{ fontSize: 12, fontWeight: 500, color: "var(--accent)",
          textDecoration: "none" }}>View all alerts →</Link>
      </div>
    </div>
  );
}

/* ─── Recent Activity ───────────────────────────────────────── */
const ACTIVITY = [
  { id: 1, action: "New user registered",     actor: "Hassan Al-Rashid",   meta: "via Google OAuth",         time: "5m",  type: "user",    color: "#3B82F6" },
  { id: 2, action: "Subscription upgraded",   actor: "Bright Futures LLC", meta: "Starter → Pro",            time: "22m", type: "billing", color: "#10B981" },
  { id: 3, action: "Invoice generated",       actor: "Al Noor Trading",    meta: "INV-2025-0041 · AED 2,400",time: "44m", type: "invoice", color: "var(--accent)" },
  { id: 4, action: "AI limit adjusted",       actor: "Admin",              meta: "+50k credits for #2041",   time: "1h",  type: "ai",      color: "#8B5CF6" },
  { id: 5, action: "Template published",      actor: "Admin",              meta: "UAE Trade License v2",     time: "2h",  type: "doc",     color: "#06B6D4" },
  { id: 6, action: "Business suspended",      actor: "Admin",              meta: "Compliance violation",     time: "3h",  type: "alert",   color: "var(--red)" },
];
function RecentActivity() {
  return (
    <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderBottom: "1.5px solid var(--border)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>
          Recent Activity
        </span>
        <Link href="/admin/users" style={{ fontSize: 12, fontWeight: 500, color: "var(--accent)", textDecoration: "none" }}>View all →</Link>
      </div>
      <div style={{ flex: 1 }}>
        {ACTIVITY.map((a, i) => (
          <div key={a.id} style={{ display: "flex", gap: 10, padding: "10px 16px", position: "relative",
            borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--border)" : "none",
            cursor: "pointer", transition: "background 0.1s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            {i < ACTIVITY.length - 1 && (
              <div style={{ position: "absolute", left: 22, top: 30, width: 1, height: "calc(100% - 10px)",
                background: "var(--border)", zIndex: 0 }} />
            )}
            <span style={{ width: 13, height: 13, borderRadius: "50%", background: a.color,
              border: "2px solid var(--bg-surface)", flexShrink: 0, marginTop: 2, zIndex: 1 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{a.action}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 1 }}>
                <span style={{ fontWeight: 500 }}>{a.actor}</span> · {a.meta}
              </div>
            </div>
            <span style={{ fontSize: 10.5, color: "var(--text-muted)", flexShrink: 0 }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AI Usage ──────────────────────────────────────────────── */
const AI_MODS = [
  { name: "AI Assistant",    used: 1200000, limit: 2000000, color: "#8B5CF6" },
  { name: "Smart Invoicing", used: 480000,  limit: 800000,  color: "var(--accent)" },
  { name: "Auto Reply Hub",  used: 620000,  limit: 1000000, color: "#06B6D4" },
  { name: "Advisory AI",     used: 140000,  limit: 500000,  color: "#10B981" },
];
function AIUsage() {
  const totalUsed = AI_MODS.reduce((s, m) => s + m.used, 0);
  const totalLimit = AI_MODS.reduce((s, m) => s + m.limit, 0);
  const totalPct = Math.round((totalUsed / totalLimit) * 100);
  return (
    <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderBottom: "1.5px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8B5CF6" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>
            AI Usage
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>This month</span>
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
            <svg viewBox="0 0 68 68" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="34" cy="34" r="28" fill="none" stroke="var(--bg-hover)" strokeWidth="9" />
              <circle cx="34" cy="34" r="28" fill="none" stroke="#8B5CF6" strokeWidth="9"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - totalPct / 100)}`}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center",
              justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", lineHeight: 1 }}>{totalPct}%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Total Tokens Used</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "2px 0" }}>
              {(totalUsed / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>of {(totalLimit / 1000000).toFixed(1)}M limit</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {AI_MODS.map(m => {
            const pct = Math.round((m.used / m.limit) * 100);
            const warn = pct >= 80;
            return (
              <div key={m.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{m.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: warn ? "var(--red)" : "var(--text-muted)" }}>{pct}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 100, background: "var(--bg-hover)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 100, background: warn ? "var(--red)" : m.color,
                    width: `${pct}%`, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1.5px solid var(--border)" }}>
        <Link href="/admin/ai-control" style={{ display: "flex", alignItems: "center", justifyContent: "center",
          padding: "7px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#8B5CF6",
          textDecoration: "none", background: "var(--purple-dim)", border: "1.5px solid rgba(139,92,246,0.2)",
          transition: "background 0.12s" }}>
          Manage AI Limits →
        </Link>
      </div>
    </div>
  );
}

/* ─── Quick Actions ─────────────────────────────────────────── */
const QUICK = [
  { label: "Invite User",       href: "/admin/users",         color: "var(--blue)",   icon: "👤" },
  { label: "New Plan",          href: "/admin/subscriptions", color: "var(--green)",  icon: "📦" },
  { label: "Add Template",      href: "/admin/documents",     color: "var(--accent)", icon: "📄" },
  { label: "View Analytics",    href: "/admin/analytics",     color: "#8B5CF6",       icon: "📊" },
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div className="page-enter">
      <PageHeader
        title="Platform Dashboard"
        subtitle="Real-time overview of BizMate AI platform health and metrics"
        action={
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 8,
            background: "var(--bg-surface)", border: "1.5px solid var(--border)",
            fontSize: 12, color: "var(--text-secondary)", boxShadow: "var(--shadow-xs)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} />
            Live · Updated just now
          </div>
        }
      />

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
        <KPICard title="Total Users"          value={14280}    change={8.3}  color="var(--blue)"   spark={[98,104,109,117,123,133,142]} icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 17c0-3.9 2.7-7 6-7s6 3.1 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 4a3 3 0 010 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 17c0-2-1-3.8-2.8-4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>} />
        <KPICard title="Active Businesses"    value={1840}     change={12.1} color="var(--cyan)"   spark={[120,138,130,155,148,172,184]} icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 18V8l7-5 7 5v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 18v-5h6v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>} />
        <KPICard title="Monthly Revenue"      value="$52,300"  change={11.9} color="var(--green)"  spark={[382,415,438,462,481,509,523]} icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h16" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>} />
        <KPICard title="AI Tokens This Month" value="2.7M"     change={-3.2} color="#8B5CF6"       spark={[310,280,320,295,340,290,270]} icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="1" fill="currentColor"/></svg>} />
      </div>

      {/* Revenue chart */}
      <div style={{ marginBottom: 16 }}>
        <RevenueChart />
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
        {QUICK.map(q => (
          <Link key={q.label} href={q.href} style={{ display: "flex", alignItems: "center", gap: 10,
            padding: "12px 14px", borderRadius: "var(--radius-md)", textDecoration: "none",
            background: "var(--bg-surface)", border: "1.5px solid var(--border)",
            transition: "all 0.15s", boxShadow: "var(--shadow-xs)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow-xs)"; }}>
            <span style={{ fontSize: 18 }}>{q.icon}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>{q.label}</span>
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <SystemAlerts />
        <RecentActivity />
        <AIUsage />
      </div>
    </div>
  );
}
