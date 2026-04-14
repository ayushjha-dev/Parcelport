import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ParcelPort - University Parcel Delivery Management",
  description: "Streamlined parcel delivery system for university hostels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-full flex flex-col font-inter">
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
