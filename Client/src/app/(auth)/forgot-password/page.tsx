"use client";

import PublicLayout from "@/app/components/layout/PublicLayout";
import { useRouter } from "next/navigation";
import React from "react";

const ForgotPassword = () => {
  const router = useRouter();
  return (
    <PublicLayout>
      <div className="min-h-screen flex justify-center items-start">
        <div className="w-full mt-20 max-w-md bg-white rounded-lg shadow-sm min-h-[250px] p-8">
          <h1 className="text-center mb-6 text-2xl font-bold">
            Forgot Password
          </h1>
          <div className="space-y-6">
            <div>
              <label className="block text-[#344767] mb-1">Email</label>
              <input
                type="text"
                placeholder="Enter your registered email"
                className="px-4 py-2 border border-[#E1E8F5] rounded-lg w-full text-[#344767] focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button className="w-full py-2 px-4 border-0 cursor-pointer rounded-lg text-white text-lg bg-[#1b2a49] hover:bg-[#162038]">
                Send Reset Link
              </button>
              <button
                onClick={() => router.push("/login")}
                className="w-full focus:outline-none py-2 px-y cursor-pointer text-lg rounded-lg  text-[#344767] hover:bg-[#E1E8F5] bg-white border border-[#2E69A4]"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ForgotPassword;
