"use client";

import { Bell, Zap, Search, Settings } from "lucide-react";
import React, { useState } from "react";
import Sidebar from "./Sidebar";

const TopBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onToggle={handleToggle} />
      <div className="w-full min-h-[60px] flex px-4 py-3 items-center text-white justify-between bg-[#1b2a49] border-b border-[#2E69A4]">
        <div
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center cursor-pointer gap-3"
        >
          <span className="w-12 flex items-center justify-center h-12 rounded-xl bg-gradient-to-r from-[#2E69A4] to-cyan-500 p-2 shadow-lg">
            <Zap className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">BezMate AI</h1>
            <h4 className="text-gray-200 text-sm">
              Farhan Trading LLC • VAT: 123456789
            </h4>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative text-[#1B2A49]">
            <Search
              size={16}
              className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search invoices, clients, compliance..."
              className="w-80 pl-10 pr-4 py-2 text-sm border bg-white border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
            />
          </div>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-transparent transition hover:bg-[#1f4c78] cursor-pointer">
            <Bell size={22} />
            <span className="absolute top-0 right-0 text-xs w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border-2 border-[#1b2a49]">
              3
            </span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-transparent transition hover:bg-[#1f4c78] cursor-pointer">
            <Settings size={22} />
          </div>
          <div className="flex items-center gap-3 pl-3 border-l border-[#2E69A4]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold bg-gradient-to-r from-[#2E69A4] to-cyan-500">
              FA
            </div>
            <div>
              <h1 className="text-md font-semibold">Farhan Amjad</h1>
              <h2 className="text-sm text-gray-200">Owner • Premium Plan</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
