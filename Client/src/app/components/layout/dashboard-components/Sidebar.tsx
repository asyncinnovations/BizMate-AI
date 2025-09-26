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
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      id: "dashboard",
      label: "AI Dashboard",
      icon: Bot,
      color: "text-blue-400",
    },
    {
      id: "chat",
      label: "Compliance Assistant",
      icon: MessageSquare,
      color: "text-green-400",
    },
    {
      id: "invoices",
      label: "Smart Invoicing",
      icon: FileText,
      color: "text-purple-400",
    },
    {
      id: "reminders",
      label: "AI Reminders",
      icon: Calendar,
      color: "text-orange-400",
    },
    {
      id: "communication",
      label: "Auto-Reply Hub",
      icon: Mail,
      color: "text-pink-400",
    },
    {
      id: "documents",
      label: "Document Generator",
      icon: Zap,
      color: "text-yellow-400",
    },
    {
      id: "analytics",
      label: "Business Analytics",
      icon: BarChart,
      color: "text-cyan-400",
    },
    {
      id: "team",
      label: "Team Management",
      icon: Users,
      color: "text-indigo-400",
    },
  ];

  const secondaryItems = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "help", label: "AI Help Center", icon: HelpCircle },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "billing", label: "Billing & Plans", icon: Wallet },
  ];

  // GSAP Animations
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

  // Hover animation for menu items
  const handleItemHover = (element: HTMLElement) => {
    gsap.to(element, {
      x: 4,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleItemLeave = (element: HTMLElement) => {
    gsap.to(element, {
      x: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleItemClick = (itemId: string, element: HTMLElement) => {
    setActiveItem(itemId);

    // Click animation
    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  };

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold whitespace-nowrap">
                BezMate-AI
              </h2>
              <p className="text-xs text-gray-300">Assistant</p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg bg-[#1f4c78] flex items-center justify-center hover:bg-[#2c5a8a] transition-colors"
            onMouseEnter={(e) => handleItemHover(e.currentTarget)}
            onMouseLeave={(e) => handleItemLeave(e.currentTarget)}
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
            <button
              key={item.id}
              onClick={(e) => handleItemClick(item.id, e.currentTarget)}
              onMouseEnter={(e) => handleItemHover(e.currentTarget)}
              onMouseLeave={(e) => handleItemLeave(e.currentTarget)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                activeItem === item.id
                  ? "bg-gradient-to-r from-[#1f4c78] to-[#2c5a8a] shadow-lg"
                  : "hover:bg-[#1f4c78] hover:bg-opacity-50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Secondary Navigation */}
        <div className="p-4 border-t border-[#1f4c78] space-y-2 flex-shrink-0">
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              onMouseEnter={(e) => handleItemHover(e.currentTarget)}
              onMouseLeave={(e) => handleItemLeave(e.currentTarget)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#1f4c78] hover:bg-opacity-50 transition-all duration-200"
            >
              <item.icon className="w-5 h-5 text-gray-300" />
              <span className="text-sm font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* User Profile Mini */}
        <div className="p-4 border-t border-[#1f4c78] flex-shrink-0">
          <div
            className="flex items-center gap-3 p-2 rounded-xl transition-colors duration-200 hover:bg-[#1f4c78] hover:bg-opacity-50"
            onMouseEnter={(e) => handleItemHover(e.currentTarget)}
            onMouseLeave={(e) => handleItemLeave(e.currentTarget)}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
