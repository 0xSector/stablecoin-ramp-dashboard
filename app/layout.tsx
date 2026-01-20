import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stablecoin Ramping Costs Dashboard",
  description: "Track global stablecoin on-ramp and off-ramp costs across regions and funding methods",
  keywords: ["stablecoin", "USDT", "USDC", "on-ramp", "off-ramp", "crypto", "fiat"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-slate-100`}>
        {children}
      </body>
    </html>
  );
}
