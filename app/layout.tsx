import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer, WhatsAppButton } from "@/components/layout/Footer";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import { SITE } from "@/lib/content/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Your Global Logistics Partner`, template: `%s | ${SITE.name}` },
  description:
    "Meem Continental Logistics (MCL) – land, sea and air cargo transportation, Lakshadweep cargo and worldwide doorstep delivery.",
  applicationName: SITE.name,
  openGraph: { siteName: SITE.name, type: "website", locale: "en_GB", images: [{ url: "/images/hero-ship.png" }] },
};

export const viewport: Viewport = { themeColor: "#0b1533" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <a href="#main" className="absolute -top-16 left-4 z-[100] rounded-[10px] bg-navy px-4 py-2.5 text-white focus:top-4 focus:text-white">
          Skip to content
        </a>
        <QuoteProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
        </QuoteProvider>
      </body>
    </html>
  );
}
