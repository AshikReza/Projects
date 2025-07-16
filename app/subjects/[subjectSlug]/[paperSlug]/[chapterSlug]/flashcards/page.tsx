import { getChapterContent, getChapterDetails } from "@/lib/data-loader";
import FlashcardsPageClient from "@/components/flashcard/FlashcardsPageClient"; // <-- Import the new manager component

// Define the interface for the 'params' object itself
interface FlashcardsPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

// Correctly type the props for the Page component
export default async function FlashcardsPage({
  params,
}: {
  params: FlashcardsPageParams;
}) {
  // 'params' is now a resolved object, no 'await' needed here
  const [chapter, flashcards] = await Promise.all([
    getChapterDetails(params.subjectSlug, params.paperSlug, params.chapterSlug),
    getChapterContent(
      params.subjectSlug,
      params.paperSlug,
      params.chapterSlug,
      "flashcards"
    ),
  ]);

  if (!chapter || !flashcards) {
    return <div>Content not found.</div>;
  }

  // Render the FlashcardsPageClient, passing the fetched data
  return <FlashcardsPageClient chapter={chapter} flashcards={flashcards} />;
}
