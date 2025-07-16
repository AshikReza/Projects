import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket } from "lucide-react";

import { BackgroundLines } from "@/components/ui/background-lines";

// Change this from "export function BackgroundLinesDemo()" to "export default function HomePage()"
export default function HomePage() {
  return (
    // The component you are using as the page root should be the top-level element.
    // In this case, it seems to be BackgroundLines.
    <BackgroundLines className="flex items-center justify-center min-h-screen w-full flex-col px-4">
      <Rocket className="h-24 w-24 text-primary animate-bounce" />
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        HSC Note Navigator
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        Your all-in-one companion for acing the HSC exams. Access notes,
        flashcards, quizzes, and more.
      </p>

      <div className="absolute bottom-28">
        <Button asChild size="lg" className="px-10 py-6 text-lg hover:scale-105">
          <Link href="/subjects">Get Started</Link>
        </Button>
      </div>
    </BackgroundLines>
  );
}
