// src/lib/utils.ts
export function getStatusBadge(status: string) {
  const baseClasses =
    "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border";

  switch (status) {
    case "paid":
      return `${baseClasses} bg-green-100 text-green-800 border-green-200`;
    case "unpaid":
      return `${baseClasses} bg-amber-100 text-amber-800 border-amber-200`;
    case "draft":
      return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
    case "saved":
      return `${baseClasses} bg-emerald-100 text-emerald-800 border-emerald-200`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
  }
}
