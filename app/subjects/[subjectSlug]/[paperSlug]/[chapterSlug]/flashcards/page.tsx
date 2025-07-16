// app/subjects/[subjectSlug]/[paperSlug]/[chapterSlug]/flashcards/page.tsx

import { getChapterContent, getChapterDetails } from "@/lib/data-loader";
import FlashcardsPageClient from "@/components/flashcard/FlashcardsPageClient";

interface FlashcardsPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

/**
 * Next.js’s generated PageProps currently look like:
 *   interface PageProps {
 *     params: Promise<Record<string, string>>;
 *     searchParams?: Promise<any>;
 *   }
 *
 * We mirror that here, so TS will be happy:
 */
type NextPageProps = {
  params: Promise<FlashcardsPageParams>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export default async function FlashcardsPage({ params }: NextPageProps) {
  // Await both in case searchParams is passed (even if you don’t use it):
  const { subjectSlug, paperSlug, chapterSlug } = await params;
  // If you need query params later, you can:
  // const qp = searchParams ? await searchParams : {};

  const [chapter, flashcards] = await Promise.all([
    getChapterDetails(subjectSlug, paperSlug, chapterSlug),
    getChapterContent(subjectSlug, paperSlug, chapterSlug, "flashcards"),
  ]);

  if (!chapter || !flashcards) {
    return <div>Content not found.</div>;
  }

  return <FlashcardsPageClient chapter={chapter} flashcards={flashcards} />;
}
