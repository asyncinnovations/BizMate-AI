"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const PublicNavbar = () => {
  const router = useRouter();

  const menu = [
    { name: "About", link: "/about" },
    { name: "Blogs", link: "/blogs" },
    { name: "Pricing", link: "/pricing" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <div className="w-full min-h-[60px] bg-[#1b2a49] flex items-center justify-between px-4 py-3">
      <Link href="/" className="text-white font-bold cursor-pointer text-2xl">
        BezMate-AI
      </Link>
      <div className="hidden md:flex gap-12 items-center">
        <ul className="flex items-center gap-15">
          {menu.map((item, index) => (
            <li className="list-none" key={index}>
              <Link
                href={item.link}
                className="text-white text-md font-semibold"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={() => router.push("/register")}
          className="border-none text-white cursor-pointer transition bg-[#f6a821] hover:bg-[#e2991b] py-2 px-4 font-semibold text-lg rounded-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default PublicNavbar;
