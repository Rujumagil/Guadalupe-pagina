"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { branding } from "@/config/branding";
import { headerCta, navigation } from "@/config/navigation";
import { TrackedLink } from "./TrackedLink";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="shell nav">
        <Link aria-label="Guadalupe Gómez Pezuela, ir al inicio" className="brand" href="/" onClick={() => setOpen(false)}>
          <Image alt="Guadalupe Gómez Pezuela" height={227} priority src={branding.logo} width={340} />
        </Link>

        <button
          aria-expanded={open}
          aria-controls="guadalupe-navigation"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="menu-toggle"
          type="button"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "×" : "☰"}
        </button>

        <nav id="guadalupe-navigation" aria-label="Navegación principal" className={`nav-links${open ? " open" : ""}`}>
          {navigation.map((item) => (
            <a
              href={item.href}
              key={item.label}
              rel={"external" in item && item.external ? "noopener" : undefined}
              target={"external" in item && item.external ? "_blank" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <TrackedLink
            className="btn btn-primary btn-small"
            eventName="Lead"
            href={headerCta.href}
            rel="noopener"
            target="_blank"
            onClick={() => setOpen(false)}
          >
            {headerCta.label}
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}
