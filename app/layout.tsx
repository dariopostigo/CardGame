import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "primeicons/primeicons.css";
// Única hoja de estilos de la app: Tailwind + las capas ITCSS (ver styles/main.scss).
import "../styles/main.scss";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CardGame · Wiki",
    template: "%s · CardGame Wiki",
  },
  description:
    "Wiki de diseño del juego de cartas y tablero CardGame: reglas, héroes, enemigos, cartas y tablero.",
};

// Aplica tema (claro/oscuro) antes del primer pintado para evitar FOUC.
const themeScript = `(function(){try{var e=document.documentElement;var t=localStorage.getItem('wiki-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)e.classList.add('dark');}catch(_){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
