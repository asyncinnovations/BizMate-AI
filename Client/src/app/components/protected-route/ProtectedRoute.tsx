import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [router, user, loading]);

  if (loading) return <LoadingSpinner fullScreen={true} />;

  if (!user) return null;

  return children;
};

export default ProtectedRoute;
