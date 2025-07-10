// app/subjects/[subjectSlug]/[paperSlug]/[chapterSlug]/layout.tsx

import {
  getChapterDetails,
  getChapters,
  getSubjectBySlug,
  getSubjects,
} from "@/lib/data-loader";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChapterHeader from "@/components/ChapterHeader"; // <-- 1. Import the new component

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
  params: Promise<{
    subjectSlug: string;
    paperSlug: string;
    chapterSlug: string;
  }>;
}) {
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  const [subject, chapter] = await Promise.all([
    getSubjectBySlug(subjectSlug),
    getChapterDetails(subjectSlug, paperSlug, chapterSlug),
  ]);

  const paper = subject.papers?.find((p) => p.slug === paperSlug);

  if (!paper) {
    notFound();
  }

  // --- 2. Define the base path for the chapter ---
  const chapterBasePath = `/subjects/${subjectSlug}/${paper.slug}/${chapterSlug}`;

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      {/* Breadcrumbs remain here as they don't need client-side logic */}
      <div className="flex items-center space-x-2 text-md sm:text-xl text-muted-foreground mb-6">
        <Link href="/subjects" className="hover:text-primary">
          Subjects
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/subjects/${subjectSlug}`} className="hover:text-primary">
          {subject.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{paper.name}</span>
      </div>

      {/* --- 3. Replace the old header with the new client component --- */}
      <ChapterHeader
        chapterTitle={chapter.title}
        subjectName={subject.name}
        paperName={paper.name}
        basePath={chapterBasePath}
      />

      {children}
    </div>
  );
}
