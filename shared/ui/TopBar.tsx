"use client";
import { useState } from "react";
import Header from "@/shared/ui/Header";
import NavBar from "@/shared/ui/NavBar";

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="h-11.5">
        <Header menuOpen={menuOpen} />
      </header>
      <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}
