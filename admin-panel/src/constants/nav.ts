import { adminPath } from "@/constants/admin";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgeVariant?: "default" | "alert" | "info";
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
      {
        key: "dashboard",
        label: "Dashboard",
        href: adminPath("/"),
        icon: "dashboard",
      },
    ],
  },
  {
    group: "Management",
    items: [
      {
        key: "users",
        label: "User Management",
        href: adminPath("/users"),
        icon: "users",
      },
      {
        key: "businesses",
        label: "Business Management",
        href: adminPath("/businesses"),
        icon: "businesses",
      },
    ],
  },
  {
    group: "Finance",
    items: [
      {
        key: "subscriptions",
        label: "Subscriptions & Billing",
        href: adminPath("/subscriptions"),
        icon: "subscriptions",
      },
    ],
  },
  {
    group: "Content",
    items: [
      {
        key: "documents",
        label: "Document Generator",
        href: adminPath("/documents"),
        icon: "documents",
      },
      {
        key: "compliance",
        label: "Compliance & Licensing",
        href: adminPath("/compliance"),
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
        href: adminPath("/ai"),
        icon: "ai",
        badge: "Live",
        badgeVariant: "info",
      },
      {
        key: "analytics",
        label: "Platform Analytics",
        href: adminPath("/analytics"),
        icon: "analytics",
      },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        key: "support",
        label: "Support & Comms",
        href: adminPath("/support"),
        icon: "support",
        badge: 12,
        badgeVariant: "alert",
      },
      {
        key: "roles",
        label: "Roles & Permissions",
        href: adminPath("/roles"),
        icon: "roles",
      },
    ],
  },
  {
    group: "System",
    items: [
      {
        key: "notifications",
        label: "Notifications & Alerts",
        href: adminPath("/notifications"),
        icon: "notifications",
        badge: 3,
        badgeVariant: "alert",
      },
      {
        key: "settings",
        label: "System Settings",
        href: adminPath("/settings"),
        icon: "settings",
      },
    ],
  },
];

export const NAV_FLAT: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export const getNavItem = (key: string): NavItem | undefined =>
  NAV_FLAT.find((i) => i.key === key);
