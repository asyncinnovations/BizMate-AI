"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  User,
  Edit,
  Eye,
  FileText,
  Users,
  CheckCircle,
  Trash,
  Instagram,
  Notebook,
  CircleAlert,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/page-header/PageHeader";
import StatCard from "@/components/stat-card/StatCard";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import Select from "@/components/ui/select";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";

interface Client {
  uuid: string;
  name: string;
  email: string;
  whatsapp_number: string;
  instagram_id: string;
  notes: string;
  user_id: string | unknown;
  added_at: string;
}

interface ExistedClient {
  exists: boolean;
  message: string;
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importData, setImportData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const user_id = user?.user.user_id;

  // Client form state - ONLY backend fields
  const [newClient, setNewClient] = useState<Omit<Client, "uuid" | "added_at">>(
    {
      name: "",
      email: "",
      whatsapp_number: "",
      instagram_id: "",
      notes: "",
      user_id: user_id,
    },
  );

  const [existedClient, setExistedClient] = useState<ExistedClient>({
    exists: false,
    message: "",
  });

  // Stats data
  const statsData = [
    {
      title: "Total Clients",
      value: clients.length,
      subtitle: "+5 from last month",
      icon: <Users className="w-6 h-6" />,
      iconBg: "bg-status-info-bg",
      iconColor: "text-status-info",
      badgeText: "Active",
      badgeBg: "bg-status-info-bg",
      badgeColor: "text-status-info",
    },
    {
      title: "Recent Clients",
      value: clients.filter((client) => {
        const clientDate = new Date(client.added_at);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return clientDate > lastMonth;
      }).length,
      subtitle: "Added in last 30 days",
      icon: <CheckCircle className="w-6 h-6" />,
      iconBg: "bg-status-success-bg",
      iconColor: "text-status-success",
      badgeText: "New",
      badgeBg: "bg-status-success-bg",
      badgeColor: "text-status-success",
    },
    {
      title: "WhatsApp Clients",
      value: clients.filter((client) => client.whatsapp_number).length,
      subtitle: "Have WhatsApp number",
      icon: <Phone className="w-6 h-6" />,
      iconBg: "bg-brand-light",
      iconColor: "text-secondary",
      badgeText: "Connected",
      badgeBg: "bg-brand-light",
      badgeColor: "text-secondary",
    },
    {
      title: "Instagram Clients",
      value: clients.filter((client) => client.instagram_id).length,
      subtitle: "Have Instagram ID",
      icon: <Instagram className="w-6 h-6" />,
      iconBg: "bg-status-warning-bg",
      iconColor: "text-status-warning",
      badgeText: "Social",
      badgeBg: "bg-status-warning-bg",
      badgeColor: "text-status-warning",
    },
  ];

  ///////////////////////////
  // Fetch All Clients
  ////////////////////////////
  const fetchAllClients = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/client_lists/user/${user_id}`);
      if (response.status === 200) {
        setClients(response.data.response);
        console.log(response.data.response);
      }
    } catch (error) {
      console.log("Error occur while fetching all clients", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchAllClients();
    }
  }, [user_id]);

  ////////////////////////////
  // Add New Client
  /////////////////////////////
  const AddNewClient = async () => {
    if (!newClient.name.trim()) {
      return toast.error("Client name is required!");
    }

    if (
      !newClient.email &&
      !newClient.instagram_id &&
      !newClient.whatsapp_number
    ) {
      return toast.error(
        "At least one contact (email, WhatsApp, or Instagram) is required",
      );
    }

    try {
      console.log(newClient);
      const response = await axiosInstance.post(
        `/client_lists/create`,
        newClient,
      );
      if (response.status === 201) {
        toast.success("Client added successfully!");
        setClients((prev) => [...prev, response.data.response]);
      }
    } catch (error) {
      console.log("Error occur while adding client", error);
    } finally {
      setShowClientModal(false);
      setNewClient({
        name: "",
        email: "",
        whatsapp_number: "",
        instagram_id: "",
        notes: "",
        user_id: user_id,
      });
    }
  };

  /////////////////////////////
  // Update Existing Client
  /////////////////////////////
  const UpdateClient = async () => {
    if (!newClient.name.trim()) {
      return toast.error("Client name is required!");
    }

    if (
      !newClient.email &&
      !newClient.instagram_id &&
      !newClient.whatsapp_number
    ) {
      toast.error(
        "At least one contact (email, WhatsApp, or Instagram) is required",
      );
    }

    try {
      const response = await axiosInstance.patch(
        `/client_lists/update/${selectedClient?.uuid}`,
        newClient,
      );
      if (response.status === 200) {
        toast.success("Client updated successfully!");
        setClients((prev) =>
          prev.map((c) =>
            c.uuid === selectedClient?.uuid ? { ...c, ...newClient } : c,
          ),
        );
      }
    } catch (error) {
      console.log("Error occur while updating the client", error);
    } finally {
      setShowClientModal(false);
      setNewClient({
        name: "",
        email: "",
        whatsapp_number: "",
        instagram_id: "",
        notes: "",
        user_id: user_id,
      });
    }
  };

  /////////////////////////
  // Delete Client
  /////////////////////////
  const handleDeleteClient = async (uuid: string) => {
    if (confirm("Are you sure you want to delete client?")) {
      try {
        const response = await axiosInstance.delete(
          `/client_lists/delete/${uuid}`,
        );
        if (response.status === 200) {
          toast.success("Client deleted successfully!");
          setClients((prev) => prev.filter((c) => c.uuid !== uuid));
        }
      } catch (error) {
        console.log("Error occur while deleting client", error);
      }
    }
  };

  /////////////////////////
  // Open Add Client Modal
  /////////////////////////
  const handleAddModalOpen = () => {
    setNewClient({
      name: "",
      email: "",
      whatsapp_number: "",
      instagram_id: "",
      notes: "",
      user_id: user_id,
    });
    setExistedClient({ exists: false, message: "" });
    setIsEditing(false);
    setShowClientModal(true);
  };

  /////////////////////////
  // Open Update Client Modal
  /////////////////////////
  const handleUpdateModalOpen = (client: Client) => {
    setNewClient({
      name: client.name,
      email: client.email || "",
      whatsapp_number: client.whatsapp_number || "",
      instagram_id: client.instagram_id || "",
      notes: client.notes || "",
      user_id: client.user_id,
    });
    setExistedClient({ exists: false, message: "" });
    setIsEditing(true);
    setSelectedClient(client);
    setShowClientModal(true);
  };

  ////////////////////////////////////
  // Handle Bulk Import Clients
  //////////////////////////////////
  const handleBulkImport = async () => {
    if (!importData.trim()) {
      return toast.error("Client data required!");
    }

    const clientsToImport = JSON.parse(importData);

    if (!Array.isArray(clientsToImport)) {
      return toast.error("Data must be in array format!");
    }

    for (const client of clientsToImport) {
      if (!client.name) {
        return toast.error("Each client must have a name!");
      }
    }

    try {
      const response = await axiosInstance.post(
        `/client_lists/bulk_import/${user_id}`,
        clientsToImport,
      );
      if (response.status === 200) {
        toast.success("Clients imported successfully!");
        fetchAllClients();
      }
    } catch (error) {
      console.log("Error occur while importing clients", error);
    } finally {
      setShowImportModal(false);
      setImportData("");
    }
  };

  ////////////////////////////////
  // Check Already Exists Clients
  /////////////////////////////////
  const checkClientExists = async (
    email?: string,
    whatsapp_number?: string,
  ) => {
    if (!email && !whatsapp_number) return;

    try {
      const response = await axiosInstance.post(
        `/client_lists/client_exists/${user_id}`,
        { email, whatsapp_number },
      );
      if (response.status === 200) {
        console.log(response.data);
        setExistedClient({
          exists: response.data.exists,
          message: response.data.exists
            ? "Client already exists with same (Email or Whatsapp)"
            : "Client is new! You can safely add them.",
        });
      }
    } catch (error) {
      console.log("Error occur while checking existing clients", error);
    }
  };

  const updateNewClient = (
    field: keyof Omit<Client, "uuid" | "added_at">,
    value: string,
  ) => {
    setNewClient((prev) => ({ ...prev, [field]: value }));
    if (field === "email" || field === "whatsapp_number") {
      setExistedClient({ exists: false, message: "" });
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
  };

  // Filter and sort clients
  const filteredClients = clients
    .filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.whatsapp_number?.includes(searchQuery) ||
        client.instagram_id?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
          );
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / rowsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <div className="w-full">
          {/* Header */}
          <PageHeader
            title="Client Management"
            description="Manage your clients with email, WhatsApp, and Instagram contacts"
            icon={<Users size={24} />}
            showAIBadge={false}
            buttons={[
              {
                text: "Add Client",
                onClick: handleAddModalOpen,
                icon: <Plus size={20} />,
                className: "bg-brand hover:bg-brand-hover text-on-brand",
              },
              {
                text: "Bulk Import",
                onClick: () => setShowImportModal(true),
                icon: <FileText size={20} />,
                className:
                  "bg-status-warning hover:bg-status-warning/90 text-on-brand",
              },
            ]}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((item, index) => (
              <StatCard key={index} {...item} />
            ))}
          </div>

          {/* Clients Table */}
          <div className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-surface">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-text-heading flex items-center gap-2">
                    <Users className="w-5 h-5 text-text-heading" />
                    Client Management
                  </h2>
                  <p className="text-text-secondary mt-1">
                    Manage your client contacts and information
                  </p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search by name, email, WhatsApp, Instagram..."
                      className="pl-10 pr-4 py-3 border text-sm border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary w-full lg:w-64 bg-bg-base text-text-secondary transition-all duration-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Sort */}
                  <Select
                    className="w-45"
                    value={sortBy}
                    onChange={setSortBy}
                    options={[
                      { value: "newest", label: "Newest First" },
                      { value: "oldest", label: "Oldest First" },
                      { value: "name", label: "Sort by Name" },
                    ]}
                    placeholder="Sort by"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[60vh]">
              {/* Desktop Table */}
              <table className="w-full hidden lg:table">
                <thead className="bg-brand">
                  <tr>
                    {[
                      "Client",
                      "Contact Info",
                      "Social",
                      "Notes",
                      "Date Added",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {paginatedClients.map((client) => (
                    <tr
                      key={client.uuid}
                      className="hover:bg-brand-light/30 transition-all duration-200 group"
                    >
                      {/* Client Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-status-info-bg rounded-lg group-hover:bg-brand-light transition-colors duration-200">
                            <User className="w-4 h-4 text-secondary" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-text-heading">
                              {client.name}
                            </div>
                            <div className="text-xs text-text-muted">
                              ID: {client.instagram_id || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Mail size={14} className="text-text-muted" />
                            {client.email || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Phone size={14} className="text-text-muted" />
                            {client.whatsapp_number || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Social */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Instagram size={14} className="text-text-muted" />
                          {client.instagram_id || "N/A"}
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                          <Notebook size={14} className="text-text-muted" />
                          <div className="max-w-20 truncate">
                            {client.notes || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Date Added */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-text-muted" />
                          {formatDate(client.added_at)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(client)}
                            className="p-2 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateModalOpen(client)}
                            className="p-2 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all duration-200"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.uuid)}
                            className="p-2 text-text-muted hover:text-status-error hover:bg-status-error-bg rounded-lg transition-all duration-200"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State — no clients at all */}
              {clients.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto h-24 w-24 text-text-muted/30 mb-4">
                    <Users className="w-full h-full" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-text-heading">
                    No clients found
                  </h3>
                  <p className="mt-2 text-text-secondary max-w-md mx-auto">
                    Start by adding your first client to the system.
                  </p>
                </div>
              )}

              {/* Empty State — search returned no results */}
              {filteredClients.length === 0 && clients.length > 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto h-24 w-24 text-text-muted/30 mb-4">
                    <Search className="w-full h-full" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-text-heading">
                    No clients found
                  </h3>
                  <p className="mt-2 text-text-secondary max-w-md mx-auto">
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {clients.length > 0 && filteredClients.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">
                    Rows per page:
                  </span>
                  <Select
                    className="w-20"
                    value={rowsPerPage.toString()}
                    onChange={(value) => setRowsPerPage(Number(value))}
                    options={[
                      { value: "5", label: "5" },
                      { value: "10", label: "10" },
                      { value: "25", label: "25" },
                      { value: "50", label: "50" },
                    ]}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-bg-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} className="text-text-secondary" />
                  </button>
                  <span className="text-sm text-text-secondary">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-bg-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} className="text-text-secondary" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Client Modal */}
        <Modal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          title={isEditing ? "Edit Client" : "Add New Client"}
          size="lg"
          showCloseButton={true}
          closeOnOverlayClick={true}
          titleIcon={<Users size={24} className="text-white" />}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Client Name"
                name="name"
                type="text"
                placeholder="Enter client name"
                value={newClient.name}
                onChange={(e) => updateNewClient("name", e.target.value)}
                required
              />
              <InputField
                name="email"
                type="email"
                label="Email"
                value={newClient.email}
                onChange={(e) => updateNewClient("email", e.target.value)}
                onBlur={(e) => checkClientExists(e.target.value, undefined)}
                placeholder="Enter email address"
              />
              <InputField
                name="whatsapp_number"
                label="WhatsApp Number"
                type="tel"
                value={newClient.whatsapp_number}
                onChange={(e) =>
                  updateNewClient("whatsapp_number", e.target.value)
                }
                onBlur={(e) => checkClientExists(undefined, e.target.value)}
                placeholder="e.g., +971501234567"
              />
              <InputField
                name="instagram_id"
                label="Instagram ID"
                type="text"
                value={newClient.instagram_id}
                onChange={(e) =>
                  updateNewClient("instagram_id", e.target.value)
                }
                placeholder="e.g., @username"
              />
              <div className="md:col-span-2">
                <InputField
                  name="notes"
                  label="Notes"
                  type="textarea"
                  placeholder="Enter any additional details or comments..."
                  value={newClient.notes}
                  onChange={(e) => updateNewClient("notes", e.target.value)}
                />
              </div>
            </div>

            <div
              className={`flex ${
                existedClient.message ? "justify-between" : "justify-end"
              } items-center mt-6 pt-6 border-t border-border`}
            >
              {/* Status Message */}
              {existedClient.message && (
                <div>
                  {existedClient.exists ? (
                    <div className="flex items-center gap-2 bg-status-error-bg text-status-error border border-status-error-border px-3 py-2 rounded-lg text-sm font-medium">
                      <CircleAlert className="w-4 h-4" />
                      {existedClient.message}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-status-success-bg text-status-success border border-status-success-border px-3 py-2 rounded-lg text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      {existedClient.message}
                    </div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 items-center">
                <Button
                  onClick={() => setShowClientModal(false)}
                  variant="secondary"
                  className="border-border text-text-secondary hover:bg-bg-base"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    isEditing && selectedClient
                      ? UpdateClient()
                      : AddNewClient()
                  }
                  disabled={existedClient.exists}
                  className={`bg-brand hover:bg-brand-hover text-on-brand ${
                    existedClient.exists ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isEditing ? "Update Client" : "Add Client"}
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Bulk Import Modal */}
        <Modal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          title="Bulk Import Clients"
          size="lg"
          showCloseButton={true}
          closeOnOverlayClick={true}
          titleIcon={<FileText size={24} className="text-white" />}
        >
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-3">
                Paste client data in JSON format. Each client must have at least
                a name field.
              </p>
              <div className="bg-bg-base border border-border p-4 rounded-lg text-xs font-mono text-text-muted">
                {`[
  { "name": "Client One", "email": "client1@example.com", "whatsapp_number": "+971501234567" },
  { "name": "Client Two", "email": "client2@example.com", "instagram_id": "@client2" }
]`}
              </div>
            </div>

            <textarea
              value={importData}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setImportData(e.target.value)
              }
              rows={8}
              className="w-full px-4 py-3 border border-border rounded-lg bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary font-mono text-sm"
              placeholder="Paste your JSON data here..."
            />

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
              <Button
                onClick={() => setShowImportModal(false)}
                variant="secondary"
                className="border-border text-text-secondary hover:bg-bg-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkImport}
                startIcon={<FileText className="w-4 h-4" />}
              >
                Import Clients
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
