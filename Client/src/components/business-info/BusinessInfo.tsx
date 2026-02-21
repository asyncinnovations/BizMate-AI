import React, { ChangeEvent, useEffect, useState } from "react";
import SectionCard from "../section-card/SectionCard";
import { Building2, Upload } from "lucide-react";
import InputField from "../ui/InputField";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import Button from "../ui/Button";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import Image from "next/image";

interface BusinessFormData {
  uuid: string;
  user_id: string;
  business_name: string;
  owner_name: string;
  industry: string;
  business_type: string;
  services_offered: string;
  communication_channels: string;
  is_active: boolean;
  availability: string;
  faq: string;
  tone_examples: string;
  snapshot: File | string;
}

const BusinessInfo = () => {
  const { user, loading } = useAuth();
  const user_id = user?.user.user_id as string;
  const [snapshotPreview, setSnapshotPreview] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<BusinessFormData | null>(
    null
  );
  const [formData, setFormData] = useState<BusinessFormData>({
    uuid: "",
    user_id: user_id,
    business_name: "",
    owner_name: "",
    industry: "",
    business_type: "",
    services_offered: "",
    communication_channels: "",
    is_active: false,
    availability: "",
    faq: "",
    tone_examples: "",
    snapshot: "",
  });

  //////////////////////////////////
  // Handle Input Change
  ///////////////////////////////////
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      if (isEditMode) {
        //Compare updated data with original data
        const isFormChanged =
          JSON.stringify(updatedData) !== JSON.stringify(originalData);

        setIsDirty(isFormChanged);
      }

      return updatedData;
    });
  };

  ///////////////////////////////
  // Handle Snapshot Upload
  ///////////////////////////////
  const handleSnapshotChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("Error while uploading file");

    const filePreview = URL.createObjectURL(file);
    setSnapshotPreview(filePreview);

    setFormData({ ...formData, snapshot: file });
  };

  //////////////////////////////////
  // Save User Business Info
  ///////////////////////////////////
  const handleSaveInfo = async () => {
    if (!user_id) {
      return toast.error("User id is not loaded yet!");
    }

    if (
      !formData.business_name ||
      !formData.industry ||
      !formData.services_offered
    ) {
      return toast.error("Fill all the required fields first!");
    }

    try {
      //First create a Object (because in form we pass file)
      // const payload = new FormData();
      //
      //Than append values one by one
      // payload.append("user_id", user_id);
      // payload.append("business_name", formData.business_name);
      // payload.append("owner_name", formData.owner_name);
      // payload.append("industry", formData.industry);
      // payload.append("business_type", formData.business_type);
      // payload.append("services_offered", formData.services_offered);
      // payload.append("communication_channels", formData.communication_channels);
      // payload.append("availability", formData.availability);
      // payload.append("is_active", String(formData.is_active));
      // payload.append("faq", formData.faq);
      // payload.append("tone_examples", formData.tone_examples);

      //check is the snapshot file exists than set to payload object
      // if (formData.snapshot) {
      //   payload.append("snapshot", formData.snapshot);
      // }

      const response = await axiosInstance.post(
        `/user_business_info/create`,
        formData
      );

      if (response.status === 201) {
        toast.success("Business info saved successfully!");
        setFormData({ ...formData, ...response.data.response });
      }
    } catch (error) {
      console.log("Error occur while saving business info", error);
    }
  };

  //////////////////////////////////
  // Fetch User Business Info
  ///////////////////////////////////
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/user_business_info/user/${user_id}`
      );
      if (response.status === 200) {
        const userInfo = response.data.response?.[0];
        console.log(response.data);

        if (userInfo?.uuid || userInfo?.business_name) {
          setIsEditMode(true);
          setFormData(userInfo);
          setOriginalData(userInfo);
        }
      }
    } catch (error) {
      console.log("Error occur while fetching user info", error);
    } finally {
      setIsLoading(false);
    }
  };

  //////////////////////////////////
  // Update User Business Info
  ///////////////////////////////////
  const handleUpdateInfo = async () => {
    try {
      console.log(formData);
      const response = await axiosInstance.patch(
        `/user_business_info/update/${formData.uuid}`,
        formData
      );
      if (response.status === 200) {
        toast.success("Business info updated successfully!");
        const updatedInfo = response.data.response?.[0];
        setFormData(updatedInfo);
      }
    } catch (error) {
      console.log("Error occur while updating user business info", error);
    }
  };

  //////////////////////////////////
  // Delete User Business Info
  ///////////////////////////////////
  const handleDeleteInfo = async (uuid: string) => {
    try {
      const response = await axiosInstance.delete(
        `/user_business_info/delete/${uuid}`
      );
      if (response.status === 200) {
        toast.success("Business info deleted successfully!");
        setIsEditMode(false);
        setIsEditing(false);
        setIsDirty(false);
        setFormData({
          uuid: "",
          user_id: user_id,
          business_name: "",
          owner_name: "",
          industry: "",
          business_type: "",
          services_offered: "",
          communication_channels: "",
          is_active: false,
          availability: "",
          faq: "",
          tone_examples: "",
          snapshot: "",
        });
      }
    } catch (error) {
      console.log("Error occur while deleting user info", error);
    }
  };

  //////////////////////////////////
  // Cancel User Business Info
  ///////////////////////////////////
  const handleCancelInfo = () => {
    if (isEditMode && isEditing) {
      if (originalData) {
        setFormData(originalData);
        setIsEditing(false);
        setIsDirty(false);
      }
    } else {
      setFormData({
        uuid: "",
        user_id: user_id ?? "",
        business_name: "",
        owner_name: "",
        industry: "",
        business_type: "",
        services_offered: "",
        communication_channels: "",
        is_active: false,
        availability: "",
        faq: "",
        tone_examples: "",
        snapshot: "",
      });
      setSnapshotPreview("");
    }
  };

  useEffect(() => {
    if (!loading && user_id) {
      fetchUserInfo();
    }
  }, [loading, user_id]);

  return (
    <SectionCard title="Business Information" icon={Building2}>
      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />{" "}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Row */}
          <InputField
            label="Business Name"
            name="business_name"
            value={formData.business_name}
            placeholder="Enter your business name"
            onChange={handleInputChange}
            readOnly={isEditMode && !isEditing}
            required={true}
          />

          <InputField
            label="Owner Name"
            name="owner_name"
            value={formData.owner_name}
            placeholder="Enter owner's full name"
            onChange={handleInputChange}
            readOnly={isEditMode && !isEditing}
          />

          {/* Second Row */}
          <InputField
            label="Business Type"
            name="business_type"
            value={formData.business_type}
            placeholder="E.g., Restaurant, Salon, IT Services"
            onChange={handleInputChange}
            readOnly={isEditMode && !isEditing}
          />

          <InputField
            label="Availability"
            name="availability"
            value={formData.availability}
            placeholder="E.g., 24/7, Weekdays Only"
            onChange={handleInputChange}
            readOnly={isEditMode && !isEditing}
          />

          <InputField
            label="Industry"
            name="industry"
            value={formData.industry}
            placeholder="E.g., IT, Restaurant, Salon, Retail"
            onChange={handleInputChange}
            readOnly={isEditMode && !isEditing}
            required={true}
          />

          <InputField
            label="Communication Channels"
            name="communication_channels"
            value={formData.communication_channels}
            placeholder="E.g., Email, WhatsApp, Phone, Telegram"
            onChange={handleInputChange}
            readOnly={isEditMode && !isEditing}
          />

          {/* Full Width Textareas */}
          <div className="md:col-span-2">
            <InputField
              label="Services Offered"
              name="services_offered"
              value={formData.services_offered}
              type="textarea"
              placeholder="List all services your business offers"
              onChange={handleInputChange}
              readOnly={isEditMode && !isEditing}
              required={true}
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              label="FAQ"
              name="faq"
              value={formData.faq}
              type="textarea"
              placeholder="Add frequently asked questions and answers"
              onChange={handleInputChange}
              readOnly={isEditMode && !isEditing}
            />
          </div>

          {/* Tone Examples */}
          <div className="md:col-span-2">
            <InputField
              label="Tone Examples"
              name="tone_examples"
              value={formData.tone_examples}
              placeholder="Provide tone style or conversation examples"
              onChange={handleInputChange}
              readOnly={isEditMode && !isEditing}
            />
          </div>

          {/* Is Active Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_active"
              disabled={isEditMode && !isEditing}
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="h-5 w-5 text-[#2E69A4] border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-[#344767]">
              Business is Active
            </label>
          </div>

          {/* Snapshot Upload */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-[#344767] mb-3 block">
              Snapshot
            </label>

            <div className="border-2 border-dashed border-[#E1E8F5] rounded-xl p-6 text-center hover:border-[#2E69A4] transition-colors bg-[#F4F7FA]">
              {snapshotPreview ? (
                <Image
                  src={snapshotPreview}
                  alt="Snapshot Preview"
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-[#344767] mx-auto mb-3" />
                  <p className="text-[#344767] font-medium">
                    Upload a snapshot
                  </p>
                  <p className="text-sm text-[#344767] mt-1 mb-4">
                    PNG, JPG, SVG up to 5MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleSnapshotChange}
                id="snapshotUpload"
                className="hidden"
              />

              <label
                htmlFor="snapshotUpload"
                className="px-4 py-2 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors text-sm cursor-pointer"
              >
                {!snapshotPreview ? "Upload Snapshot" : "Change Snapshot"}
              </label>
            </div>
          </div>

          {/* ✅ Buttons Section */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            {/* Cancel Button */}
            <Button
              onClick={handleCancelInfo}
              className="border bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>

            {/* Delete Button */}
            {formData.uuid && (
              <Button
                onClick={() => handleDeleteInfo(formData.uuid)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete Info
              </Button>
            )}
            <Button
              disabled={isEditMode && isEditing && !isDirty}
              onClick={() => {
                if (isEditMode && !isEditing) {
                  setIsEditing(true);
                } else if (isEditMode && isEditing) {
                  handleUpdateInfo();
                } else {
                  handleSaveInfo();
                }
              }}
            >
              {isEditMode && !isEditing
                ? "Edit Info"
                : isEditMode && isEditing
                ? "Update Info"
                : "Save Info"}
            </Button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default BusinessInfo;
