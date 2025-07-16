import type { Metadata } from "next";
import { Baloo_Da_2 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import PageTransition from "@/components/PageTransition";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ModeToggle } from "@/components/theme-toggle";
import Footer from "@/components/Footer";

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
          balooDa2.className,
          "min-h-screen bg-background antialiased"
        )}
      >
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Main container that controls the page layout */}
            <div className="relative flex min-h-screen flex-col">
              <div className="absolute sm:top-6 top-12 right-6 sm:right-34 z-10">
                <ModeToggle />
              </div>

              {/* Main content area that grows and can scroll if needed */}
              <main className="flex-grow">
                {/* The PageTransition component handles the actual page content */}
                <PageTransition>{children}</PageTransition>
              </main>

              {/* Footer is the last element in the flex column */}
              <Footer />
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
