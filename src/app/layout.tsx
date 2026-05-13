import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeInitializer from "@/components/ThemeInitializer";
import SplashScreen from "@/components/SplashScreen";
import ServiceWorker from "@/components/ServiceWorker";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

async function getSettings() {
  try {
    const { query } = await import("@/lib/database");
    const rows = query<{ key: string; value: string }>(
      "SELECT key, value FROM settings WHERE key IN ('schoolName', 'shortName', 'primaryColor')"
    );
    const map: Record<string, string> = {};
    rows.forEach((r: any) => { map[r.key] = r.value; });
    return map;
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings.schoolName || "SMP Muhammadiyah 1 Genteng";
  const short = settings.shortName || name;

  return {
    title: `${name} - Sekolah Unggul Berkemajuan`,
    description: `Website resmi ${name} Banyuwangi - SPMB Online, Program Unggulan, Akreditasi A, Fasilitas Lengkap`,
    keywords: "SMP, Muhammadiyah, Genteng, Banyuwangi, SPMB, SPMB, Sekolah Islam",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: short,
      statusBarStyle: "black-translucent",
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var c=JSON.parse(localStorage.getItem("theme_colors"));if(c){var s=document.createElement("style");s.id="theme-style";var r="";if(c.primaryColor)r+="--primary:"+c.primaryColor+";";if(c.secondaryColor)r+="--secondary:"+c.secondaryColor+";";if(c.accentColor)r+="--accent:"+c.accentColor+";";s.textContent=":root{"+r+"}";document.head.appendChild(s);}var u=JSON.parse(localStorage.getItem("site_identity"));if(u){var m=document.querySelector("meta[name='application-name']");if(m)m.setAttribute("content",u.shortName||u.schoolName);var a=document.querySelector("meta[name='apple-mobile-web-app-title']");if(a)a.setAttribute("content",u.shortName||u.schoolName);}var t=document.querySelector("meta[name='theme-color']");if(t&&c&&c.primaryColor)t.setAttribute("content",c.primaryColor);}catch(e){}})();`
        }} />
        <meta name="theme-color" content="#1B5E20" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)" />
        <meta name="application-name" content="SMP Muhammadiyah 1 Genteng" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SMP Muhammadiyah 1 Genteng" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512.png" />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <ThemeProvider>
          <ThemeInitializer />
          <SplashScreen />
          <ServiceWorker />
          <NavbarWrapper />
          <main className="flex-grow md:pt-16 page-enter">{children}</main>
          <FooterWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
