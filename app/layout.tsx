import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";
import { getBaseUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "D&D Name Generators",
    template: "%s | D&D Name Generators",
  },
  description:
    "Free D&D name generators for fantasy characters and NPCs. Generate elf, dwarf, orc, dragonborn, and more names for your campaign.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q789DDCHJT"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q789DDCHJT');
          `}
        </Script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-zinc-900`}>
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-zinc-50 via-white to-white" />
        <div className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-zinc-200/40 blur-3xl" />

        {/* Global header: single Home entry (brand) */}
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur">
          <div className="page flex h-14 items-center justify-between">
            <Link
              href="/en"
              className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-zinc-50"
              aria-label="Go to home (English hub)"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white">
                D
              </span>
              <span className="font-semibold tracking-tight">D&D Name Generators</span>
            </Link>

            <div className="text-xs text-zinc-500 hidden sm:block">
              Free, lore-friendly names for DMs & players
            </div>
          </div>
        </header>

        <main className="page page-y">
          {children}
        </main>
      </body>
    </html>
  );
}
