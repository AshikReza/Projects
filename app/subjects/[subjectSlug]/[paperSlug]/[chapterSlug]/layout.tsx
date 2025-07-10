// app/subjects/[subjectSlug]/[paperSlug]/[chapterSlug]/layout.tsx

import {
  getChapterDetails,
  getChapters,
  getSubjectBySlug,
  getSubjects,
} from "@/lib/data-loader";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  const subjects = await getSubjects();
  const allPaths: {
    subjectSlug: string;
    paperSlug: string;
    chapterSlug: string;
  }[] = [];

  for (const subject of subjects) {
    if (subject.hasPapers && subject.papers) {
      for (const paper of subject.papers) {
        // Build‑time load to skip missing chapter files
        const chapters = await getChapters(subject.slug, paper.slug, true);
        for (const chapter of chapters) {
          allPaths.push({
            subjectSlug: subject.slug,
            paperSlug: paper.slug,
            chapterSlug: chapter.slug,
          });
        }
      }
    }
  }

  return allPaths;
}

export default async function ChapterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // NEXT 15 requires params to be async
  params: Promise<{
    subjectSlug: string;
    paperSlug: string;
    chapterSlug: string;
  }>;
}) {
  // await before using
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  const [subject, chapter] = await Promise.all([
    getSubjectBySlug(subjectSlug),
    getChapterDetails(subjectSlug, paperSlug, chapterSlug),
  ]);

  const paper = subject.papers?.find((p) => p.slug === paperSlug);

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex items-center space-x-2 text-md sm:text-xl text-muted-foreground mb-6">
        <Link href="/subjects" className="hover:text-primary">
          Subjects
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/subjects/${subjectSlug}`} className="hover:text-primary">
          {subject.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{paper?.name}</span>
      </div>

      <h1 className="text-4xl font-bold mb-2">{chapter.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Chapter from {subject.name} – {paper?.name}
      </p>

      {children}
    </div>
  );
}
