"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

interface ChapterHeaderProps {
  chapterTitle: string;
  subjectName: string;
  paperName: string;
  basePath: string; // e.g., /subjects/chemistry/first-paper/qualitative-chemistry
}

export default function ChapterHeader({
  chapterTitle,
  subjectName,
  paperName,
  basePath,
}: ChapterHeaderProps) {
  const pathname = usePathname();

  // The button should only show if the current path is NOT the base path.
  // e.g., show on '/.../qualitative-chemistry/quiz'
  // but hide on '/.../qualitative-chemistry'
  const showBackButton = pathname !== basePath;

  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between items-start">
      <div>
        <h1 className="text-4xl font-bold mb-2">{chapterTitle}</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Chapter from {subjectName} – {paperName}
        </p>
      </div>

      {/* Conditionally render the button */}
      {showBackButton && (
        <Button className="mb-5" asChild>
          <Link href={basePath}>Back to Chapter</Link>
        </Button>
      )}
    </div>
  );
}
