"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

const PublicNavbar = () => {
  const router   = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const menu = [
    { name: "About",   link: "/about"   },
    { name: "Blogs",   link: "/blogs"   },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <div
      className="w-full flex items-center justify-between px-8 transition-all duration-200"
      style={{
        height:       64,
        background:   "#1B2A49",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow:    scrolled ? "0 4px 24px rgba(0,0,0,0.25)" : "none",
        position:     "sticky",
        top:          0,
        zIndex:       50,
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width:      32,
            height:     32,
            background: "linear-gradient(135deg, #F6A821, #d48b0e)",
            boxShadow:  "0 2px 8px rgba(246,168,33,0.35)",
          }}
        >
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span style={{ fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>
          Bez<span style={{ color: "#F6A821" }}>Mate</span>
          <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 13 }}>.ai</span>
        </span>
      </Link>

      {/* Desktop menu — same structure you had */}
      <div className="hidden md:flex gap-8 items-center">
        <ul className="flex items-center gap-2 list-none m-0 p-0">
          {menu.map((item) => {
            const active = pathname === item.link;
            return (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150"
                  style={{
                    color:      active ? "#ffffff" : "rgba(255,255,255,0.58)",
                    background: active ? "rgba(255,255,255,0.09)" : "transparent",
                  }}
                >
                  {item.name}
                  {active && (
                    <span
                      className="absolute rounded-full"
                      style={{
                        bottom:    5,
                        left:      "50%",
                        transform: "translateX(-50%)",
                        width:     18,
                        height:    2,
                        background: "#F6A821",
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => router.push("/register")}
          className="flex items-center gap-1.5 text-sm font-bold text-white rounded-lg transition-all duration-150"
          style={{
            padding:   "10px 22px",
            background: "linear-gradient(135deg, #F6A821 0%, #d48b0e 100%)",
            boxShadow:  "0 2px 12px rgba(246,168,33,0.32)",
            border:     "none",
            cursor:     "pointer",
          }}
        >
          Get Started
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex items-center justify-center rounded-lg transition-colors"
        onClick={() => setMobileOpen(o => !o)}
        style={{
          width:      38,
          height:     38,
          background: "rgba(255,255,255,0.08)",
          border:     "1px solid rgba(255,255,255,0.10)",
          color:      "#fff",
          cursor:     "pointer",
        }}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="absolute top-16 left-0 right-0 md:hidden flex flex-col px-4 py-3 gap-1"
          style={{
            background:  "#162038",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            boxShadow:   "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {menu.map((item) => {
            const active = pathname === item.link;
            return (
              <Link
                key={item.name}
                href={item.link}
                className="px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  color:      active ? "#ffffff"               : "rgba(255,255,255,0.65)",
                  background: active ? "rgba(46,105,164,0.28)" : "transparent",
                  borderLeft: active ? "3px solid #F6A821"     : "3px solid transparent",
                }}
              >
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={() => router.push("/register")}
            className="mt-2 mb-1 w-full py-3 rounded-lg text-sm font-bold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #F6A821 0%, #d48b0e 100%)",
              border:     "none",
              cursor:     "pointer",
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicNavbar;