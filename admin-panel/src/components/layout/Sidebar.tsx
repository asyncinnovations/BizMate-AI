"use client"

import Link from "next/link"

const items = [
  { name: "Dashboard", href: "/" },
  { name: "Users", href: "/users" },
  { name: "Businesses", href: "/businesses" },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4 font-bold text-lg">BizMate</div>

      <nav className="flex flex-col gap-1 p-2">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="px-3 py-2 rounded hover:bg-gray-100"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}