import React, { ReactNode } from "react";
import TopBar from "./dashboard/TopBar";
import FooterDashboard from "./dashboard/FooterDashboard";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div>
      <TopBar />
      {children}
      <FooterDashboard />
    </div>
  );
};

export default DashboardLayout;
