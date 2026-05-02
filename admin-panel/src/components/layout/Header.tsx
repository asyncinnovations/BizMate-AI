"use client"

import { Menu } from "lucide-react"

export default function Header({
  onToggle,
}: {
  onToggle: () => void
}) {
  return (
    <header className="h-[64px] bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button onClick={onToggle}>
          <Menu size={20} />
        </button>
        <h1 className="font-medium">BizMate Admin</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">Admin</span>
        <button className="text-red-500 text-sm">Logout</button>
      </div>
    </header>
  )
}