import type { Metadata } from "next";
import { Baloo_Da_2 } from "next/font/google"; // Correct font import
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import PageTransition from "@/components/PageTransition";
import { LanguageProvider } from "@/components/LanguageProvider";

// --- UPDATED FONT CONFIGURATION ---
const balooDa2 = Baloo_Da_2({
  // 1. You MUST specify the subsets you need.
  subsets: ["bengali", "latin"],
  // 2. Define a CSS variable for Tailwind to use.
  variable: "--font-sans",
  // You can keep weights if you need them, but this is the minimal setup.
  weight: ["400", "500", "600", "700"],
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
        // --- UPDATED CLASSNAME ---
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          // 3. Apply the font *variable* here.
          balooDa2.variable
        )}
      >
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
