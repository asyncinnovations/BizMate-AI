"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Globe,
  Building2,
  FileText,
  Hash,
  MapPin,
  Briefcase,
  Calendar,
  Crown,
  Shield,
  ChevronRight,
  Upload,
  Edit3,
  Camera,
  CheckCircle,
  UserRound,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/page-header/PageHeader";
import BusinessInfo from "@/components/business-info/BusinessInfo";

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");

  // Sample user data
  const [userData, setUserData] = useState({
    name: "Ahmed Hassan",
    email: "ahmed.hassan@business.ae",
    phone: "+971 50 123 4567",
    role: "Business Owner",
    language: "English",
    businessName: "Digital Solutions LLC",
    tradeLicense: "CN-1234567",
    vatNumber: "100123456700003",
    industry: "Information Technology",
    businessType: "SME",
    address: "Dubai Silicon Oasis, Dubai, UAE",
    plan: "Premium",
    memberSince: "January 2024",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setProfileImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const InfoCard = ({
    title,
    icon: Icon,
    children,
    className = "",
  }: {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-[#E1E8F5] p-6 hover:shadow-md transition-all duration-300 ${className}`}
    >
      <h2 className="text-lg font-semibold text-[#1B2A49] flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-[#2E69A4]" />
        {title}
      </h2>
      {children}
    </div>
  );

  const InfoField = ({
    label,
    value,
    icon: Icon,
    editable = false,
  }: {
    label: string;
    value: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    editable: boolean;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#344767]">{label}</label>
      <div className="flex items-center gap-3 p-3 bg-[#F4F7FA] rounded-lg">
        <Icon className="w-4 h-4 text-[#2E69A4] flex-shrink-0" />
        {isEditing && editable ? (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              setUserData({
                ...userData,
                [label.toLowerCase().replace(" ", "")]: e.target.value,
              })
            }
            className="flex-1 bg-transparent border-none focus:outline-none text-[#1B2A49]"
          />
        ) : (
          <span className="text-[#344767]">{value}</span>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F4F7FA] p-4 mb-8">
        <div className="w-full">
          {/* Header */}
          <PageHeader
            title="Profile"
            icon={<UserRound size={24} />}
            description="Manage your identity and business information"
            buttons={[
              {
                text: isEditing ? "Save Changes" : "Edit Profile",
                onClick: () => setIsEditing(!isEditing),
                icon: <Edit3 className="w-4 h-4" />,
              },
            ]}
          />

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-[#E1E8F5] p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      )}
                    </div>
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-[#1B2A49] text-white p-2 rounded-full cursor-pointer hover:bg-[#2E69A4] transition-colors shadow-lg"
                    >
                      <Camera className="w-3 h-3" />
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <h3 className="font-semibold text-[#1B2A49]">
                    {userData.name}
                  </h3>
                  <p className="text-sm text-[#344767]">{userData.role}</p>
                  <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm mt-2">
                    <Crown className="w-3 h-3" />
                    {userData.plan} Plan
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "personal", label: "Personal Info", icon: User },
                    {
                      id: "business",
                      label: "Business Info",
                      icon: Building2,
                    },
                    { id: "account", label: "Account", icon: Crown },
                    { id: "security", label: "Security", icon: Shield },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        activeSection === item.id
                          ? "bg-[#F4F7FA] text-[#2E69A4] border border-[#E1E8F5]"
                          : "text-[#344767] hover:bg-[#F4F7FA]"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Personal Information */}
              {activeSection === "personal" && (
                <InfoCard title="Personal Information" icon={User}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoField
                      label="Full Name"
                      value={userData.name}
                      icon={User}
                      editable
                    />
                    <InfoField
                      label="Email Address"
                      value={userData.email}
                      icon={Mail}
                      editable
                    />
                    <InfoField
                      label="Phone Number"
                      value={userData.phone}
                      icon={Phone}
                      editable
                    />
                    <InfoField
                      label="Role"
                      value={userData.role}
                      icon={Briefcase}
                      editable
                    />
                    <InfoField
                      label="Language Preference"
                      value={userData.language}
                      icon={Globe}
                      editable
                    />
                  </div>
                </InfoCard>
              )}

              {/* Business Information */}
              {activeSection === "business" && <BusinessInfo />}

              {/* Account Summary */}
              {activeSection === "account" && (
                <div className="space-y-6">
                  <InfoCard title="Account Summary" icon={Crown}>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-sm font-medium text-[#344767] mb-3 block">
                          Current Plan
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-2 bg-[#F6A821] text-white px-4 py-3 rounded-lg font-semibold shadow-lg">
                            <Crown className="w-4 h-4" />
                            {userData.plan}
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-sm text-[#344767] mt-2">
                          Active until December 2024
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[#344767] mb-2 block">
                          Member Since
                        </label>
                        <div className="flex items-center gap-2 text-[#344767] p-3 bg-[#F4F7FA] rounded-lg">
                          <Calendar className="w-4 h-4 text-[#2E69A4]" />
                          <span>{userData.memberSince}</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-xl hover:shadow-lg transition-all">
                      <div className="text-left">
                        <p className="font-semibold">Upgrade Your Plan</p>
                        <p className="text-sm text-gray-300">
                          Get access to premium features
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </InfoCard>

                  <InfoCard title="Billing Information" icon={FileText}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-[#F4F7FA] rounded-lg">
                        <div>
                          <p className="font-medium text-[#1B2A49]">
                            Next Billing
                          </p>
                          <p className="text-sm text-[#344767]">
                            December 15, 2024
                          </p>
                        </div>
                        <span className="font-semibold text-[#1B2A49]">
                          $99.00
                        </span>
                      </div>
                      <button className="w-full p-4 border-2 border-dashed border-[#E1E8F5] rounded-xl text-center hover:border-[#2E69A4] hover:bg-[#F4F7FA] transition-colors">
                        <p className="font-medium text-[#1B2A49]">
                          View Billing History
                        </p>
                        <p className="text-sm text-[#344767] mt-1">
                          Download invoices and receipts
                        </p>
                      </button>
                    </div>
                  </InfoCard>
                </div>
              )}

              {/* Security */}
              {activeSection === "security" && (
                <InfoCard title="Security Settings" icon={Shield}>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-6 bg-[#F4F7FA] rounded-xl hover:bg-[#E1E8F5] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#F4F7FA] rounded-lg">
                          <Shield className="w-5 h-5 text-[#2E69A4]" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-[#1B2A49]">
                            Change Password
                          </p>
                          <p className="text-sm text-[#344767]">
                            Update your account password regularly
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#344767] group-hover:text-[#1B2A49]" />
                    </button>

                    <button className="w-full flex items-center justify-between p-6 bg-[#F4F7FA] rounded-xl hover:bg-[#E1E8F5] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#F4F7FA] rounded-lg">
                          <Shield className="w-5 h-5 text-[#2E69A4]" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-[#1B2A49]">
                            Two-Factor Authentication
                          </p>
                          <p className="text-sm text-[#344767]">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#F6A821] font-medium">
                          Not Enabled
                        </span>
                        <ChevronRight className="w-5 h-5 text-[#344767] group-hover:text-[#1B2A49]" />
                      </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-6 bg-[#F4F7FA] rounded-xl hover:bg-[#E1E8F5] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#F4F7FA] rounded-lg">
                          <User className="w-5 h-5 text-[#2E69A4]" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-[#1B2A49]">
                            Login Activity
                          </p>
                          <p className="text-sm text-[#344767]">
                            Review recent account activity and devices
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#344767] group-hover:text-[#1B2A49]" />
                    </button>
                  </div>
                </InfoCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
