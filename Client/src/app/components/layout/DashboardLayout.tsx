import React, { ReactNode } from "react";
import TopBar from "./dashboard-components/TopBar";
import FooterDashboard from "./dashboard-components/FooterDashboard";

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
