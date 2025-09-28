import React from "react";

const FooterDashboard = () => {
  return (
    <div className="fixed bottom-0 w-full bg-white py-2 min-h-[30px] text-center shadow-[0_-1px_10px_rgba(0,0,0,0.1)]">
      <p className="text-sm font-semibold">
        © {new Date().getFullYear()} BizMate-AI. All Rights Reserved.
      </p>
    </div>
  );
};

export default FooterDashboard;
