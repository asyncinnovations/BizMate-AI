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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
