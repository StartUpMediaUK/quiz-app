import { AppContainer } from "@/components/ui/layout/container";
import { TRPCReactProvider } from "@/trpc/react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "../lib/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yoururl.com"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["Quiz"],
  authors: [
    {
      name: "yourname",
      url: "",
    },
  ],
  creator: "yourname",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden scroll-auto bg-background selection:bg-orange-100 selection:text-orange-600`}>
        <ThemeProvider defaultTheme="system" disableTransitionOnChange attribute="class">
          <AppContainer>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </AppContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}
