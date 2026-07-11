"use client";
import React from "react";
import Image from "next/image";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import LangSwitcher from "../LangSwither";

function Header({ menuOpen = false }: { menuOpen?: boolean }) {
  return (
    <div
      className={`bg-brand-blue-dark fixed top-0 left-0 right-0 h-11.5 ${
        menuOpen ? "z-70" : "z-80"
      }`}
    >
      <div className="px-4 lg:px-10 py-1 header-content flex justify-between items-center text-white">
        <a href="https://oguzforum.com" target="_blank" className="header-logo">
          <Image
            src="/logoOguz.svg"
            alt="ITTC"
            width={97}
            height={36}
            className="h-9 w-auto"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </a>
        <div className="header-menu">
          <ul className="flex items-center gap-6 text-sm">
            <li className="hidden md:flex items-center pr-6 border-r border-[#2222B6]">
              <a
                href="tel:+905321234567"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <FiPhone className="mt-0.5 size-5" />{" "}
                <span>+99361 480 080</span>
              </a>
            </li>
            <li className="hidden md:flex items-center pr-6 border-r border-[#2222B6]">
              <a
                href="mailto:info@oguzforum.com"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <MdOutlineEmail className="mt-0.5 size-5" />
                <span>info@oguzforum.com</span>
              </a>
            </li>
            <li className=" flex items-center gap-2">
              <LangSwitcher isOpen={true} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
