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
      className="flex h-screen min-h-0 overflow-hidden bg-[var(--bg-canvas)]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main
          className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-[var(--bg-canvas)]"
          id="main-content"
        >
          <div className="flex min-h-full flex-col">
            <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
