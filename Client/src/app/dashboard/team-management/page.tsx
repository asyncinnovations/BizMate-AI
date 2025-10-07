"use client";
import React, { useState, ChangeEvent } from "react";
import {
  Users,
  UserPlus,
  Settings,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Brain,
  BarChart3,
  MessageSquare,
  FileText,
  Database,
  Wand2,
} from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import PageHeader from "@/app/components/page-header/PageHeader";

// Type definitions
interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: "active" | "away" | "offline";
  lastActive: string;
  joinDate: string;
  permissions: string[];
  phone?: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Invitation {
  id: number;
  email: string;
  role: string;
  sentDate: string;
  expiresDate: string;
  status: "pending" | "accepted" | "expired";
}

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState<string>("members");
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showPermissionsModal, setShowPermissionsModal] =
    useState<boolean>(false);
  const [inviteStep, setInviteStep] = useState<number>(1);
  const [newMember, setNewMember] = useState({
    email: "",
    role: "",
    permissions: [] as string[],
  });

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Ahmed Mansouri",
      email: "ahmed@business.ae",
      role: "Business Owner",
      avatar: "👨‍💼",
      status: "active",
      lastActive: "2 hours ago",
      joinDate: "2024-01-15",
      permissions: ["all"],
      phone: "+971 50 123 4567",
    },
    {
      id: 2,
      name: "Fatima Khan",
      email: "fatima@business.ae",
      role: "Accountant",
      avatar: "👩‍💻",
      status: "active",
      lastActive: "30 minutes ago",
      joinDate: "2024-01-20",
      permissions: ["invoicing", "reports", "compliance"],
      phone: "+971 55 234 5678",
    },
    {
      id: 3,
      name: "Omar Hassan",
      email: "omar@business.ae",
      role: "Sales Manager",
      avatar: "👨‍💼",
      status: "away",
      lastActive: "5 hours ago",
      joinDate: "2024-01-25",
      permissions: ["communication", "invoicing"],
    },
    {
      id: 4,
      name: "Sara Mohammed",
      email: "sara@business.ae",
      role: "Marketing Assistant",
      avatar: "👩‍🎨",
      status: "offline",
      lastActive: "1 day ago",
      joinDate: "2024-02-01",
      permissions: ["communication"],
    },
  ];

  const pendingInvites: Invitation[] = [
    {
      id: 1,
      email: "khalid@business.ae",
      role: "Support Specialist",
      sentDate: "2024-02-10",
      expiresDate: "2024-02-17",
      status: "pending",
    },
  ];

  const permissionOptions: Permission[] = [
    {
      id: "ai_chat",
      name: "AI Chat Access",
      description: "Access to compliance Q&A and business advice",
      icon: <MessageSquare size={16} />,
    },
    {
      id: "invoicing",
      name: "Invoicing",
      description: "Create and manage invoices with VAT calculation",
      icon: <FileText size={16} />,
    },
    {
      id: "communication",
      name: "Communication Hub",
      description: "Manage WhatsApp/Instagram auto-replies",
      icon: <MessageSquare size={16} />,
    },
    {
      id: "reports",
      name: "Reports & Analytics",
      description: "View business insights and financial reports",
      icon: <BarChart3 size={16} />,
    },
    {
      id: "documents",
      name: "Document Generator",
      description: "Create contracts and legal documents",
      icon: <FileText size={16} />,
    },
    {
      id: "compliance",
      name: "Compliance Reminders",
      description: "Manage VAT filing and license renewals",
      icon: <Shield size={16} />,
    },
  ];

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePermissionToggle = (permissionId: string) => {
    setNewMember((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSendInvite = () => {
    if (newMember.email && newMember.role) {
      // In a real app, this would call an API
      setShowInviteModal(false);
      setInviteStep(1);
      setNewMember({ email: "", role: "", permissions: [] });
      alert(`Invitation sent to ${newMember.email}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "away":
        return "text-amber-600 bg-amber-50";
      case "offline":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle size={12} className="text-green-600" />;
      case "away":
        return <Clock size={12} className="text-amber-600" />;
      case "offline":
        return <XCircle size={12} className="text-gray-600" />;
      default:
        return <XCircle size={12} className="text-gray-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F4F7FA] p-6 mb-4">
        <div className="w-full">
          {/* Header */}
          <PageHeader
            title="Team Management"
            description="Manage your team members and AI assistant permissions"
            showAIBadge={true}
            icon={<UserPlus size={24} />}
            buttons={[
              {
                text: "Permissions",
                onClick: () => {
                  setShowPermissionsModal(true);
                },
                icon: <Shield size={20} />,
                className:
                  "border-2 border-[#2E69A4] bg-transparent text-[#2E69A4] hover:bg-blue-50 transition-colors",
              },
              {
                text: "Invite Member",
                onClick: () => {
                  setShowInviteModal(true);
                },
                icon: <UserPlus size={20} />,
              },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab("members")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "members"
                          ? "bg-[#2E69A4] text-white"
                          : "bg-[#F4F7FA] text-[#344767] hover:bg-blue-50"
                      }`}
                    >
                      <Users size={16} />
                      Team Members
                    </button>

                    <button
                      onClick={() => setActiveTab("invites")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "invites"
                          ? "bg-[#2E69A4] text-white"
                          : "bg-[#F4F7FA] text-[#344767] hover:bg-blue-50"
                      }`}
                    >
                      <Mail size={16} />
                      Pending Invites
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#344767]"
                    />
                    <input
                      type="text"
                      placeholder="Search team members..."
                      value={searchQuery}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
                    />
                  </div>
                </div>

                {/* Team Members List */}
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-5 bg-white rounded-2xl shadow-sm border transition-all duration-200 ${
                        selectedMember === member.id
                          ? "border-[#2E69A4] ring-2 ring-[#2E69A4]/30"
                          : "border-gray-200 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Left Section: Avatar + Info */}
                        <div className="flex items-center gap-4">
                          {/* Avatar with initials */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2E69A4] to-[#1B2A49] flex items-center justify-center text-white font-semibold shadow-sm">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>

                          {/* Member Info */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[#1B2A49] text-base truncate max-w-[150px]">
                                {member.name}
                              </h3>
                              <div
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  member.status
                                )}`}
                              >
                                {getStatusIcon(member.status)}
                                <span className="capitalize">
                                  {member.status}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1 truncate max-w-[180px]">
                              {member.role}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1 truncate max-w-[160px]">
                                <Mail size={12} />
                                {member.email}
                              </span>
                              {member.phone && (
                                <span className="flex items-center gap-1 truncate max-w-[120px]">
                                  <Phone size={12} />
                                  {member.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Section: Actions */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              Last active: {member.lastActive}
                            </p>
                            <p className="text-xs text-gray-400">
                              Joined: {member.joinDate}
                            </p>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical size={18} className="text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-[#1B2A49]">
                            AI Permissions
                          </span>
                          <button className="text-xs text-[#2E69A4] hover:underline">
                            Edit Permissions
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {member.permissions.includes("all") ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium shadow-sm">
                              Full Access
                            </span>
                          ) : (
                            member.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium shadow-sm"
                              >
                                {permission}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sticky top-2 h-[80vh]">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#1B2A49]">
                    Quick Actions
                  </h3>
                  <Settings size={18} className="text-[#344767]" />
                </div>

                {/* Grid instead of vertical stack */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 text-[#2E69A4] rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <UserPlus size={22} />
                    <span className="font-semibold text-sm text-center">
                      Invite Member
                    </span>
                  </button>

                  <button
                    onClick={() => setShowPermissionsModal(true)}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Shield size={22} />
                    <span className="font-semibold text-sm text-center">
                      Manage Permissions
                    </span>
                  </button>

                  <button className="flex flex-col items-center justify-center gap-2 p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                    <BarChart3 size={22} />
                    <span className="font-semibold text-sm text-center">
                      Usage Reports
                    </span>
                  </button>
                </div>
              </div>
              {/* Pending Invites */}
              {pendingInvites.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
                  <h3 className="text-lg font-bold text-[#1B2A49] mb-4 flex items-center">
                    <Mail size={20} className="text-[#2E69A4] mr-2" />
                    Pending Invitations
                  </h3>
                  <div className="space-y-3">
                    {pendingInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                      >
                        <div className="font-semibold text-[#1B2A49] text-sm">
                          {invite.email}
                        </div>
                        <div className="text-xs text-amber-700 mb-2">
                          {invite.role}
                        </div>
                        <div className="flex items-center justify-between text-xs text-amber-600">
                          <span>Expires: {invite.expiresDate}</span>
                          <button className="text-[#2E69A4] hover:underline">
                            Resend
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invite Member Modal */}
        <Modal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          title="Invite Team Member"
          size="lg"
          showCloseButton={true}
          closeOnOverlayClick={true}
          titleIcon={<UserPlus size={24} className="text-white" />}
        >
          <div className="p-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span
                  className={`text-sm font-semibold ${
                    inviteStep >= 1 ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  Basic Info
                </span>
                <span
                  className={`text-sm font-semibold ${
                    inviteStep >= 2 ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  Permissions
                </span>
                <span
                  className={`text-sm font-semibold ${
                    inviteStep >= 3 ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  Review & Send
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(inviteStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {inviteStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2A49] mb-2">
                    Team Member Information
                  </h3>
                  <p className="text-sm text-[#344767] mb-4">
                    Enter the basic details for your new team member.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-[#1B2A49] mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewMember((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="team.member@business.ae"
                      className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#1B2A49] mb-2 block">
                      Role
                    </label>
                    <select
                      value={newMember.role}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setNewMember((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
                    >
                      <option value="">Select a role</option>
                      <option>Accountant</option>
                      <option>Sales Manager</option>
                      <option>Marketing Assistant</option>
                      <option>Support Specialist</option>
                      <option>Business Owner</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setInviteStep(2)}
                    disabled={!newMember.email || !newMember.role}
                    className="bg-[#1B2A49] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Permissions */}
            {inviteStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2A49] mb-2">
                    AI Assistant Permissions
                  </h3>
                  <p className="text-sm text-[#344767] mb-4">
                    Choose which AI features this team member can access.
                  </p>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {permissionOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-start space-x-3 p-3 bg-[#F4F7FA] rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={option.id}
                        checked={newMember.permissions.includes(option.id)}
                        onChange={() => handlePermissionToggle(option.id)}
                        className="mt-1 w-4 h-4 text-[#2E69A4] bg-gray-700 border-gray-600 rounded focus:ring-[#2E69A4] focus:ring-2"
                      />
                      <label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-[#2E69A4]">{option.icon}</div>
                          <p className="text-sm font-semibold text-[#1B2A49]">
                            {option.name}
                          </p>
                        </div>
                        <p className="text-xs text-[#344767]">
                          {option.description}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setInviteStep(1)}
                    className="border-2 border-[#2E69A4] text-[#2E69A4] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setInviteStep(3)}
                    className="bg-[#1B2A49] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Send */}
            {inviteStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2A49] mb-2">
                    Review Invitation
                  </h3>
                  <p className="text-sm text-[#344767] mb-4">
                    Review the details before sending the invitation.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#344767]">Email:</span>
                      <span className="text-sm font-semibold text-[#1B2A49]">
                        {newMember.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#344767]">Role:</span>
                      <span className="text-sm font-semibold text-[#1B2A49]">
                        {newMember.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-[#344767]">
                        Permissions:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newMember.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                          >
                            {
                              permissionOptions.find((p) => p.id === permission)
                                ?.name
                            }
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    className="border-2 border-[#2E69A4] bg-transparent text-[#2E69A4] hover:bg-blue-50"
                    onClick={() => setInviteStep(2)}
                  >
                    Back
                  </Button>
                  <button
                    onClick={handleSendInvite}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Mail size={20} />
                    Send Invitation
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* Permissions Modal */}
        <Modal
          isOpen={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
          title="AI Permissions Management"
          size="xl"
          showCloseButton={true}
          closeOnOverlayClick={true}
          titleIcon={<Shield size={24} className="text-white" />}
        >
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#1B2A49] mb-2">
                Manage Team Permissions
              </h3>
              <p className="text-sm text-[#344767]">
                Control access to AI features and business data across your
                team.
              </p>
            </div>

            <div className="space-y-6">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#F4F7FA] rounded-xl p-4 border border-[#E1E8F5]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#2E69A4] to-[#1B2A49] rounded-xl flex items-center justify-center text-white">
                        {member.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1B2A49]">
                          {member.name}
                        </h4>
                        <p className="text-sm text-[#344767]">{member.role}</p>
                      </div>
                    </div>
                    <button className="text-[#2E69A4] hover:underline text-sm font-semibold">
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {permissionOptions.map((permission) => (
                      <div
                        key={permission.id}
                        className={`p-2 rounded-lg text-xs ${
                          member.permissions.includes("all") ||
                          member.permissions.includes(permission.id)
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {permission.icon}
                          <span>{permission.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => setShowPermissionsModal(false)}
                className="border-2 bg-transparent border-[#2E69A4] text-[#2E69A4] hover:bg-blue-50 transition-colors"
              >
                Cancel
              </Button>

              <Button>Save Changes</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
