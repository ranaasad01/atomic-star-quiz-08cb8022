import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "Star Quiz — Fun Quiz Game for Kids!",
  description: "Answer 8 fun questions about animals, colours and space. Earn stars for every right answer! A safe, playful quiz game for kids aged 6–10.",
  openGraph: {
    title: "Star Quiz — Fun Quiz Game for Kids!",
    description: "Answer 8 fun questions about animals, colours and space. Earn stars for every right answer!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="#"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}