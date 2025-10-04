import DashboardLayout from "@/app/components/layout/DashboardLayout";
import React from "react";

const page = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center min-h-screen justify-center">
        <h1 className="text-3xl text-red-400">Currently In Progress</h1>
      </div>
    </DashboardLayout>
  );
};

export default page;
