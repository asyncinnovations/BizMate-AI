// client/app/dashboard/layout.tsx
"use client";
import React, { ReactNode } from "react";
import TopBar from "./dashboard/TopBar";
import FooterDashboard from "./dashboard/FooterDashboard";
import ProtectedRoute from "../protected-route/ProtectedRoute";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      <TopBar />
      {children}
      <FooterDashboard />
    </ProtectedRoute>
  );
};

export default DashboardLayout;
