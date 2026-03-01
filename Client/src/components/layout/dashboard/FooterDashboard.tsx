import React from "react";

const FooterDashboard = () => {
  return (
    <div className="fixed bottom-0 w-full bg-surface py-2 min-h-[30px] text-center shadow-raised border-t border-border">
      <p className="text-sm font-semibold text-text-primary">
        © {new Date().getFullYear()} BizMate-AI. All Rights Reserved.
      </p>
    </div>
  );
};

export default FooterDashboard;