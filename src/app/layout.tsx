import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";

import site from "@/data/site.json";
import navigation from "@/data/navigation.json";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { InitialLoadingOverlay } from "@/components/ui/InitialLoadingOverlay";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.siteTitle,
  description: site.siteDescription,
  keywords: site.keywords,
  authors: [{ name: site.author }],
  metadataBase: new URL(site.openGraph.url),
  openGraph: {
    title: site.siteTitle,
    description: site.siteDescription,
    url: site.openGraph.url,
    siteName: site.siteName,
    type: "website",
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: site.siteTitle,
    description: site.siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={site.language}
      data-theme="dark"
      className={`${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-screen font-sans text-slate-50 antialiased">
        <ThemeProvider defaultTheme="dark">
          <LocaleProvider defaultLocale="es">
            <BackgroundGrid />
            <InitialLoadingOverlay />
            <Header navigation={navigation} />
            <main className="relative z-10 pt-[72px]">{children}</main>
            <Footer />
            <BackToTopButton />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
