"use client";

import { Spectral } from "next/font/google";
import "@/_styles/globals.css";
import Header from "@/_components/navigation/header/header";
import Footer from "@/_components/navigation/footer/footer";
import { CartProvider } from "@/_contexts/cart-context";
import RecaptchaProvider from "@/_lib/recaptcha-provider";
import { Analytics } from "@vercel/analytics/next";

const spectralSerif = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spectralSerif.variable} antialiased`}>
        <RecaptchaProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </RecaptchaProvider>
        <Analytics />
      </body>
    </html>
  );
}
