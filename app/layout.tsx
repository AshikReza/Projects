import type { Metadata } from "next";
import { Baloo_Da_2 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import PageTransition from "@/components/PageTransition";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ModeToggle } from "@/components/theme-toggle";

// --- GOOGLE FONT: Baloo Da 2 ---
const balooDa2 = Baloo_Da_2({
  subsets: ["latin", "bengali"], // include Bengali if you need Bangla support
  variable: "--font-baloo-da-2",
});

export const metadata: Metadata = {
  title: "HSC Note App",
  description: "Your ultimate study companion for HSC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={cn(
          balooDa2.className, // next/font generated class
          "min-h-screen", // full viewport height
          "bg-background", // your background color
          "antialiased"
          // no need for font-sans, since we override it in tailwind.config.js
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
            <div className="absolute sm:top-6 top-12 right-6 sm:right-34">
              <ModeToggle />
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
