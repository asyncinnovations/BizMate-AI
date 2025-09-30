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
} from "lucide-react";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const menuItems = [
    {
      id: 1,
      label: "AI Dashboard",
      icon: Bot,
      color: "text-blue-400",
      href: "/dashboard",
    },
    {
      id: 2,
      label: "Compliance Assistant",
      icon: MessageSquare,
      color: "text-green-400",
      href: "/dashboard/ai-chat",
    },
    {
      id: 3,
      label: "Smart Invoicing",
      icon: FileText,
      color: "text-purple-400",
      href: "/dashboard/invoicing",
    },
    {
      id: 4,
      label: "AI Reminders",
      icon: Calendar,
      color: "text-orange-400",
      href: "/dashboard/reminders",
    },
    {
      id: 5,
      label: "Auto-Reply Hub",
      icon: Mail,
      color: "text-pink-400",
      href: "/dashboard/communication",
    },
    {
      id: 6,
      label: "Document Generator",
      icon: Zap,
      color: "text-yellow-400",
      href: "/dashboard/documents",
    },
    {
      id: 7,
      label: "Business Analytics",
      icon: BarChart,
      color: "text-cyan-400",
      href: "/dashboard/analytics",
    },
    {
      id: 8,
      label: "Team Management",
      icon: Users,
      color: "text-indigo-400",
      href: "/dashboard/team",
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
      id: 12,
      label: "AI Help Center",
      icon: HelpCircle,
      href: "/dashboard/help",
    },
    {
      id: 13,
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
    {
      id: 14,
      label: "Billing & Plans",
      icon: Wallet,
      href: "/dashboard/billing",
    },
  ];

  // GSAP Animations for sidebar
  useEffect(() => {
    if (!sidebarRef.current) return;

    const sidebar = sidebarRef.current;

    if (isOpen) {
      // Slide sidebar in
      gsap.to(sidebar, {
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      // Slide sidebar out completely
      gsap.to(sidebar, {
        x: -300,
        duration: 0.4,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full bg-gradient-to-b from-[#1b2a49] to-[#152238] text-white z-50 flex flex-col border-r border-[#1f4c78] overflow-hidden"
        style={{ width: 300, transform: "translateX(-300px)" }}
      >
        {/* Logo Section */}
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
            className="w-8 h-8 rounded-lg bg-[#1f4c78] flex items-center justify-center hover:bg-[#2c5a8a] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Custom scrollbar styling */}
          <style jsx>{`
            .overflow-y-auto::-webkit-scrollbar {
              width: 4px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: #f4f7fa;
              border-radius: 10px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: #2c5a8a;
              border-radius: 10px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: #3a689a;
            }
          `}</style>

          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                pathname === item.href
                  ? "bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] shadow-lg"
                  : "hover:bg-[#1f4c78] hover:bg-opacity-50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-medium whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Secondary Navigation */}
        <div className="p-4 border-t border-[#1f4c78] space-y-2 flex-shrink-0">
          {secondaryItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                pathname === item.href
                  ? "bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] shadow-lg"
                  : "hover:bg-[#1f4c78] hover:bg-opacity-50"
              }`}
            >
              <item.icon className="w-5 h-5 text-gray-300" />
              <span className="text-sm font-medium whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* User Profile Mini */}
        <div className="p-4 border-t border-[#1f4c78] flex-shrink-0">
          <Link
            href="/profile"
            className="flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-[#1f4c78] hover:bg-opacity-50 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] flex items-center justify-center text-sm font-semibold">
              FA
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium whitespace-nowrap">
                Farhan Amjad
              </p>
              <p className="text-xs text-gray-300 whitespace-nowrap">Owner</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
