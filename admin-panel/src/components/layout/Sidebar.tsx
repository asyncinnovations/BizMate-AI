"use client"

import Link from "next/link"
import { Home, Users, Building2 } from "lucide-react"

const nav = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Users", href: "/users", icon: Users },
  { name: "Businesses", href: "/businesses", icon: Building2 },
]

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={`h-full bg-gray-900 text-white transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      <div className="p-4 text-lg font-bold">
        {collapsed ? "BM" : "BizMate"}
      </div>

      <nav className="px-2 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition"
            >
              <Icon size={18} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}