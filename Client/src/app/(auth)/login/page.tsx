"use client";

import PublicLayout from "@/app/components/layout/PublicLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { ShieldCheck, FileText, MessageSquare, Receipt } from "lucide-react";
import TypeWriter from "@/app/components/type-writer/TypeWriter";

const LoginPage = () => {
  const router = useRouter();

  const platformTexts = [
    "AI-Powered Business Assistant for SMEs",
    "Automate Compliance, Invoices & VAT",
    "Smart Reminders & WhatsApp Auto-Replies",
    "UAE's Smart Business Companion",
    "From Compliance to Conversations, AI-Driven",
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      text: "AI Compliance Assistant - UAE Regulations",
    },
    {
      icon: <Receipt className="w-5 h-5 text-cyan-400" />,
      text: "Smart Invoicing with VAT Automation",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-cyan-400" />,
      text: "WhatsApp & Instagram Auto-Replies",
    },
    {
      icon: <FileText className="w-5 h-5 text-cyan-400" />,
      text: "Document Generation & Reminder System",
    },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-start justify-center w-full bg-gray-50 p-4">
        {/* Main Wrapper Section */}
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="relative flex flex-col lg:flex-row bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Left Side - AI Platform Branding */}
            <div className="lg:w-2/5 p-8 lg:p-12 bg-gradient-to-br from-[#1b2a49] via-[#2E69A4] to-[#162038]">
              <div className="h-full flex flex-col justify-center">
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-xl font-bold text-white">AI</span>
                    </div>
                    <span className="text-white text-base font-semibold">
                      BusinessAssistant
                    </span>
                  </div>

                  <TypeWriter texts={platformTexts} />

                  <p className="text-blue-200/80 text-sm leading-relaxed">
                    Your intelligent partner for UAE business compliance,
                    invoicing, and customer communication. Powered by AI to save
                    you time and money.
                  </p>
                </div>

                {/* Platform Features */}
                <div className="space-y-3 mt-2">
                  {features.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg bg-white/5"
                    >
                      {item.icon}
                      <span className="text-blue-100 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-blue-200/60 text-xs">
                    Trusted by SMEs and startups across UAE • Arabic & English
                    Support • Free Zone Compliance Ready
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-3/5 p-6 lg:p-8">
              <div className="w-full">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Access Your Dashboard
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Sign in to your AI Business Assistant
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Input Fields */}
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block mb-2 text-gray-700 text-sm font-medium">
                        Email
                      </label>
                      <input
                        type="text"
                        placeholder="business@company.ae"
                        className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent rounded-lg px-4 py-2.5 text-sm transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-gray-700 text-sm font-medium">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent rounded-lg px-4 py-2.5 text-sm transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[#2E69A4] hover:underline font-medium transition-colors duration-200"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <button className="w-full py-2.5 px-4 text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-white bg-[#1b2a49] hover:bg-[#162038] font-medium">
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Secure Login
                      </span>
                    </button>

                    <button
                      onClick={() => router.push("/register")}
                      className="w-full py-2.5 px-4 text-sm rounded-lg border border-[#2E69A4] text-[#2E69A4] hover:bg-gray-50 bg-white transition-all duration-200 font-medium"
                    >
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Create Business Account
                      </span>
                    </button>
                  </div>

                  {/* Platform Status */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-3 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span>AI Services: Operational</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>UAE Compliance: Updated</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      Supporting English & Arabic • VAT 2024 Ready
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
