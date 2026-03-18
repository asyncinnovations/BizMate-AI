import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

/* ─────────────────────────────────────────────
   Load Fonts with Next.js Font System
   ───────────────────────────────────────────── */

const plusJakarta = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
  display: "swap",
});

/* ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Bizmate",
  description: "Bizmate AI Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSerif.variable}`}>
      <head>
        {/* Theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var raw = localStorage.getItem('appearance_prefs');
                  var prefs = raw ? JSON.parse(raw) : {};
                  var theme = prefs.theme || 'light';
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var dark = theme === 'dark' || (theme === 'system' && prefersDark);
                  if (dark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>

      <body className="antialiased">
        <AuthProvider>
          <SubscriptionProvider>{children}</SubscriptionProvider>{" "}
        </AuthProvider>

        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
