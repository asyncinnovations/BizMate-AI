"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import {
  ShieldCheck,
  FileText,
  MessageSquare,
  Receipt,
  CheckCircle,
  Plus,
} from "lucide-react";
import TypeWriter from "@/components/type-writer/TypeWriter";
import { useAuth } from "@/context/AuthContext";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

interface FormError {
  email: string;
  password: string;
}

interface FormData {
  email: string;
  password: string;
}

interface PlatformFeature {
  icon: React.ReactNode;
  text: string;
}

interface AuthResponse {
  token: string;
  user: Record<string, unknown>;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormError | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormError = {
      email: "",
      password: "",
    };

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid!";
    }

    if (!formData.password?.trim()) {
      newErrors.password = "Password is required!";
    }

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((err) => err === "");
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    const sanitizedValue = value.trim();
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Clear error when user starts typing - FIXED TYPE ERROR
    if (errors && errors[name as keyof FormError]) {
      setErrors((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [name]: "",
        };
      });
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        formData
      );

      if (response.status === 200) {
        toast.success("Login successful! Redirecting to your dashboard…");
        login(response.data.token, response.data.user);
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.log("Error while logged in", error);

      const err = error as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed! Please check your credentials.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const platformTexts: string[] = [
    "AI-Powered Business Assistant for SMEs",
    "Automate Compliance, Invoices & VAT",
    "Smart Reminders & WhatsApp Auto-Replies",
    "UAE's Smart Business Companion",
    "From Compliance to Conversations, AI-Driven",
  ];

  const features: PlatformFeature[] = [
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
    <div
      style={{
        backgroundImage: "url('/login_background.jpg')",
      }}
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center w-full bg-gray-50"
    >
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

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Input Fields */}
                <div className="flex flex-col gap-5">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="business@company.ae"
                    error={errors?.email}
                  />
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="Enter your password"
                    error={errors?.password}
                  />
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
                  <Button
                    startIcon={<CheckCircle size={18} />}
                    disabled={isLoading}
                    loading={isLoading}
                    type="submit"
                  >
                    Secure Login
                  </Button>
                  <Button
                    startIcon={<Plus size={18} />}
                    variant="secondary"
                    type="button"
                    onClick={() => router.push("/register")}
                  >
                    Create Business Account
                  </Button>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
