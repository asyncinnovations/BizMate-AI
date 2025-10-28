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
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import TypeWriter from "@/app/components/type-writer/TypeWriter";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/ui/InputField";
import Button from "@/app/components/ui/Button";

const RegisterPage = () => {
  const [showSelectBusiness, setShowSelectBusiness] = useState(true);
  const router = useRouter();
  const [businessType, setBusinessType] = useState<string | null>("Freelancer");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    company_name: "",
    license_number: "",
    vat_id: "",
    idustry: "",
    role: "business_owner", //default
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form data", formData);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        formData
      );

      console.log("SignUp Successfully!", response);

      if (response.status === 201) {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Signup failed! Please check your details and try again.");
      console.log("Error occur while signup", error);
    }
  };

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
    <div
      style={{ backgroundImage: "url('/login_background.jpg')" }}
      className="min-h-screen bg-center bg-cover bg-no-repeat flex items-center justify-center w-full bg-gray-50 p-4 py-6"
    >
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <InputField
                      label="Full Name"
                      value={formData.full_name}
                      name="full_name"
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Email"
                      value={formData.email}
                      type="email"
                      name="email"
                      onChange={handleChange}
                      placeholder="business@company.ae"
                    />
                    <InputField
                      label="Phone"
                      value={formData.phone}
                      type="tel"
                      name="phone"
                      onChange={handleChange}
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                  <InputField
                    label="Password"
                    value={formData.password}
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Create a strong password"
                  />
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
                      <InputField
                        value={formData.company_name}
                        type="text"
                        name="company_name"
                        onChange={handleChange}
                        placeholder="Company Name"
                      />
                      <InputField
                        value={formData.license_number}
                        type="text"
                        name="license_number"
                        onChange={handleChange}
                        placeholder="Trade License Number"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <InputField
                          value={formData.vat_id}
                          type="text"
                          name="vat_id"
                          onChange={handleChange}
                          placeholder="VAT ID"
                        />
                        <InputField
                          type="text"
                          value={formData.idustry}
                          name="idustry"
                          onChange={handleChange}
                          placeholder="Industry"
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

                  <Button
                    className="w-full"
                    type="submit"
                    startIcon={<UserPlus size={18} />}
                  >
                    Create Account
                  </Button>

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
  );
};

export default RegisterPage;
