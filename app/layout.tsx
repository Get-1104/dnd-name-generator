import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getBaseUrl } from "@/lib/site";
import GlobalHeader from "@/components/GlobalHeader";

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

      <body className="antialiased text-zinc-900">
        {/* Single global header (brand + race tabs) */}
        <GlobalHeader />

        {/* Reserve space for sticky header to avoid overlap (adjust if header height changes) */}
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
