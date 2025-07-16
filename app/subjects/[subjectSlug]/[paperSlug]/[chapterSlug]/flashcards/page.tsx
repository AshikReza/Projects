import { getChapterContent, getChapterDetails } from "@/lib/data-loader";
import FlashcardsPageClient from "@/components/flashcard/FlashcardsPageClient";

// Define the shape of the params object
interface FlashcardsPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

// Define the full props object for the page. This is the robust way.
interface PageProps {
  params: FlashcardsPageParams;
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Use the PageProps interface to type the component's props
export default async function FlashcardsPage({ params }: PageProps) {
  // The logic inside the component does not need to change.
  // 'params' is correctly recognized as a resolved object here.
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

  return <FlashcardsPageClient chapter={chapter} flashcards={flashcards} />;
}
