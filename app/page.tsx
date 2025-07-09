import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center p-4">
      <div className="flex flex-col items-center gap-4">
        <Rocket className="h-24 w-24 text-primary animate-bounce" />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          HSC Note Navigator
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Your all-in-one companion for acing the HSC exams. Access notes,
          flashcards, quizzes, and more.
        </p>
      </div>
      <div className="absolute bottom-20">
        <Button asChild size="lg" className="px-10 py-6 text-lg">
          <Link href="/subjects">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
