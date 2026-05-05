import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bizmate Admin",
  description: "AI-Powered Business Operating System — Admin Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark"> {/* default = dark */}
      <body className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}