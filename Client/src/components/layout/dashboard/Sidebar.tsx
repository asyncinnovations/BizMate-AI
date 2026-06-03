// "use client";

// import {
//   ChevronLeft,
//   Bot,
//   MessageSquare,
//   FileText,
//   Calendar,
//   Bell,
//   Settings,
//   Users,
//   BarChart,
//   HelpCircle,
//   Wallet,
//   Mail,
//   Zap,
//   Contact,
//   ShieldBan,
//   Banknote,
// } from "lucide-react";
// import React, { useRef, useEffect } from "react";
// import { gsap } from "gsap";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import "./Sidebar.css";

// interface SidebarProps {
//   isOpen: boolean;
//   onToggle: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const pathname = usePathname();

//   const menuItems = [
//     {
//       id: 1,
//       label: "AI Dashboard",
//       icon: Bot,
//       color: "text-blue-400",
//       href: "/dashboard",
//     },
//     {
//       id: 2,
//       label: "Compliance Assistant",
//       icon: MessageSquare,
//       color: "text-green-400",
//       href: "/dashboard/ai-chat",
//     },
//     {
//       id: 3,
//       label: "Smart Invoicing",
//       icon: FileText,
//       color: "text-purple-400",
//       href: "/dashboard/invoicing",
//     },
//     {
//       id: 4,
//       label: "AI Reminders",
//       icon: Calendar,
//       color: "text-orange-400",
//       href: "/dashboard/reminders",
//     },
//     {
//       id: 5,
//       label: "Payroll Management",
//       icon: Banknote,
//       color: "text-emerald-400",
//       href: "/dashboard/payroll",
//     },
//     {
//       id: 6,
//       label: "Compliance & Licensing",
//       icon: ShieldBan,
//       color: "text-indigo-500",
//       href: "/dashboard/compliance-licensing",
//     },

//     // ⭐ NEW ITEM — Client Management (Position 6)
//     {
//       id: 7,
//       label: "Client Management",
//       icon: Contact, // or UserCircle / NotebookPen / FolderUser
//       color: "text-teal-400",
//       href: "/dashboard/client-management",
//     },

//     // shifted below
//     {
//       id: 8,
//       label: "Auto-Reply Hub",
//       icon: Mail,
//       color: "text-pink-400",
//       href: "/dashboard/communication",
//     },
//     {
//       id: 9,
//       label: "Document Generator",
//       icon: Zap,
//       color: "text-yellow-400",
//       href: "/dashboard/documents",
//     },
//     {
//       id: 10,
//       label: "Business Analytics",
//       icon: BarChart,
//       color: "text-cyan-400",
//       href: "/dashboard/analytics",
//     },
//     {
//       id: 11,
//       label: "Team Management",
//       icon: Users,
//       color: "text-indigo-400",
//       href: "/dashboard/team-management",
//     },
//   ];

//   const secondaryItems = [
//     {
//       id: 11,
//       label: "Notifications",
//       icon: Bell,
//       href: "/dashboard/notifications",
//     },
//     {
//       id: 13,
//       label: "AI Help Center",
//       icon: HelpCircle,
//       href: "/dashboard/help",
//     },
//     {
//       id: 14,
//       label: "Settings",
//       icon: Settings,
//       href: "/dashboard/settings",
//     },
//     {
//       id: 15,
//       label: "Billing & Plans",
//       icon: Wallet,
//       href: "/dashboard/pricing",
//     },
//   ];

//   // GSAP Animations for sidebar
//   useEffect(() => {
//     if (!sidebarRef.current) return;

//     const sidebar = sidebarRef.current;

//     if (isOpen) {
//       // Slide sidebar in
//       gsap.to(sidebar, {
//         x: 0,
//         duration: 0.4,
//         ease: "power2.out",
//       });
//     } else {
//       // Slide sidebar out completely
//       gsap.to(sidebar, {
//         x: -300,
//         duration: 0.4,
//         ease: "power2.in",
//       });
//     }
//   }, [isOpen]);

//   return (
//     <>
//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className="fixed top-0 left-0 h-full bg-gradient-to-b from-[#1b2a49] to-[#152238] text-white z-50 flex flex-col border-r border-[#1f4c78] overflow-hidden"
//         style={{ width: 300, transform: "translateX(-300px)" }}
//       >
//         {/* Logo Section */}
//         <div className="flex items-center justify-between p-4 border-b border-[#1f4c78] min-h-[76px] flex-shrink-0">
//           <Link href="/dashboard" className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] flex items-center justify-center">
//               <Bot className="w-6 h-6" />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold whitespace-nowrap">
//                 BezMate-AI
//               </h2>
//               <p className="text-xs text-gray-300">Assistant</p>
//             </div>
//           </Link>

//           <button
//             onClick={onToggle}
//             className="w-8 h-8 rounded-lg bg-[#1f4c78] flex items-center justify-center hover:bg-[#2c5a8a] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
//           >
//             <ChevronLeft size={16} />
//           </button>
//         </div>

//         {/* Main Navigation */}
//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//           {/* Custom scrollbar styling */}
//           <style jsx>{`
//             .overflow-y-auto::-webkit-scrollbar {
//               width: 4px;
//             }
//             .overflow-y-auto::-webkit-scrollbar-track {
//               background: #f4f7fa;
//               border-radius: 10px;
//             }
//             .overflow-y-auto::-webkit-scrollbar-thumb {
//               background: #2c5a8a;
//               border-radius: 10px;
//             }
//             .overflow-y-auto::-webkit-scrollbar-thumb:hover {
//               background: #3a689a;
//             }
//           `}</style>

//           {menuItems.map((item) => (
//             <Link
//               key={item.id}
//               href={item.href}
//               className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
//                 (
//                   item.href === "/dashboard"
//                     ? pathname === item.href
//                     : pathname === item.href ||
//                       pathname.startsWith(`${item.href}/`)
//                 )
//                   ? "bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] shadow-lg"
//                   : "hover:bg-[#1f4c78] hover:bg-opacity-50"
//               }`}
//             >
//               <item.icon className={`w-5 h-5 ${item.color}`} />
//               <span className="text-sm font-medium whitespace-nowrap">
//                 {item.label}
//               </span>
//             </Link>
//           ))}
//         </nav>

//         {/* Secondary Navigation */}
//         <div className="p-4 border-t border-[#1f4c78] space-y-2 flex-shrink-0">
//           {secondaryItems.map((item) => (
//             <Link
//               key={item.id}
//               href={item.href}
//               className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
//                 pathname === item.href
//                   ? "bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] shadow-lg"
//                   : "hover:bg-[#1f4c78] hover:bg-opacity-50"
//               }`}
//             >
//               <item.icon className="w-5 h-5 text-gray-300" />
//               <span className="text-sm font-medium whitespace-nowrap">
//                 {item.label}
//               </span>
//             </Link>
//           ))}
//         </div>

//         {/* User Profile Mini */}
//         <div className="p-4 border-t border-[#1f4c78] flex-shrink-0">
//           <Link
//             href="/dashboard/profile"
//             className="flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-[#1f4c78] hover:bg-opacity-50 cursor-pointer group"
//           >
//             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] flex items-center justify-center text-sm font-semibold">
//               FA
//             </div>
//             <div className="overflow-hidden">
//               <p className="text-sm font-medium whitespace-nowrap">
//                 Farhan Amjad
//               </p>
//               <p className="text-xs text-gray-300 whitespace-nowrap">Owner</p>
//             </div>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

"use client";

import {
  ChevronLeft,
  Bot,
  MessageSquare,
  FileText,
  Calendar,
  Bell,
  Settings,
  Users,
  BarChart,
  HelpCircle,
  Wallet,
  Mail,
  Zap,
  Contact,
  ShieldBan,
  Banknote,
  Lock, // Added Lock icon
} from "lucide-react";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./Sidebar.css";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { useSubscription } from "@/context/SubscriptionContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { currentPlan } = useSubscription();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // const menuItems = [
  //   {
  //     id: 1,
  //     label: "AI Dashboard",
  //     icon: Bot,
  //     color: "text-blue-400",
  //     href: "/dashboard",
  //     locked: false,
  //   },
  //   {
  //     id: 2,
  //     label: "Compliance Assistant",
  //     icon: MessageSquare,
  //     color: "text-green-400",
  //     href: "/dashboard/ai-chat",
  //     locked: !currentPlan?.features.ai_assistant,
  //   },
  //   {
  //     id: 3,
  //     label: "Smart Invoicing",
  //     icon: FileText,
  //     color: "text-purple-400",
  //     href: "/dashboard/invoicing",
  //     locked: !currentPlan?.features.ai_invoicing,
  //   },
  //   {
  //     id: 4,
  //     label: "AI Reminders",
  //     icon: Calendar,
  //     color: "text-orange-400",
  //     href: "/dashboard/reminders",
  //     locked: !currentPlan?.features.reminders,
  //   },
  //   {
  //     id: 5,
  //     label: "Payroll Management",
  //     icon: Banknote,
  //     color: "text-emerald-400",
  //     href: "/dashboard/payroll",
  //     locked: !currentPlan?.features.payroll,
  //   },
  //   {
  //     id: 6,
  //     label: "Compliance & Licensing",
  //     icon: ShieldBan,
  //     color: "text-indigo-500",
  //     href: "/dashboard/compliance-licensing",
  //     locked: !currentPlan?.features.compliance,
  //   },
  //   {
  //     id: 7,
  //     label: "Client Management",
  //     icon: Contact,
  //     color: "text-teal-400",
  //     href: "/dashboard/client-management",
  //     locked: false,
  //   },
  //   // --- LOCKED ITEMS ---
  //   {
  //     id: 8,
  //     label: "Auto-Reply Hub",
  //     icon: Mail,
  //     color: "text-pink-400",
  //     href: "/dashboard/communication",
  //     locked: !currentPlan?.features.auto_reply_hub,
  //   },
  //   {
  //     id: 9,
  //     label: "Document Generator",
  //     icon: Zap,
  //     color: "text-yellow-400",
  //     href: "/dashboard/documents",
  //     locked: !currentPlan?.features.documents,
  //   },
  //   // --- END LOCKED ITEMS ---
  //   {
  //     id: 10,
  //     label: "Business Analytics",
  //     icon: BarChart,
  //     color: "text-cyan-400",
  //     href: "/dashboard/analytics",
  //     locked: !currentPlan?.features.analytics_reports,
  //   },
  //   {
  //     id: 11,
  //     label: "Team Management",
  //     icon: Users,
  //     color: "text-indigo-400",
  //     href: "/dashboard/team-management",
  //     locked: true,
  //   },
  //   {
  //     id: 12,
  //     label: "Corporate Tax Management",
  //     icon: Wallet,
  //     color: "text-indigo-400",
  //     href: "/dashboard/corporate-tax-management",
  //     locked: !currentPlan?.features.corporate_tax,
  //   },
  //   {
  //     id: 13,
  //     label: "Ai Advisory",
  //     icon: Users,
  //     color: "text-indigo-400",
  //     href: "/dashboard/ai_advisory",
  //     locked: !currentPlan?.features.ai_advisory,
  //   },
  // ];

  const hasCapability = (key: string) => {
    const capability = currentPlan?.features?.capabilities?.[key];
    return capability?.enabled === true || capability?.enabled === "true";
  };

  const hasTierAccess = (key: any, requiredLevel: any) => {
    const level = currentPlan?.features?.tiers?.[key]?.level;
    const levels = ["none", "basic", "full"];
    return levels.indexOf(level) >= levels.indexOf(requiredLevel);
  };

  const menuItems = [
    {
      id: 1,
      label: "AI Dashboard",
      icon: Bot,
      color: "text-blue-400",
      href: "/dashboard",
      locked: false,
    },

    {
      id: 2,
      label: "Compliance Assistant",
      icon: MessageSquare,
      color: "text-green-400",
      href: "/dashboard/ai-chat",
      locked: !hasTierAccess("ai_assistant", "basic"),
    },

    {
      id: 3,
      label: "Smart Invoicing",
      icon: FileText,
      color: "text-purple-400",
      href: "/dashboard/invoicing",
      locked: !hasCapability("ai_invoice"),
    },
    {
     id: 3.5,                           // Slots between invoicing (3) and payroll (4)
     label: "Quotations",
     icon: FileSignature,
     color: "text-amber-400",
     href: "/dashboard/quotations",
     locked: false,                      
   },
    {
      id: 4,
      label: "AI Reminders",
      icon: Calendar,
      color: "text-orange-400",
      href: "/dashboard/reminders",
      locked: !hasCapability("reminders"),
    },

    {
      id: 5,
      label: "Payroll Management",
      icon: Banknote,
      color: "text-emerald-400",
      href: "/dashboard/payroll",
      locked: !hasCapability("payroll"),
    },

    {
      id: 6,
      label: "Compliance & Licensing",
      icon: ShieldBan,
      color: "text-indigo-500",
      href: "/dashboard/compliance-licensing",
      locked: !hasCapability("compliance"),
    },

    {
      id: 7,
      label: "Client Management",
      icon: Contact,
      color: "text-teal-400",
      href: "/dashboard/client-management",
      locked: false,
    },

    {
      id: 8,
      label: "Auto-Reply Hub",
      icon: Mail,
      color: "text-pink-400",
      href: "/dashboard/communication",
      locked: !hasCapability("auto_reply_hub"),
    },

    {
      id: 9,
      label: "Document Generator",
      icon: Zap,
      color: "text-yellow-400",
      href: "/dashboard/documents",
      locked: !hasCapability("documents"),
    },

    {
      id: 10,
      label: "Business Analytics",
      icon: BarChart,
      color: "text-cyan-400",
      href: "/dashboard/analytics",
      locked: !hasCapability("analytics_reports"),
    },

    {
      id: 11,
      label: "Team Management",
      icon: Users,
      color: "text-indigo-400",
      href: "/dashboard/team-management",
      locked: true,
    },

    {
      id: 12,
      label: "Corporate Tax Management",
      icon: Wallet,
      color: "text-indigo-400",
      href: "/dashboard/corporate-tax-management",
      locked: !hasCapability("corporate_tax"),
    },

    {
      id: 13,
      label: "AI Advisory",
      icon: Users,
      color: "text-indigo-400",
      href: "/dashboard/ai_advisory",
      locked: !hasTierAccess("ai_advisory", "basic"),
    },
  ];
  const secondaryItems = [
    {
      id: 11,
      label: "Notifications",
      icon: Bell,
      href: "/dashboard/notifications",
    },
    {
      id: 13,
      label: "AI Help Center",
      icon: HelpCircle,
      href: "/dashboard/help",
    },
    { id: 14, label: "Settings", icon: Settings, href: "/dashboard/settings" },
    {
      id: 15,
      label: "Billing & Plans",
      icon: Wallet,
      href: "/dashboard/pricing",
    },
  ];
  // Helper to render the Tooltip Content
  const renderLockedTooltip = (props: any, label: string) => (
    <Tooltip id="locked-tooltip" {...props} className="custom-premium-tooltip">
      <div className="p-2 text-center">
        <p className="mb-2 text-xs opacity-90">
          The <strong>{label}</strong> is a premium feature. Upgrade your plan
          (Pro or Enterprise) to gain access.
        </p>
        {/* <Button
          variant="warning"
          size="sm"
          className="w-100 fw-bold upgrade-btn"
          onClick={() => router.push("/dashboard/pricing")}
        >
          Upgrade Now
        </Button>  */}
      </div>
    </Tooltip>
  );
  useEffect(() => {
    if (!sidebarRef.current) return;
    const sidebar = sidebarRef.current;
    if (isOpen) {
      gsap.to(sidebar, { x: 0, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(sidebar, { x: -300, duration: 0.4, ease: "power2.in" });
    }
  }, [isOpen]);
  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.set(sidebarRef.current, { x: -300 });
  }, []);

  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.to(sidebarRef.current, {
      x: isOpen ? 0 : -300,
      duration: 0.4,
      ease: "power2.inOut",
    });
    // console.log("subscription", currentPlan);
  }, [isOpen]);
  return (
    <>
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full bg-gradient-to-b from-[#1b2a49] to-[#152238] text-white z-50 flex flex-col border-r border-[#1f4c78] overflow-hidden"
        style={{ width: 300, transform: "translateX(-300px)" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#1f4c78] min-h-[76px] flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold whitespace-nowrap">
                BezMate-AI
              </h2>
              <p className="text-xs text-gray-300">Assistant</p>
            </div>
          </Link>
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg bg-[#1f4c78] flex items-center justify-center hover:bg-[#2c5a8a] transition-all duration-200"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            // If item is locked, wrap it with OverlayTrigger
            const content = (
              <div
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                  item.locked ? "locked-item" : "cursor-pointer"
                } ${isActive && !item.locked ? "bg-[#1f4c78]" : "hover:bg-[#1f4c78] hover:bg-opacity-50"}`}
              >
                <item.icon
                  className={`w-5 h-5 ${item.locked ? "opacity-40 grayscale" : item.color}`}
                />
                <span
                  className={`text-sm font-medium ${item.locked ? "text-gray-500" : ""}`}
                >
                  {item.label}
                </span>
                {item.locked && (
                  <div className="ml-auto flex items-center gap-2">
                    <span className="pro-badge">PRO</span>
                    <Lock size={12} className="text-gray-500" />
                  </div>
                )}
              </div>
            );

            if (item.locked) {
              return (
                <OverlayTrigger
                  key={item.id}
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) => renderLockedTooltip(props, item.label)}
                >
                  {content}
                </OverlayTrigger>
              );
            }

            return (
              <Link key={item.id} href={item.href}>
                {content}
              </Link>
            );
          })}
        </nav>

        {/* Secondary Items and Profile remain the same... */}
        <div className="p-4 border-t border-[#1f4c78] space-y-2 flex-shrink-0">
          {secondaryItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${pathname === item.href ? "bg-[#1f4c78]" : "hover:bg-[#1f4c78] hover:bg-opacity-50"}`}
            >
              <item.icon className="w-5 h-5 text-gray-300" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
