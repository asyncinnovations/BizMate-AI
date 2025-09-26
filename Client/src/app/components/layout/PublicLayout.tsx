import React, { ReactNode } from "react";
import PublicNavbar from "./public/PublicNavbar";
import PublicFooter from "./public/PublicFooter";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
