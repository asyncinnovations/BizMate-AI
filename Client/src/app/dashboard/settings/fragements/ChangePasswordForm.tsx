// app/settings/components/ChangePasswordForm.tsx
"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import InputField from "@/components/ui/InputField";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

const ChangePasswordForm: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateFields = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!currentPassword)
      newErrors.currentPassword = "Current password is required!";

    if (!newPassword) newErrors.newPassword = "New password is required!";
    else if (newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== newPassword)
      newErrors.confirmPassword = "Password do not match";

    setErrors(newErrors);

    return Object.values(newErrors).every((err) => err === "");
  };

  const isButtonDisabled = !currentPassword || !newPassword || !confirmPassword;

  const resetUserPassword = async () => {
    if (!validateFields()) return;

    try {
      await axiosInstance.put(`/auth/reset_password/${user?.user.user_id}`, {
        new_password: newPassword,
      });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to update password");
      console.log("Error occur while updating password", error);
    }
  };

  return (
    <SectionCard title="Change Password" icon={Lock}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            type="password"
            name="current_password"
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            error={errors.currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <InputField
            label="New Password"
            name="new_password"
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            value={newPassword}
          />
          <InputField
            label="Confirm New Password"
            name="confirm_password"
            type="password"
            placeholder="Confirm new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            value={confirmPassword}
          />
        </div>

        <div>
          <Button disabled={isButtonDisabled} onClick={resetUserPassword}>
            Update Password
          </Button>
        </div>
      </div>
    </SectionCard>
  );
};

export default ChangePasswordForm;
