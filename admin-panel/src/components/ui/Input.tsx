import { LucideIcon } from "lucide-react"

export default function Input({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  error,
  ...props
}: {
  label: string
  icon?: LucideIcon
  type?: string
  placeholder?: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>

      <div
        className={`flex items-center gap-2 border rounded-lg px-3 transition
        ${error ? "border-red-500" : "border-gray-300"}
        focus-within:ring-2 focus-within:ring-orange-100`}
      >
        {Icon && <Icon size={16} className="text-gray-400" />}

        <input
          type={type}
          placeholder={placeholder}
          className="w-full py-2.5 outline-none text-sm bg-transparent"
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}