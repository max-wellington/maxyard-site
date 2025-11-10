"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Bayside Yard Parking
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "transition hover:text-slate-900",
                pathname === link.href && "text-slate-900"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#reserve"
            className="rounded-full border border-slate-900 px-4 py-1.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            Reserve
          </Link>
        </nav>
      </div>
    </header>
  );
}

