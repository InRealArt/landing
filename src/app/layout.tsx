import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FAQ from "@/components/common/FAQ/FAQ";
import LanguageProvider from "@/components/providers/LanguageProvider";
import Toaster from "@/components/common/Toaster";
import { GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InRealArt",
  description: "InRealArt Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <GoogleTagManager gtmId="GTM-M3W7273P" />
      <body
        className={`${inter.variable} antialiased`}
      >
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M3W7273P"
            height="0" width="0" style={{display: "none", visibility: "hidden"}}>
          </iframe>
        </noscript>


        <LanguageProvider>
          <Header />
          {children}
          <FAQ />
          <Footer />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
