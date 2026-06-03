"use client";
import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action, children }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
        <div>
          <h1 className="section-title">{title}</h1>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {action && <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>{action}</div>}
      </div>
      {children && <div style={{ marginTop:16 }}>{children}</div>}
    </div>
  );
}
