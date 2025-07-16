import { getChapterContent, getChapterDetails } from "@/lib/data-loader";
import FlashcardsPageClient from "@/components/flashcard/FlashcardsPageClient";

interface FlashcardsPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

/**
 * By destructuring only `{ params }` (and omitting any explicit
 * `searchParams`), Next.js will infer the correct PageProps:
 *  - params: { subjectSlug, paperSlug, chapterSlug }
 *  - searchParams?: Record<string, string | string[]>
 */
export default async function FlashcardsPage({
  params,
}: {
  params: FlashcardsPageParams;
}) {
  const { subjectSlug, paperSlug, chapterSlug } = params;

  const [chapter, flashcards] = await Promise.all([
    getChapterDetails(subjectSlug, paperSlug, chapterSlug),
    getChapterContent(subjectSlug, paperSlug, chapterSlug, "flashcards"),
  ]);

  if (!chapter || !flashcards) {
    return <div>Content not found.</div>;
  }

  return <FlashcardsPageClient chapter={chapter} flashcards={flashcards} />;
}
