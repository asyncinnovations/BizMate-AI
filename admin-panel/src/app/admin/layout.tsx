"use client";
import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-canvas)" }}>
      <Sidebar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
        <Header />
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "24px", scrollbarWidth: "thin" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto" }}>
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
