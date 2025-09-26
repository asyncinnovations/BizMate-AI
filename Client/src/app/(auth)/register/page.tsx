"use client";

import PublicLayout from "@/app/components/layout/PublicLayout";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Rocket,
  CheckCircle,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import TypeWriter from "@/app/components/type-writer/TypeWriter";

const RegisterPage = () => {
  const [showSelectBusiness, setShowSelectBusiness] = useState(true);
  const [businessType, setBusinessType] = useState<string | null>("Freelancer");

  const platformTexts = [
    "Ready to Transform Your Business?",
    "AI-Powered Growth Starts Here",
    "Smart Compliance, Smarter Business",
    "Join UAE's Leading Business Platform",
    "Automate. Grow. Succeed.",
  ];

  const businessOptions = [
    {
      label: "Freelancer",
      icon: <Briefcase className="w-4 h-4" />,
      description: "Perfect for individual professionals and consultants",
    },
    {
      label: "SME",
      icon: <Building2 className="w-4 h-4" />,
      description: "Ideal for small to medium-sized businesses",
    },
    {
      label: "Startup",
      icon: <Rocket className="w-4 h-4" />,
      description: "Built for fast-growing startup companies",
    },
  ];

  const handleBusinessTypeSelect = (type: string) => {
    setBusinessType(type);
    if (type === "Freelancer") {
      setShowSelectBusiness(true);
    } else {
      setShowSelectBusiness(false);
    }
  };

  const handleBack = () => {
    setShowSelectBusiness(true);
    setBusinessType("Freelancer");
  };

  const benefits = [
    {
      icon: <Shield className="w-4 h-4" />,
      text: "Bank-level security & data protection",
    },
    { icon: <Zap className="w-4 h-4" />, text: "Setup in under 5 minutes" },
    {
      icon: <Users className="w-4 h-4" />,
      text: "Dedicated UAE compliance expert",
    },
    {
      icon: <CheckCircle className="w-4 h-4" />,
      text: "Get started instantly",
    },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center w-full bg-gray-50 p-4 py-6">
        {/* Main Wrapper Section */}
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="relative flex flex-col lg:flex-row bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[550px]">
            {/* Left Side - Platform Branding */}
            <div className="lg:w-2/5 p-8 lg:p-12 bg-gradient-to-br from-[#1b2a49] via-[#2E69A4] to-[#162038]">
              <div className="h-full flex flex-col justify-start">
                {/* Logo */}
                <div className="flex items-center space-x-4 mb-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl font-bold text-white">AI</span>
                  </div>
                  <span className="text-white text-lg font-semibold tracking-wide">
                    BusinessAssistant
                  </span>
                </div>

                {/* Main Heading */}
                <div className="mb-6">
                  <TypeWriter texts={platformTexts} />
                  <p className="text-blue-200/80 text-sm leading-relaxed">
                    Join thousands of UAE businesses automating compliance,
                    invoicing, and customer communication with AI.
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-3 mb-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-white/5"
                    >
                      <div className="text-cyan-400 flex-shrink-0 text-lg">
                        {benefit.icon}
                      </div>
                      <span className="text-blue-100 text-sm">
                        {benefit.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-white font-semibold text-md lg:text-lg">
                      5,000+
                    </div>
                    <div className="text-blue-200 text-sm lg:text-base">
                      Businesses
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold text-md lg:text-lg">
                      99.9%
                    </div>
                    <div className="text-blue-200 text-sm lg:text-base">
                      Uptime
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold text-md lg:text-lg">
                      24/7
                    </div>
                    <div className="text-blue-200 text-sm lg:text-base">
                      Support
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="lg:w-3/5 p-6 lg:p-8">
              <div className="w-full">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Create Account
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Join the AI Business Assistant platform
                  </p>
                </div>

                <form className="space-y-4">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block mb-1 text-gray-700 text-sm font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1 text-gray-700 text-sm font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="business@company.ae"
                          className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-gray-700 text-sm font-medium">
                          Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="+971 XX XXX XXXX"
                          className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700 text-sm font-medium">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Create a strong password"
                        className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  {/* Back Button */}
                  {!showSelectBusiness && (
                    <div
                      className="flex items-center gap-2 cursor-pointer text-[#2E69A4] hover:text-[#1E4F7A] text-sm p-2 rounded-lg bg-blue-50"
                      onClick={handleBack}
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Choose different business type</span>
                    </div>
                  )}

                  {/* Business Type Selection */}
                  {showSelectBusiness && (
                    <div>
                      <label className="block mb-2 text-gray-700 text-sm font-medium">
                        Choose Business Type
                      </label>
                      <div className="space-y-2">
                        {businessOptions.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => handleBusinessTypeSelect(item.label)}
                            className={`border rounded-lg flex items-start p-3 cursor-pointer transition-all duration-200 ${
                              item.label === businessType
                                ? "border-[#2E69A4] bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div
                              className={`p-1 rounded mr-2 ${
                                item.label === businessType
                                  ? "bg-[#2E69A4] text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-800">
                                {item.label}
                              </div>
                              <div className="text-xs text-gray-600 mt-0.5">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Business Setup Information */}
                  {(businessType === "SME" || businessType === "Startup") && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <label className="block mb-2 text-gray-700 text-sm font-medium">
                        Business Information
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="text"
                          placeholder="Company Name"
                          className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Trade License Number"
                          className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] rounded-lg px-3 py-2 text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="VAT ID"
                            className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] rounded-lg px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Industry"
                            className="w-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms and Actions */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded border-gray-300"
                      />
                      <span className="text-xs text-gray-600">
                        I agree to the{" "}
                        <a href="#" className="text-[#2E69A4] hover:underline">
                          Terms
                        </a>{" "}
                        and
                        <a href="#" className="text-[#2E69A4] hover:underline">
                          {" "}
                          Privacy Policy
                        </a>
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-white bg-[#1b2a49] hover:bg-[#162038] font-medium"
                    >
                      Create Account
                    </button>

                    <div className="text-center text-sm text-gray-600">
                      <p>
                        Already have an account?{" "}
                        <Link
                          className="text-[#2E69A4] hover:underline font-medium"
                          href="/login"
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>

                {/* Security Assurance */}
                <div className="text-center pt-3 border-t border-gray-200 mt-4">
                  <div className="flex items-center justify-center space-x-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span>Secure</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>UAE Compliant</span>
                    </div>
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

export default RegisterPage;
