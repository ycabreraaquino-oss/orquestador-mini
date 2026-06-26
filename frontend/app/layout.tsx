import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orquestador de Intenciones",
  description: "Ecosistema de Orquestación Autónoma — v0.1",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className="bg-black min-h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff", margin: 0, padding: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
