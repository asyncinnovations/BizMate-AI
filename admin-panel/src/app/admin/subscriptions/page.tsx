"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { MOCK_PLANS, MOCK_SUBSCRIPTIONS, MOCK_INVOICES, SUBSCRIPTION_METRICS } from "@/modules/subscriptions/data";
import SubscriptionStats from "./SubscriptionStats";
import RevenueCharts from "./RevenueCharts";
import PlansTable from "./plans/PlansTable";
import ActiveSubscriptionsTable from "./active/ActiveSubscriptionsTable";
import BillingHistoryTable from "./billing/BillingHistoryTable";

type Tab = "overview"|"plans"|"active"|"billing";
const TABS: {key: Tab; label: string; count?: number}[] = [
  { key:"overview", label:"Overview" },
  { key:"plans",    label:"Plans",                count: 3 },
  { key:"active",   label:"Active Subscriptions", count: MOCK_SUBSCRIPTIONS.length },
  { key:"billing",  label:"Billing History",      count: MOCK_INVOICES.length },
];

export default function SubscriptionsPage() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="page-enter">
      <PageHeader
        title="Subscriptions & Billing"
        subtitle="Manage plans, monitor revenue and control billing across all businesses"
        action={
          tab === "plans" ? (
            <button className="btn btn-primary">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              New Plan
            </button>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div style={{ display:"flex", gap:2, background:"var(--bg-raised)", borderRadius:10, padding:4,
        width:"fit-content", marginBottom:20, border:"1.5px solid var(--border)" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 16px", borderRadius:7,
              fontSize:13, fontWeight:600, border:"none", cursor:"pointer",
              background: tab===t.key ? "var(--bg-surface)" : "transparent",
              color: tab===t.key ? "var(--text-primary)" : "var(--text-muted)",
              boxShadow: tab===t.key ? "var(--shadow-xs)" : "none",
              transition:"all 0.15s", whiteSpace:"nowrap" }}>
            {t.label}
            {t.count !== undefined && (
              <span style={{ fontSize:10.5, fontWeight:700, padding:"1px 6px", borderRadius:100,
                background: tab===t.key ? "var(--accent-dim)" : "rgba(148,163,184,0.15)",
                color: tab===t.key ? "var(--accent)" : "var(--text-muted)" }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && <>
        <SubscriptionStats metrics={SUBSCRIPTION_METRICS}/>
        <RevenueCharts/>
      </>}
      {tab === "plans"  && <PlansTable plans={MOCK_PLANS}/>}
      {tab === "active" && <ActiveSubscriptionsTable subscriptions={MOCK_SUBSCRIPTIONS}/>}
      {tab === "billing"&& <BillingHistoryTable invoices={MOCK_INVOICES}/>}
    </div>
  );
}
