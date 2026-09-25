import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import { site } from "@/data/site";
import { services } from "@/data/services";
import "./globals.css";

const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-unbounded", display: "swap" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jetbrains", display: "swap" });

const title = `${site.fullName} — сайты, приложения и программы под ключ`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.fullName}` },
  description: site.description,
  keywords: ["разработка сайтов", "веб-приложения", "мобильные приложения", "Telegram-боты", "студия разработки", "WebGL", "Next.js"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "ru_RU", url: site.url, siteName: site.fullName, title, description: site.description },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07080b",
  colorScheme: "dark",
};

// Runs before first paint: decides preloader/cursor mode without a flash of the wrong state.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||sessionStorage.getItem('${site.storageKey}'))d.classList.add('skip-preload');else d.classList.add('is-loading');if(!r&&matchMedia('(pointer: fine)').matches)d.classList.add('has-cursor')}catch(e){d.classList.add('skip-preload')}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.fullName,
      url: site.url,
      email: site.email,
      telephone: site.phone,
      foundingDate: String(site.founded),
      address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "RU" },
      sameAs: site.socials.map((s) => s.href),
    },
    ...services.map((s) => ({
      "@type": "Service",
      name: s.title,
      description: s.description,
      provider: { "@id": `${site.url}/#org` },
      areaServed: "RU",
      offers: { "@type": "Offer", priceCurrency: "RUB", price: s.price.replace(/\D/g, ""), description: s.price },
    })),
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${manrope.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        {children}
      </body>
    </html>
  );
}
