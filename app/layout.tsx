import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Compare Q-Commerce Prices in India | Compare. Save. Buy Smarter.",
  description:
    "Compare grocery prices across India's quick-commerce platforms and find the best deal near you.",
  metadataBase: new URL("https://whyq.app"),
  openGraph: {
    title: "Compare Q-Commerce Prices in India | Compare. Save. Buy Smarter.",
    description:
      "Compare grocery prices across India's quick-commerce platforms and find the best deal near you.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
