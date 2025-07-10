import { getChapterContent, getChapterDetails } from "@/lib/data-loader";
import FlashcardsClient from "@/components/FlashcardsClient";

interface FlashcardsPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<FlashcardsPageParams>;
}) {
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  // Fetch both chapter details (for topics) and flashcards
  const [chapter, flashcards] = await Promise.all([
    getChapterDetails(subjectSlug, paperSlug, chapterSlug),
    getChapterContent(subjectSlug, paperSlug, chapterSlug, "flashcards"),
  ]);

  // Render the FlashcardsClient, passing both chapter and flashcards
  return <FlashcardsClient chapter={chapter} flashcards={flashcards} />;
}
