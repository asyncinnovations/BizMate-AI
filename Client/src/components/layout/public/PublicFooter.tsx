import { Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

const PublicFooter = () => {
  const companyLinks = [
    { name: "About Us", link: "/about" },
    { name: "Careers", link: "/careers" },
    { name: "Press", link: "/press" },
  ];

  const resourceLinks = [
    { name: "Blogs", link: "/blogs" },
    { name: "Documentation", link: "/docs" },
    { name: "Help Center", link: "/help" },
  ];

  const supportLinks = [
    { name: "Contact", link: "/contact" },
    { name: "Pricing", link: "/pricing" },
    { name: "FAQ", link: "/faq" },
  ];

  return (
    <div className="w-full min-h-[200px] text-white bg-[#1b2a49]">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between py-8">
          <div className="flex-3">
            <h1 className="text-2xl font-semibold">BezMate-AI</h1>
            <p className="text-md mt-2 text-gray-200">
              Empowering businesses with intelligent AI solutions for better
              productivity and growth.
            </p>
          </div>
          <div className="flex flex-4 items-center gap-16 justify-end">
            <div>
              <h1 className="text-lg font-semibold mb-2">Company</h1>
              <ul className="flex flex-col gap-2">
                {companyLinks.map((item, index) => (
                  <Link
                    className="text-md text-gray-200 cursor-pointer transition hover:underline hover:text-white"
                    key={index}
                    href={item.link}
                  >
                    {item.name}
                  </Link>
                ))}
              </ul>
            </div>
            <div>
              <h1 className="text-lg font-semibold mb-2">Resources</h1>
              <ul className="flex flex-col gap-2">
                {resourceLinks.map((item, index) => (
                  <Link
                    className="text-md text-gray-200 cursor-pointer transition hover:underline hover:text-white"
                    key={index}
                    href={item.link}
                  >
                    {item.name}
                  </Link>
                ))}
              </ul>
            </div>
            <div>
              <h1 className="text-lg font-semibold mb-2">Support</h1>
              <ul className="flex flex-col gap-2">
                {supportLinks.map((item, index) => (
                  <Link
                    className="text-md text-gray-200 cursor-pointer transition hover:underline hover:text-white"
                    key={index}
                    href={item.link}
                  >
                    {item.name}
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-600 py-8">
          <div className="flex items-center gap-4">
            <Link
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2e69a4]"
              href="#"
            >
              <Twitter />
            </Link>
            <Link
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2e69a4]"
              href="#"
            >
              <Facebook />
            </Link>
            <Link
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2e69a4]"
              href="#"
            >
              <Linkedin />
            </Link>
          </div>
          <button className="border-none text-white cursor-pointer transition bg-[#f6a821] hover:bg-[#e2991b] py-2 px-4 font-semibold text-lg rounded-lg">
            Start Free Trial
          </button>
        </div>
        <div className="flex items-center justify-center border-t border-gray-600 py-8">
          <p className="text-gray-400 text-sm">
            © 2024 BezMate-AI. All rights reserved. |{" "}
            <Link
              href="/privacy"
              className="hover:text-white transition-colors duration-200 hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link
              href="/terms"
              className="hover:text-white transition-colors duration-200 hover:underline"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicFooter;
