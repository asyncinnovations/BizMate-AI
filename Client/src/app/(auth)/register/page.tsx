"use client";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Rocket,
  CheckCircle,
  Shield,
  Zap,
  Users,
  UserPlus,
  Lock,
} from "lucide-react";
import Link from "next/link";
import React, { useState, ChangeEvent, FormEvent } from "react";
import TypeWriter from "@/components/type-writer/TypeWriter";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormError {
  full_name: string;
  email: string;
  password: string;
  phone: string;
}

interface FormData {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  company_name: string;
  license_number: string;
  vat_id: string;
  idustry: string;
  role: string;
  company_size: string;
  business_location: string;
}

interface BusinessOption {
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface Benefit {
  icon: React.ReactNode;
  text: string;
}

interface AuthResponse {
  token?: string;
  user?: Record<string, unknown>;
}

// ─── Option Lists ─────────────────────────────────────────────────────────────

const countryOptions = [
  { value: "AE", label: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "QA", label: "Qatar" },
  { value: "KW", label: "Kuwait" },
  { value: "BH", label: "Bahrain" },
  { value: "OM", label: "Oman" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "IN", label: "India" },
  { value: "PK", label: "Pakistan" },
  { value: "PH", label: "Philippines" },
  { value: "EG", label: "Egypt" },
  { value: "JO", label: "Jordan" },
  { value: "LB", label: "Lebanon" },
  { value: "OTHER", label: "Other" },
];

const industryOptions = [
  { value: "technology", label: "Technology & IT" },
  { value: "design", label: "Design & Creative" },
  { value: "marketing", label: "Marketing & Advertising" },
  { value: "consulting", label: "Consulting & Advisory" },
  { value: "finance", label: "Finance & Accounting" },
  { value: "legal", label: "Legal & Compliance" },
  { value: "healthcare", label: "Healthcare & Medical" },
  { value: "education", label: "Education & Training" },
  { value: "construction", label: "Construction & Engineering" },
  { value: "media", label: "Media & Entertainment" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

const startupSizeOptions = [
  { value: "1-5", label: "1 – 5 employees" },
  { value: "6-10", label: "6 – 10 employees" },
  { value: "11-25", label: "11 – 25 employees" },
  { value: "26-50", label: "26 – 50 employees" },
  { value: "51-100", label: "51 – 100 employees" },
  { value: "100+", label: "100+ employees" },
];

const smeSizeOptions = [
  { value: "1-10", label: "1 – 10 employees" },
  { value: "11-50", label: "11 – 50 employees" },
  { value: "51-100", label: "51 – 100 employees" },
  { value: "101-250", label: "101 – 250 employees" },
  { value: "251-500", label: "251 – 500 employees" },
  { value: "500+", label: "500+ employees" },
];

const businessLocationOptions = [
  { value: "free_zone", label: "Free Zone" },
  { value: "mainland", label: "Mainland" },
];

const TOTAL_STEPS = 4;

// ─── Component ────────────────────────────────────────────────────────────────

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [businessType, setBusinessType] = useState<string>("Freelancer");
  const [errors, setErrors] = useState<Partial<FormError>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    company_name: "",
    license_number: "",
    vat_id: "",
    idustry: "",
    role: "business_owner",
    company_size: "",
    business_location: "",
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormError]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Per-step validation
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormError> = {};

    if (step === 1) {
      if (!formData.full_name.trim())
        newErrors.full_name = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    if (step === 4) {
      if (!formData.password.trim())
        newErrors.password = "Password is required";
      else if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = (): void => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        { ...formData, businessType },
      );
      if (response.status === 201) {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string; error?: string }>;
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Signup failed! Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Left Panel Data ────────────────────────────────────────────────────────

  const platformTexts: string[] = [
    "Ready to Transform Your Business?",
    "AI-Powered Growth Starts Here",
    "Smart Compliance, Smarter Business",
    "Join UAE's Leading Business Platform",
    "Automate. Grow. Succeed.",
  ];

  const businessOptions: BusinessOption[] = [
    {
      label: "Freelancer",
      icon: <Briefcase className="w-4 h-4" />,
      description: "Individual professionals & consultants",
    },
    {
      label: "Startup",
      icon: <Rocket className="w-4 h-4" />,
      description: "Fast-growing startup companies",
    },
    {
      label: "SME",
      icon: <Building2 className="w-4 h-4" />,
      description: "Small to medium-sized businesses",
    },
  ];

  const benefits: Benefit[] = [
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{ backgroundImage: "url('/login_background.jpg')" }}
      className="min-h-screen bg-center bg-cover bg-no-repeat flex items-center justify-center w-full p-4 py-6"
    >
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="relative flex flex-col lg:flex-row bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
          {/* ──────────────── Left Panel ──────────────── */}
          <div className="lg:w-2/5 px-8 py-10 bg-gradient-to-br from-[#1b2a49] via-[#2E69A4] to-[#162038] flex flex-col justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-sm font-bold text-white">AI</span>
              </div>
              <span className="text-white text-base font-semibold tracking-wide">
                BusinessAssistant
              </span>
            </div>

            {/* Heading + description */}
            <div className="mb-7">
              <TypeWriter texts={platformTexts} />
              <p className="text-blue-200/75 text-sm leading-relaxed mt-2">
                Join thousands of UAE businesses automating compliance,
                invoicing, and customer communication with AI.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-cyan-400">
                    {benefit.icon}
                  </div>
                  <span className="text-blue-100/90 text-sm">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-5 border-t border-white/15">
              {[
                { value: "5,000+", label: "Businesses" },
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-white font-bold text-base">
                    {stat.value}
                  </div>
                  <div className="text-blue-300/80 text-xs mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ──────────────── Right Panel ──────────────── */}
          <div className="lg:w-3/5 flex flex-col">
            {/* ── Top Header ── */}
            <div className="px-8 pt-7 pb-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Create Account
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Already have one?{" "}
                  <Link
                    href="/login"
                    className="text-[#2E69A4] hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* ── Step Indicator ── */}
            {(() => {
              const steps = [
                { id: 1, label: "Account" },
                { id: 2, label: "Location" },
                { id: 3, label: "Business" },
                { id: 4, label: "Security" },
              ];
              return (
                <div className="px-8 pt-5 pb-1">
                  <div className="flex items-start">
                    {steps.map((step, idx) => {
                      const isDone = currentStep > step.id;
                      const isActive = currentStep === step.id;
                      const isLast = idx === steps.length - 1;
                      return (
                        <div
                          key={step.id}
                          className="flex items-start flex-1 last:flex-none"
                        >
                          {/* Circle + label */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${
                                isDone
                                  ? "bg-[#2E69A4] border-[#2E69A4] text-white"
                                  : isActive
                                    ? "bg-white border-[#2E69A4] text-[#2E69A4] shadow-sm"
                                    : "bg-white border-gray-200 text-gray-400"
                              }`}
                            >
                              {isDone ? (
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >
                                  <path
                                    d="M2 6l3 3 5-5"
                                    stroke="white"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                step.id
                              )}
                            </div>
                            <span
                              className={`text-xs mt-1.5 font-medium whitespace-nowrap transition-colors duration-300 ${
                                isActive
                                  ? "text-[#2E69A4]"
                                  : isDone
                                    ? "text-gray-500"
                                    : "text-gray-300"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                          {/* Connector line */}
                          {!isLast && (
                            <div className="flex-1 mt-4 mx-2 h-px overflow-hidden bg-gray-200">
                              <div
                                className="h-full bg-[#2E69A4] transition-all duration-500 ease-out"
                                style={{ width: isDone ? "100%" : "0%" }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ── Form ── */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col px-8 pt-5 pb-8"
            >
              {/* Step heading */}
              <div className="mb-6">
                {currentStep === 1 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-800">
                      Personal Information
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Tell us a little about yourself
                    </p>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-800">
                      Your Location
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Where are you based?
                    </p>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-800">
                      Business Profile
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Help us tailor your experience
                    </p>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-800">
                      Secure Your Account
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Create a strong password to protect your account
                    </p>
                  </>
                )}
              </div>

              {/* ── Step 1 — Personal Info ── */}
              {currentStep === 1 && (
                <div className="space-y-4 flex-1">
                  <InputField
                    label="Full Name"
                    value={formData.full_name}
                    name="full_name"
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter your full name"
                    error={errors.full_name}
                    required
                  />
                  <InputField
                    label="Email Address"
                    value={formData.email}
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="business@company.ae"
                    error={errors.email}
                    required
                  />
                  <InputField
                    label="Phone Number"
                    value={formData.phone}
                    type="tel"
                    name="phone"
                    onChange={handleChange}
                    placeholder="+971 XX XXX XXXX"
                    error={errors.phone}
                    required
                  />
                </div>
              )}

              {/* ── Step 2 — Location ── */}
              {currentStep === 2 && (
                <div className="flex-1">
                  <SelectField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    options={countryOptions}
                    placeholder="Select your country"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    Your country helps us apply the correct compliance rules,
                    tax regulations, and invoice templates for your region.
                  </p>
                </div>
              )}

              {/* ── Step 3 — Business Type ── */}
              {currentStep === 3 && (
                <div className="flex-1 space-y-5">
                  {/* Business type cards */}
                  <div>
                    <label className="block mb-2 text-text-secondary text-sm font-medium">
                      Business Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {businessOptions.map((item) => (
                        <div
                          key={item.label}
                          onClick={() => setBusinessType(item.label)}
                          className={`border-2 rounded-xl p-3 cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-2 ${
                            item.label === businessType
                              ? "border-[#2E69A4] bg-blue-50 shadow-sm shadow-blue-100"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                              item.label === businessType
                                ? "bg-[#2E69A4] text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <div
                              className={`font-semibold text-sm ${item.label === businessType ? "text-[#2E69A4]" : "text-gray-700"}`}
                            >
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Freelancer extra fields ── */}
                  {businessType === "Freelancer" && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <SelectField
                        label="Industry"
                        name="idustry"
                        value={formData.idustry}
                        onChange={handleChange}
                        options={industryOptions}
                        placeholder="Select your industry"
                      />
                    </div>
                  )}

                  {/* ── Startup extra fields ── */}
                  {businessType === "Startup" && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InputField
                          label="Company Name"
                          value={formData.company_name}
                          type="text"
                          name="company_name"
                          onChange={handleChange}
                          placeholder="Acme Inc."
                        />
                        <InputField
                          label="Trade License No."
                          value={formData.license_number}
                          type="text"
                          name="license_number"
                          onChange={handleChange}
                          placeholder="TL-XXXXXXXX"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <SelectField
                          label="Company Size"
                          name="company_size"
                          value={formData.company_size}
                          onChange={handleChange}
                          options={startupSizeOptions}
                          placeholder="No. of employees"
                        />
                        <SelectField
                          label="Business Location"
                          name="business_location"
                          value={formData.business_location}
                          onChange={handleChange}
                          options={businessLocationOptions}
                          placeholder="Free Zone / Mainland"
                        />
                      </div>
                      <InputField
                        label="VAT ID"
                        value={formData.vat_id}
                        type="text"
                        name="vat_id"
                        onChange={handleChange}
                        placeholder="VAT Registration Number"
                      />
                    </div>
                  )}

                  {/* ── SME extra fields ── */}
                  {businessType === "SME" && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InputField
                          label="Company Name"
                          value={formData.company_name}
                          type="text"
                          name="company_name"
                          onChange={handleChange}
                          placeholder="Acme Ltd."
                        />
                        <InputField
                          label="Trade License No."
                          value={formData.license_number}
                          type="text"
                          name="license_number"
                          onChange={handleChange}
                          placeholder="TL-XXXXXXXX"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <SelectField
                          label="Company Size"
                          name="company_size"
                          value={formData.company_size}
                          onChange={handleChange}
                          options={smeSizeOptions}
                          placeholder="No. of employees"
                        />
                        <SelectField
                          label="Business Location"
                          name="business_location"
                          value={formData.business_location}
                          onChange={handleChange}
                          options={businessLocationOptions}
                          placeholder="Free Zone / Mainland"
                        />
                      </div>
                      <InputField
                        label="VAT ID"
                        value={formData.vat_id}
                        type="text"
                        name="vat_id"
                        onChange={handleChange}
                        placeholder="VAT Registration Number"
                      />
                      <SelectField
                        label="Industry"
                        name="idustry"
                        value={formData.idustry}
                        onChange={handleChange}
                        options={industryOptions}
                        placeholder="Select your industry"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 4 — Password ── */}
              {currentStep === 4 && (
                <div className="flex-1 space-y-4">
                  <InputField
                    label="Password"
                    value={formData.password}
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Create a strong password (min. 8 chars)"
                    error={errors.password}
                    required
                  />

                  {/* Password strength indicator */}
                  {formData.password.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => {
                          const strength = Math.min(
                            4,
                            Math.floor(
                              (formData.password.length >= 8 ? 1 : 0) +
                                (/[A-Z]/.test(formData.password) ? 1 : 0) +
                                (/[0-9]/.test(formData.password) ? 1 : 0) +
                                (/[^A-Za-z0-9]/.test(formData.password)
                                  ? 1
                                  : 0),
                            ),
                          );
                          return (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                level <= strength
                                  ? strength <= 1
                                    ? "bg-red-400"
                                    : strength <= 2
                                      ? "bg-yellow-400"
                                      : strength <= 3
                                        ? "bg-blue-400"
                                        : "bg-green-400"
                                  : "bg-gray-200"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-400">
                        Use 8+ characters, uppercase, numbers, and symbols for a
                        strong password.
                      </p>
                    </div>
                  )}

                  {/* Terms */}
                  <div className="flex items-start space-x-2 pt-1">
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded border-gray-300 accent-[#2E69A4]"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-[#2E69A4] hover:underline font-medium"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-[#2E69A4] hover:underline font-medium"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </div>
                </div>
              )}

              {/* ── Navigation Buttons ── */}
              <div className="pt-6 mt-auto">
                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <ArrowLeft size={15} />
                      Back
                    </button>
                  )}

                  {currentStep < TOTAL_STEPS ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2E69A4] hover:bg-[#1E4F7A] rounded-lg transition-colors duration-200"
                    >
                      Continue
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2E69A4] hover:bg-[#1E4F7A] rounded-lg transition-colors duration-200"
                      type="submit"
                    >
                      <span>
                        {isSubmitting ? undefined : <UserPlus size={16} />}
                      </span>
                      {isSubmitting ? "Creating Account…" : "Create Account"}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* ── Security Footer ── */}
            <div className="px-8 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-500" />
                <span>SSL Secured</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>UAE Compliant</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-green-500" />
                <span>Data Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
