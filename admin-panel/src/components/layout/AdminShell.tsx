"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-canvas)", fontFamily: "var(--font-body)" }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Scrollable content area */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ background: "var(--bg-canvas)" }}
          id="main-content"
        >
          <div className="min-h-full flex flex-col">
            {/* Page content */}
            <div className="flex-1 p-6">{children}</div>

            {/* Footer pinned to bottom of scroll content */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
