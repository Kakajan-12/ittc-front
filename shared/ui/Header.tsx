"use client";
import React from "react";
import Image from "next/image";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import LangSwitcher from "../LangSwither";
import type { SiteContactsModel } from "@/shared/content/queries";

function Header({
  menuOpen = false,
  contacts,
}: {
  menuOpen?: boolean;
  contacts: SiteContactsModel;
}) {
  // The strip only has room for one of each; the editor picks which by order.
  const [phone] = contacts.phones;
  const [email] = contacts.emails;

  return (
    <div
      className={`bg-brand-blue-dark fixed top-0 left-0 right-0 h-12 ${
        menuOpen ? "z-70" : "z-80"
      }`}
    >
      <div className="px-4 lg:px-10 py-1 header-content flex justify-between items-center text-white h-full">
        <a href={contacts.partnerUrl} target="_blank" className="header-logo h-full w-fit py-1">
          <Image
            src="/logoOguz.svg"
            alt="Oguz Forum & Expo"
            width={100}
            height={100}
            className="h-full w-full"
            priority
          />
        </a>
        <div className="header-menu">
          <ul className="flex items-center gap-6 text-sm">
            <li className="hidden md:flex items-center pr-6 border-r border-[#2222B6]">
              <a
                href={phone.href}
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <FiPhone className="size-4" />{" "}
                <p className="pt-1">{phone.value}</p>
              </a>
            </li>
            <li className="hidden md:flex items-center pr-6 border-r border-[#2222B6]">
              <a
                href={email.href}
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <MdOutlineEmail className="size-4" />
                <p className="pt-1">{email.value}</p>
              </a>
            </li>
            <li className=" flex items-center gap-2 z-50">
              <LangSwitcher />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
