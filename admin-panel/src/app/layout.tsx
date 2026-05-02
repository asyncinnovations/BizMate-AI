import type { Metadata } from "next";
import "@/styles/globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Fonts are loaded via @import in globals.css (Syne + Outfit from Google Fonts).
          If you prefer next/font/google, remove the @import from globals.css and
          add the font variables here via className on <body>.
        */}
      </head>
      <body>{children}</body>
    </html>
  );
}
