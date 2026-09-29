"use client";
import { useState } from "react";
import Header from "@/shared/ui/Header";
import NavBar from "@/shared/ui/NavBar";
import type { SiteContactsModel } from "@/shared/content/queries";

export default function TopBar({
  contacts,
}: {
  contacts: SiteContactsModel;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="h-11.5">
        <Header menuOpen={menuOpen} contacts={contacts} />
      </header>
      <NavBar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        travel={contacts.travel}
      />
    </>
  );
}
