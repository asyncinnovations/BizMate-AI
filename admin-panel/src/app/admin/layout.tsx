"use client"

import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      <Sidebar collapsed={collapsed} />

      <div
        className={`flex flex-col flex-1 transition-all duration-200 ${
          collapsed ? "ml-[72px]" : "ml-[256px]"
        }`}
      >
        <Header onToggle={() => setCollapsed(!collapsed)} />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  )
}