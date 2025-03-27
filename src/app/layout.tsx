import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Unbounded } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FAQ from "@/components/common/FAQ/FAQ";

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
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Header />
        {children}
        <FAQ />
        <Footer />
      </body>
    </html>
  );
}
