import type { Metadata } from "next";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — Bizmate Admin",
  description: "Sign in to Bizmate Admin Panel",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
