import ClientAnalytics from "@/components/client-analytics";
import ClientErrorTracker from "@/components/client-error-tracker";
import { getAdsenseAccount, getSiteUrl } from "@/lib/runtime-config";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QR Code Generator - Free Online QR Creator",
    template: "%s | QR Code Generator",
  },
  description:
    "Generate custom QR codes online for URLs, WiFi, contact cards, and text. Download high-quality PNG or SVG with logo and color options.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "QR Code Generator - Free Online QR Creator",
    description:
      "Generate custom QR codes online for URLs, WiFi, contact cards, and text. Download high-quality PNG or SVG with logo and color options.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "QR Code Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator - Free Online QR Creator",
    description:
      "Create customizable QR codes for URLs, WiFi, vCards, and text. Download PNG or SVG instantly.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseAccount = getAdsenseAccount();
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>{adsenseAccount ? <meta name="google-adsense-account" content={adsenseAccount} /> : null}</head>
      <body className="min-h-full flex flex-col">
        {adsenseAccount ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseAccount}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <ClientAnalytics />
        <ClientErrorTracker />
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 sm:px-6 lg:px-8">
          <header className="mt-3 rounded-2xl border border-black/10 bg-white/85 px-4 py-3 shadow-sm backdrop-blur sm:mt-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                QR Code Generator
              </Link>
              <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-full px-3 py-1.5 hover:bg-black/5">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="flex-1 py-8">{children}</main>

          <footer className="mb-4 rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>Free browser-based QR tools with privacy-first processing.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/privacy-policy" className="underline-offset-4 hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="underline-offset-4 hover:underline">
                  Terms
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
