"use client"

export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-medium">Admin Panel</h2>

      <div className="flex items-center gap-4">
        <span>Admin</span>
        <button className="text-sm text-red-500">Logout</button>
      </div>
    </header>
  )
}