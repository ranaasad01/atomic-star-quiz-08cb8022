"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/data";
import { APP_NAME } from "@/lib/data";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const navT = t.raw("nav") as Record<string, string>;
  const footerT = t.raw("footer") as Record<string, string>;

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
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-12 w-full py-8 px-4"
      style={{
        background: "var(--foreground)",
        borderTop: "4px solid var(--border)",
      }}
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-2xl">⭐</span>
          <span
            className="text-xl font-bold"
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              color: "var(--border)",
            }}
          >
            {APP_NAME}
          </span>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-4" role="list">
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
                    className="text-sm font-semibold transition-all duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 rounded"
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      color: "var(--border)",
                    }}
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p
          className="text-sm text-center"
          style={{
            fontFamily: "'Nunito', sans-serif",
            color: "var(--accent)",
          }}
        >
          {footerT["tagline"] ?? "Made with ❤️ for curious kids!"}
        </p>
      </div>
    </motion.footer>
  );
}