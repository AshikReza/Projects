import type { Metadata } from "next";
import { Inter } from "next/font/google";
// 1. Import the new font that supports both Bangla and English
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import PageTransition from "@/components/PageTransition";

import { LanguageProvider } from "@/components/LanguageProvider"; // <-- Import

// 2. Configure the font with the necessary character subsets
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"], // 'latin' for English, 'bengali' for Bangla
  weight: ["300", "400", "500", "600", "700"], // Include various font weights
  variable: "--font-sans", // Assign it to the same CSS variable
});

export const metadata: Metadata = {
  title: "HSC Note App",
  description: "Your ultimate study companion for HSC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          // 3. Apply the font's class to the entire application
          hindSiliguri.variable
        )}
      >
        {/* Wrap ThemeProvider with LanguageProvider */}
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <PageTransition>{children}</PageTransition>
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
