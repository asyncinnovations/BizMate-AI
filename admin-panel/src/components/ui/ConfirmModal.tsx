"use client";
import React from "react";

interface ConfirmModalProps {
  open:boolean; title:string; message:string;
  confirmLabel?:string; cancelLabel?:string;
  variant?:"danger"|"warning"|"default";
  onConfirm:()=>void; onCancel:()=>void;
}

export default function ConfirmModal({open,title,message,confirmLabel="Confirm",cancelLabel="Cancel",
  variant="default",onConfirm,onCancel}: ConfirmModalProps) {
  if (!open) return null;
  const btnBg = variant==="danger"?"var(--red)":variant==="warning"?"var(--amber)":"var(--accent)";
  return (
    <div style={{position:"fixed",inset:0,zIndex:60,display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(15,23,42,0.45)",backdropFilter:"blur(3px)",padding:16}} onClick={onCancel}>
      <div style={{width:"100%",maxWidth:420,background:"var(--bg-panel)",border:"1.5px solid var(--border)",
        borderRadius:"var(--radius-xl)",boxShadow:"var(--shadow-xl)",padding:"24px",
        animation:"scale-in 0.2s cubic-bezier(0.16,1,0.3,1)"}} onClick={e=>e.stopPropagation()}>
        <h3 style={{fontFamily:"var(--font-display)",fontSize:16,fontWeight:700,color:"var(--text-primary)",marginBottom:8}}>{title}</h3>
        <p style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.55,marginBottom:24}}>{message}</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onCancel} className="btn btn-secondary">{cancelLabel}</button>
          <button onClick={onConfirm} className="btn"
            style={{background:btnBg,color:"#fff",boxShadow:`0 1px 6px ${btnBg}44`}}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
