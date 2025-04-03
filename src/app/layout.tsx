import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FAQ from "@/components/common/FAQ/FAQ";
import LanguageProvider from "@/components/providers/LanguageProvider";

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
      <body
        className={`${inter.variable} antialiased`}
      >
        <LanguageProvider>
          <Header />
          {children}
          <FAQ />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
