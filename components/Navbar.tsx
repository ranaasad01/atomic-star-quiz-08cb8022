"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const navT = t.raw("nav") as Record<string, string>;

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
      style={{
        background: "var(--card)",
        borderBottom: "3px solid var(--border)",
        boxShadow: "0 4px 16px rgba(255,215,0,0.18), 0 2px 8px rgba(255,107,107,0.10)",
      }}
    >
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4"
          style={{
            fontFamily: "'Fredoka One', sans-serif",
            color: "var(--primary)",
          }}
          aria-label="Star Quiz home"
        >
          <span aria-hidden="true">⭐</span>
          <span>Star Quiz</span>
        </Link>

        <ul className="flex items-center gap-1 sm:gap-3" role="list">
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith("#");
            const resolvedHref = isAnchor
              ? pathname === "/"
                ? link.href
                : "/" + link.href
              : link.href;

            return (
              <li key={link.key}>
                <Link
                  href={resolvedHref}
                  onClick={
                    isAnchor
                      ? (e) => handleAnchorClick(e, link.href)
                      : undefined
                  }
                  className="rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 sm:px-4 sm:text-base"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    color: "var(--foreground)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "var(--background)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--foreground)";
                  }}
                >
                  {navT[link.key] ?? link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
}
