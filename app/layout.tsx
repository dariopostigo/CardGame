import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "primeicons/primeicons.css";
import "./globals.css";
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

// Aplica tema (claro/oscuro) y skin antes del primer pintado para evitar FOUC.
const themeScript = `(function(){try{var e=document.documentElement;var t=localStorage.getItem('wiki-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)e.classList.add('dark');var s=localStorage.getItem('wiki-skin');if(s)e.setAttribute('data-skin',s);}catch(_){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-skin="moderno"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
