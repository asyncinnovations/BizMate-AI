"use client";
import React from "react";

interface FilterBarProps {
  children: React.ReactNode;
  right?: React.ReactNode;
}

export default function FilterBar({ children, right }: FilterBarProps) {
  return (
    <div style={{
      background:"var(--bg-surface)", border:"1.5px solid var(--border)",
      borderRadius:"var(--radius-lg)", padding:"10px 14px",
      display:"flex", flexWrap:"wrap", alignItems:"center", gap:10,
      marginBottom:16, boxShadow:"var(--shadow-xs)",
    }}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, flex:1, alignItems:"center" }}>
        {children}
      </div>
      {right && <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>{right}</div>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: {
  value: string; onChange: (v:string)=>void; placeholder?: string;
}) {
  return (
    <div style={{ position:"relative", minWidth:200, flex:"1 1 200px", maxWidth:300 }}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
        style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)", pointerEvents:"none" }}>
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <input value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder ?? "Search…"} className="input-base"
        style={{ paddingLeft:30, height:34, fontSize:12.5 }}/>
    </div>
  );
}

export function SelectFilter({ value, onChange, options, placeholder }: {
  value: string; onChange:(v:string)=>void;
  options: { label:string; value:string }[];
  placeholder?: string;
}) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      className="input-base" style={{ width:"auto", height:34, minWidth:120, fontSize:12.5 }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
