export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgeVariant?: "default" | "alert" | "info" | "warning";
  children?: NavItem[];
};

export type NavGroup = {
  group: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard", href: "/admin", icon: "dashboard" },
    ],
  },
  {
    group: "Management",
    items: [
      { key: "users",      label: "User Management",     href: "/admin/users",      icon: "users" },
      { key: "businesses", label: "Business Management", href: "/admin/businesses", icon: "businesses" },
    ],
  },
  {
    group: "Finance",
    items: [
      {
        key: "subscriptions",
        label: "Subscriptions & Billing",
        href: "/admin/subscriptions",
        icon: "subscriptions",
      },
    ],
  },
  {
    group: "Features",
    items: [
      {
        key: "invoicing",
        label: "Smart Invoicing",
        href: "/admin/invoicing",
        icon: "invoicing",
      },
      {
        key: "documents",
        label: "Document Generator",
        href: "/admin/documents",
        icon: "documents",
      },
      {
        key: "compliance",
        label: "Compliance & Licensing",
        href: "/admin/compliance",
        icon: "compliance",
      },
    ],
  },
  {
    group: "Intelligence",
    items: [
      {
        key: "ai",
        label: "AI Control Panel",
        href: "/admin/ai-control",
        icon: "ai",
        badge: "Live",
        badgeVariant: "info",
      },
      { key: "analytics", label: "Platform Analytics", href: "/admin/analytics", icon: "analytics" },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        key: "support",
        label: "Support & Comms",
        href: "/admin/support",
        icon: "support",
        badge: 12,
        badgeVariant: "alert",
      },
      { key: "roles",    label: "Roles & Permissions", href: "/admin/roles",    icon: "roles" },
    ],
  },
  {
    group: "System",
    items: [
      {
        key: "notifications",
        label: "Notifications & Alerts",
        href: "/admin/notifications",
        icon: "notifications",
        badge: 3,
        badgeVariant: "alert",
      },
      { key: "settings", label: "System Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];

export const NAV_FLAT: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export const getNavItem = (key: string): NavItem | undefined =>
  NAV_FLAT.find((i) => i.key === key);
