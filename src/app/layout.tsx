import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import { NextAuthProvider } from "@/contexts/sessionProvider";
import { ToasterProvider } from "@/providers/toaster-provider";

export const metadata: Metadata = {
  title: "ProjectFlow - Modern Project Management",
  description: "A comprehensive project management tool for modern teams",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextAuthProvider>{children}</NextAuthProvider>
          </ThemeProvider>
          <ToasterProvider/>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
